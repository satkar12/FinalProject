import express, { Request, Response } from "express";
import cors from "cors";
import formidable from "formidable";
import fs from "fs";
import pdf from "pdf-parse";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

// Hugging Face API key
const HF_API_KEY = process.env.HF_API_KEY;
if (!HF_API_KEY) {
    console.error("❌ HF_API_KEY is missing in .env");
    process.exit(1);
}

// --------------------
// Helper: Hugging Face Request
// --------------------
async function hfRequest(model: string, body: any, isImage = false) {
    const headers: any = {
        Authorization: `Bearer ${HF_API_KEY}`,
    };
    if (!isImage) headers["Content-Type"] = "application/json";

    const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers,
        body,
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HF API error: ${res.status} ${errText}`);
    }

    return res.json();
}

// --------------------
// Extract text from PDF
// --------------------
async function extractTextFromPDF(filePath: string) {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
}

// --------------------
// Extract text from Image (OCR + Caption)
// --------------------
async function extractTextFromImage(fileBuffer: Buffer) {
    // TrOCR OCR
    const ocrResult = await hfRequest("microsoft/trocr-large-printed", fileBuffer, true);
    const ocrText = ocrResult?.[0]?.generated_text || "";

    // BLIP Caption
    const captionResult = await hfRequest("Salesforce/blip-image-captioning-large", fileBuffer, true);
    const captionText = captionResult?.[0]?.generated_text || "";

    return `${ocrText}\n${captionText}`.trim();
}

// --------------------
// Summarize text
// --------------------
async function summarizeText(text: string) {
    const summaryResult = await hfRequest(
        "facebook/bart-large-cnn",
        JSON.stringify({ inputs: text })
    );
    return summaryResult?.[0]?.summary_text || "Unable to summarize";
}

// --------------------
// Generate Key Points
// --------------------
async function generateKeyPoints(text: string) {
    const keypointsResult = await hfRequest(
        "facebook/bart-large-cnn",
        JSON.stringify({ inputs: `Write 5 bullet points for:\n${text}` })
    );
    return keypointsResult?.[0]?.summary_text || "";
}

// --------------------
// Main Route
// --------------------
app.post("/extract-summarize", (req: Request, res: Response) => {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: "File upload error" });

        const file = files.file as any;
        if (!file) return res.status(400).json({ error: "No file provided" });

        const filePath = file.filepath;
        const fileType = file.mimetype;

        try {
            let extractedText = "";

            if (fileType === "application/pdf") {
                extractedText = await extractTextFromPDF(filePath);
            } else if (fileType?.startsWith("image/")) {
                const buffer = fs.readFileSync(filePath);
                extractedText = await extractTextFromImage(buffer);
            } else {
                return res.status(400).json({ error: "Unsupported file type" });
            }

            const summary = await summarizeText(extractedText);
            const keypoints = await generateKeyPoints(extractedText);

            res.json({ extractedText, summary, keypoints });
        } catch (e: any) {
            console.error("Processing error:", e);
            res.status(500).json({ error: e.message || "Processing failed" });
        }
    });
});

// --------------------
// Start server
// --------------------
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
