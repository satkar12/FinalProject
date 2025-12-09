import express from "express";
import cors from "cors";
import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";
import { summarizeText } from "./summarizer.js";
import { generateQuestions } from "./questiongenerator.js";

const app = express();
app.use(cors());

app.post("/summarize", (req, res) => {
    const form = formidable({ multiples: false });
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: err.message });

        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        if (!file) return res.status(400).json({ error: "No file uploaded" });

        let text = "";

        // PDF
        if (file.mimetype === "application/pdf") {
            const dataBuffer = fs.readFileSync(file.filepath);
            const pdfData = await pdfParse(dataBuffer);
            text = pdfData.text;
        }
        // Image
        else if (file.mimetype?.startsWith("image/")) {
            const { data: { text: extractedText } } = await Tesseract.recognize(file.filepath, "eng");
            text = extractedText;
        }

        const summary = await summarizeText(text);
        res.json({ extractedText: text, summary, keypoints: "Key points not implemented yet" });
    });
});

app.post("/generate-questions", async (req, res) => {
    const { text } = req.body;

    try {
        const questions = await generateQuestions(text);
        res.json({ questions });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error generating questions");
    }
});

app.listen(4000, () => console.log("Your backend is running at http://localhost:4000✅"));
