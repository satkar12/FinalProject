import os
import pytesseract
import nltk
import torch 
import re
from fastapi import HTTPException
from typing import Dict

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
from pdf2image import convert_from_path
from pptx import Presentation
from transformers import T5Tokenizer, T5ForConditionalGeneration
from nltk.tokenize import sent_tokenize

# ---------------- INIT ----------------
nltk.download("punkt")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


app = FastAPI(title="QuickPrep AI Summarizer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- LOAD MODEL ONCE ----------------
print("Loading T5 model...")

tokenizer = T5Tokenizer.from_pretrained("t5-small")
model = T5ForConditionalGeneration.from_pretrained("t5-small")

device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

print("Model loaded.")

# ---------------- FILE READERS ----------------
def read_pdf(path):
    text = ""
    reader = PdfReader(path)
    for page in reader.pages:
        if page.extract_text():
            text += page.extract_text()
    return text

def read_scanned_pdf(path):
    text = ""
    images = convert_from_path(path)
    for img in images:
        text += pytesseract.image_to_string(img)
    return text

def read_pptx(path):
    prs = Presentation(path)
    text = ""
    for slide in prs.slides:
        for shape in slide.shapes:
            if hasattr(shape, "text"):
                text += shape.text + "\n"
    return text

def is_heading_pdf(line: str) -> bool:
    return (
        line.isupper() or
        re.match(r"^\d+(\.\d+)*\s+.+", line) or
        (len(line.split()) <= 6 and line.endswith(":"))
    )
def split_pdf_by_headings(text: str) -> Dict[str, str]:
    lines = text.split("\n")
    sections = {}
    current_heading = "Introduction"
    sections[current_heading] = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        if is_heading_pdf(line):
            current_heading = line
            sections[current_heading] = []
        else:
            sections[current_heading].append(line)

    return {k: " ".join(v) for k, v in sections.items()}
def extract_pptx_blocks(path):
    prs = Presentation(path)
    blocks = []

    for slide in prs.slides:
        for shape in slide.shapes:
            if not shape.has_text_frame:
                continue

            for p in shape.text_frame.paragraphs:
                runs = []
                for r in p.runs:
                    runs.append({
                        "text": r.text.strip(),
                        "bold": r.font.bold,
                        "size": r.font.size.pt if r.font.size else None
                    })
                blocks.append(runs)

    return blocks
def avg_font_size(blocks):
    sizes = [r["size"] for b in blocks for r in b if r["size"]]
    return sum(sizes) / len(sizes) if sizes else 18
def is_heading_pptx(block, avg_size):
    text = " ".join(r["text"] for r in block).strip()
    if not text:
        return False

    max_size = max((r["size"] or 0) for r in block)
    is_bold = any(r["bold"] for r in block)
    words = len(text.split())

    return (
        max_size >= avg_size + 1
        or (is_bold and words <= 15)
        or (words <= 6 and not text.endswith("."))
    )

def split_pptx_by_headings(path):
    blocks = extract_pptx_blocks(path)
    avg_size = avg_font_size(blocks)

    sections = {}
    current_heading = "Introduction"
    sections[current_heading] = []

    for block in blocks:
        text = " ".join(r["text"] for r in block).strip()
        if not text:
            continue

        if is_heading_pptx(block, avg_size):
            print(f"DETECTED HEADING: {repr(text)}")  # <-- debug each heading found
            current_heading = text
            sections[current_heading] = []
        else:
            sections[current_heading].append(text)

    print("FINAL HEADINGS:", list(sections.keys()))  # <-- debug AFTER loop
    return {k: " ".join(v) for k, v in sections.items()}

# ---------------- TEXT CHUNKING ----------------
def chunk_text(text, max_len=800):
    sentences = sent_tokenize(text)
    chunks, current = [], ""

    for s in sentences:
        if len(current) + len(s) < max_len:
            current += s + " "
        else:
            chunks.append(current)
            current = s + " "

    if current:
        chunks.append(current)

    return chunks


def summarize_text(text: str) -> str:
    chunks = chunk_text(text)
    points = []

    for chunk in chunks:
        prompt = "summarize academic notes  in concise bullet points: " + chunk

        inputs = tokenizer.encode(
            prompt,
            return_tensors="pt",
            truncation=True,
            max_length=512
        ).to(device)

        output = model.generate(
            inputs,
            max_length=120,
            min_length=40,
            num_beams=4,
            length_penalty=2.0,
            early_stopping=True,
        )

        summary_text = tokenizer.decode(
            output[0],
            skip_special_tokens=True
        )

        # convert summary to points
        for sent in sent_tokenize(summary_text):
            sent = sent.strip()
            if len(sent) > 10:
                points.append(sent)

    # remove duplicates & keep max 6 points
    unique_points = list(dict.fromkeys(points))
    return unique_points[:6]

# ---------------- SUMMARIZATION ----------------

# ---------------- API ENDPOINT ----------------

@app.post("/summarize-pdf")
async def summarize_pdf(file: UploadFile = File(...)):
    # Save upload
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported for now.")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # 1) Try text PDF first
    text = read_pdf(file_path)
    if not text.strip():
        # Fallback: scanned PDF via OCR
        text = read_scanned_pdf(file_path)

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

    # 2) Split by headings
    sections = split_pdf_by_headings(text)
      # {heading: body_text}

    # 3) Summarize each section
    summarized_sections:Dict[str,list[str]] = {}
    for heading, body in sections.items():
        if not body.strip():
            continue
        summarized_sections[heading] = summarize_text(body)
    return {
        "sections": [       
            {"heading": h, "points": s}
            for h, s in summarized_sections.items()
        ]       
    }
    
@app.post("/summarize-pptx")
async def summarize_pptx(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pptx"):
        raise HTTPException(status_code=400, detail="Only PPTX files are supported for now.")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    sections = split_pptx_by_headings(file_path)  # {heading: body}
    summarized_sections:Dict[str,list[str]] = {}

    for heading, body in sections.items():
        if not body.strip():
            continue
        summarized_sections[heading] = summarize_text(body)

    return {
        "sections": [
            {"heading": h, "points": s}
            for h, s in summarized_sections.items()
        ]
    }

