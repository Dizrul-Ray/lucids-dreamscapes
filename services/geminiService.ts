import { GoogleGenAI, Modality } from "@google/genai";

// Check for API key
if (!process.env.API_KEY) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStoryFromImage = async (
  imageBase64: string,
  mimeType: string,
  wordCount: number
): Promise<string> => {
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
  try {
    // Summarize the story first to get a good image prompt, as the full story might be too long/complex for the image model directly
    const summaryModel = 'gemini-2.5-flash';
    const summaryResponse = await ai.models.generateContent({
        model: summaryModel,
        contents: `Summarize the following story into a detailed visual description suitable for generating a high-quality artistic image. Focus on the setting, mood, lighting, and key subjects. Keep it under 100 words.\n\nStory:\n${storyText.substring(0, 5000)}`
    });
    
    const imagePrompt = summaryResponse.text || "A dreamlike scene from a story.";
    console.log("Generated Image Prompt:", imagePrompt);

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: imagePrompt + " --artistic --dreamlike --high-quality",
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64ImageBytes) {
      throw new Error("No image data returned");
    }
    
    return `data:image/jpeg;base64,${base64ImageBytes}`;

  } catch (error) {
    console.error("Error generating image:", error);
    // Fallback or re-throw
    throw new Error("The mists are too thick. Could not generate image.");
  }
};

export const generateRandomConcept = async (): Promise<{ type: 'story' | 'image', prompt: string }> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Generate a random, creative prompt for EITHER a short story OR an image generation. Return ONLY a JSON object with two fields: 'type' (either 'story' or 'image') and 'prompt' (the creative prompt text). For story prompts, suggest a unique scenario. For image prompts, describe a surreal scene.",
        config: {
            responseMimeType: "application/json"
        }
    });
    
    const text = response.text;
    if (!text) throw new Error("Empty response");
    
    const data = JSON.parse(text);
    return {
        type: data.type === 'image' ? 'image' : 'story',
        prompt: data.prompt
    };
  } catch (error) {
    console.error("Random generation failed", error);
    return { type: 'story', prompt: 'Write a story about a clock that runs backwards.' };
  }
};

export const generateStoryFromPrompt = async (prompt: string, wordCount: number = 500): Promise<string> => {
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