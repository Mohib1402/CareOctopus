"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeImage(imageBase64: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are CareOctopus, an expert medical assistant.
      Analyze this image of a medication label or medical report.
      
      Extract the following information and return it in strict JSON format:
      {
        "type": "medication" or "report",
        "title": "Name of drug or report title",
        "details": "Dosage/Frequency or Summary of report",
        "warning": "Any side effects or warnings (if medication) or key alerts (if report)",
        "confidence": 0-100
      }
      Do not include markdown code blocks. Just the raw JSON string.
    `;

    const cleanBase64 = imageBase64.split(",")[1] || imageBase64;

    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}

export async function analyzeText(text: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `
      You are CareOctopus. Analyze this symptom description: "${text}"
      
      Return valid JSON only:
      {
        "type": "symptom",
        "title": "Short title (e.g. Dizziness, Nausea)",
        "details": "Summary of the complaint",
        "severity": "low" | "medium" | "high",
        "warning": "Medical advice if severity is high (otherwise null)"
      }
      Do not include markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textData = response.text();
    
    const jsonStr = textData.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Text Error:", error);
    return null;
  }
}