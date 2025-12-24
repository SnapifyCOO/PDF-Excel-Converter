
import { GoogleGenAI, Type } from "@google/genai";
import { ConversionResponse } from "../types";

export const analyzeDocument = async (base64Data: string, mimeType: string): Promise<ConversionResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Analyze the attached document and convert it into a multi-sheet Excel workbook JSON.
    
    CRITICAL INSTRUCTIONS:
    1. **Structure**: Create a separate sheet for each logical section or distinct page of the document.
    2. **Formatting & Layout**: Preserve the visual 'feel' of the PDF. If there are indentations, large gaps, or specific alignments, use empty cells/columns to simulate that spacing.
    3. **Text Fidelity**: Keep all text exactly as written. If text is colored or bolded in the PDF, ensure it is clearly placed in a header row.
    4. **Tables**: Identify all tables and represent them accurately. If a table has merged headers, try to represent that structure logically in the rows.
    5. **Data Types**: Keep currency symbols ($), percentages (%), and dates in their original display format to preserve the look.
    
    Respond STRICTLY with the JSON structure defined in the schema. Ensure "sheets" is an array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data.split(',')[1] || base64Data,
                mimeType: mimeType
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sheets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the sheet tab" },
                  rows: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    description: "Rows of data for this specific sheet"
                  }
                },
                required: ["name", "rows"]
              }
            }
          },
          required: ["sheets"]
        }
      }
    });

    const text = response.text || '{"sheets": []}';
    const result = JSON.parse(text) as ConversionResponse;
    return result;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze the document with high fidelity. Please try again.");
  }
};
