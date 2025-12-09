import { pipeline } from "@xenova/transformers";

let summarizer: any = null;

async function loadModel() {
    if (!summarizer) {
        summarizer = await pipeline("summarization", "Xenova/t5-small");
    }
    return summarizer;
}
export async function summarizeText(text: string) {
    const model = await loadModel();

    const prompt = `
Summarize the following text into clear bullet points:
${text}
`;

    const summary = await model(prompt, {
        max_length: 180,
        min_length: 60,
    });

    // Ensure each line starts with a bullet for frontend display
    const bulletSummary = summary[0].summary_text
        .split(/[\.\n]+/)
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)
        .map((line: string) => `• ${line}`)
        .join("\n");

    return bulletSummary;
}

