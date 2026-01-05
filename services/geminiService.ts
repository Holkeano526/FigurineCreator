
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const generateFigurineImage = async (base64Image: string, mimeType: string, additionalInstructions?: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please ensure it is configured.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    TASK: Transform the character(s) from the attached source image into a professional 1/7 scale commercialized collectible figurine.

    OBJECTIVE DETAILS:
    1. FIGURINE: Recreate the character(s) from the photo in a highly detailed, realistic style. They should look like a high-end PVC/Resin collectible with intricate textures on clothing and skin.
    2. BASE: The figurine must stand on a perfectly round, crystal-clear transparent acrylic base. There should be NO text, logos, or markings on this base.
    3. ENVIRONMENT: Place the figurine on a modern, clean computer desk in a realistic home office or creative studio.
    4. BACKGROUND MONITOR: A high-end computer screen in the background must be visible, displaying the Zbrush 3D modeling software interface. The screen should show the complex digital 3D mesh (grey or red clay material) of this exact figurine currently being "sculpted".
    5. PACKAGING: Next to the monitor, include a BANDAI-style rectangular toy packaging box. 
       - CRITICAL: The box front must feature TWO-DIMENSIONAL (2D) flat anime-style or comic-style illustrations of the character(s), creating a stylistic contrast with the 3D figurine.
    
    ${additionalInstructions ? `ADDITIONAL USER CUSTOMIZATIONS: ${additionalInstructions}` : ''}

    PHOTOGRAPHY STYLE: 
    - Cinematic product photography, shallow depth of field, professional studio lighting, 8k resolution, photorealistic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data was returned from the API.");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};
