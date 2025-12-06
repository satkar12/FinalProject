import express, { Request, Response } from "express";
import cors from "cors";
import formidable from "formidable";
import fs from "fs";
import pdf from "pdf-parse";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const PORT = process.env.PORT || 4000;

// Hugging Face API key
const HF_API_KEY = process.env.HF_API_KEY;
if (!HF_API_KEY) {
    console.error("❌ HF_API_KEY is missing in .env");
    process.exit(1);
}

// --------------------
// Hugging Face request
// --------------------
async function hfRequest(model: string, body: any, isImage = false) {
    const headers: any = { Authorization: `Bearer ${HF_API_KEY}` };
    if (!isImage) headers["Content-Type"] = "application/json";

    const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers,
        body: isImage ? body : JSON.stringify(body),
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
// Extract text from Image
// --------------------
async function extractTextFromImage(fileBuffer: Buffer) {
    const ocrResult = (await hfRequest("microsoft/trocr-large-printed", fileBuffer, true)) as any[];
    const ocrText = ocrResult?.[0]?.generated_text || "";

    const captionResult = (await hfRequest("Salesforce/blip-image-captioning-large", fileBuffer, true)) as any[];
    const captionText = captionResult?.[0]?.generated_text || "";

    return `${ocrText}\n${captionText}`.trim();
}

// --------------------
// Summarize text
// --------------------
async function summarizeText(text: string) {
    const summaryResult = await hfRequest("facebook/bart-large-cnn", { inputs: text }) as any[];
    return summaryResult?.[0]?.summary_text || "Unable to summarize";
}

// --------------------
// Generate key points
// --------------------
async function generateKeyPoints(text: string) {
    const keypointsResult = await hfRequest(
        "facebook/bart-large-cnn",
        { inputs: `Write 5 bullet points for:\n${text}` }
    ) as any[];
    return keypointsResult?.[0]?.summary_text || "";
}

// --------------------
// Main route
// --------------------
app.post("/extract-summarize", (req: Request, res: Response) => {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: "File upload error" });

        const file = files.file as any;
        if (!file) return res.status(400).json({ error: "No file provided" });

        const filePath =
            file?.filepath ||
            file?._writeStream?.path ||
            file?.originalFilename ||
            null;
        if (!filePath) {
            return res.status(500).json({ error: "File path missing (Formidable error)" });
        }


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
        } finally {
            if (filePath) {
                fs.unlink(filePath, () => { });
            }
            // cleanup temp file
        }
    });
});

// --------------------
// Start server
// --------------------

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
