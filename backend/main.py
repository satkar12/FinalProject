from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
import io
import json

from mcq_generator import generate_mcqs

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend localhost
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-mcq")
async def generate_mcq(file: UploadFile = File(...)):
    # Read PDF
    pdf_bytes = await file.read()
    reader = PdfReader(io.BytesIO(pdf_bytes))

    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""

    if len(text.strip()) < 100:
        return {"error": "PDF has insufficient text"}

    # Generate MCQs
    mcqs_raw = generate_mcqs(text)

    try:
        mcqs = json.loads(mcqs_raw)
    except:
        return {
            "error": "Model returned invalid JSON",
            "raw": mcqs_raw
        }

    return {
        "questions": mcqs
    }
