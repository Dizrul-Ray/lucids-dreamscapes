
import { GoogleGenAI, Modality } from "@google/genai";

// Fallback declaration for process to prevent build errors if types are missing
declare const process: { env: { [key: string]: string | undefined } };

// Check for API key
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is missing. The app will not function correctly until it is set in Cloudflare Environment Variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || 'placeholder_key_to_prevent_crash' });

export const generateStoryFromImage = async (
  imageBase64: string,
  mimeType: string,
  wordCount: number
): Promise<string> => {
  if (!API_KEY) throw new Error("API Key is missing.");
  
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Write a creative, engaging short story based on this image. The story should be approximately ${wordCount} words long. Use evocative language and strong imagery. Title the story at the beginning.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    return response.text || "Failed to generate story text.";
  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("The Dreamscape is cloudy. Could not generate story.");
  }
};

export const generateImageFromStory = async (storyText: string): Promise<string> => {
  if (!API_KEY) throw new Error("API Key is missing.");

  try {
    const summaryModel = 'gemini-2.5-flash';
    const summaryResponse = await ai.models.generateContent({
        model: summaryModel,
        contents: `Summarize the following story into a detailed visual description suitable for generating a high-quality artistic image. Focus on the setting, mood, lighting, and key subjects. Keep it under 100 words.\n\nStory:\n${storyText.substring(0, 5000)}`
    });
    
    const imagePrompt = summaryResponse.text || "A dreamlike scene from a story.";

    // Using gemini-2.5-flash-image for reliable, unlimited generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: imagePrompt + " --artistic --dark-fantasy --high-quality" }],
      },
      config: {
        responseMimeType: 'image/jpeg' 
      }
    });

    // Check specifically for inlineData in parts (standard for flash-image output)
    const candidates = response.candidates;
    if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts) {
         for (const part of candidates[0].content.parts) {
             if (part.inlineData && part.inlineData.data) {
                 return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
             }
         }
    }
    
    throw new Error("No image data returned from Gemini.");

  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("The mists are too thick. Could not generate image.");
  }
};

export const generateRandomConcept = async (): Promise<{ type: 'story' | 'image', prompt: string }> => {
    // Legacy function, keeping for compatibility
    return { type: 'story', prompt: 'Legacy randomizer.' };
};

export const generateStoryFromPrompt = async (prompt: string, wordCount: number = 500): Promise<string> => {
     if (!API_KEY) throw new Error("API Key is missing.");
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a short story (${wordCount} words) based on this prompt: ${prompt}`,
        });
        return response.text || "Failed to generate story.";
     } catch(e) {
         throw e;
     }
}

// NEW: For Admin Inspiration
export const generateDarkFantasyPrompt = async (): Promise<{prompt: string, imageUrl: string}> => {
    if (!API_KEY) throw new Error("API Key is missing.");

    try {
        // 1. Generate the Prompt Text
        const textResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Generate a detailed visual description of a unique Dark Fantasy character in an intricate, mysterious setting. Describe their appearance, the environment, and the mood. Keep it under 50 words. Be evocative.",
        });
        const promptText = textResponse.text || "A mysterious figure in the dark.";

        // 2. Generate the Image
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: promptText + " --dark-fantasy --oil-painting-style --masterpiece" }],
            },
        });
        
        let imageUrl = '';
        const candidates = response.candidates;
        if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts) {
            for (const part of candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }

        if (!imageUrl) throw new Error("Failed to generate inspiration image.");

        return { prompt: promptText, imageUrl };

    } catch (e) {
        throw e;
    }
}
