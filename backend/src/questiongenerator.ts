import { pipeline } from "@xenova/transformers";

let qg: any = null;

async function loadQG() {
    if (!qg) {
        qg = await pipeline(
            "text2text-generation",
            "valhalla/t5-small-qg-hl"
        );
    }
    return qg;
}

export async function generateQuestions(text: string) {
    const model = await loadQG();

    const output = await model(text, {
        max_length: 128,
    });

    return output[0].generated_text;
}
