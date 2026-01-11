
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { LuckPrediction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getZodiacLuck = async (sign: string): Promise<LuckPrediction> => {
  const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Predict luck and cosmic details for ${sign} on this ${dayOfWeek}. 
    Include 6 lucky numbers, a detailed horoscope, strong/weak characteristics, favorite colors, 
    a motivational message, daily affirmations, and a mystic chanting spell. 
    Return it in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          numbers: {
            type: Type.ARRAY,
            items: { type: Type.INTEGER },
            description: "Exactly 6 lucky numbers between 1 and 99."
          },
          horoscope: {
            type: Type.STRING,
            description: "A punchy summary (max 15 words)."
          },
          detailedHoroscope: {
            type: Type.STRING,
            description: "A comprehensive daily reading for today's specific energy."
          },
          powerColor: {
            type: Type.STRING,
            description: "The primary color for luck today."
          },
          favoriteColors: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 other colors that resonate with this sign's energy."
          },
          luckyTime: {
            type: Type.STRING,
            description: "Specific hour of maximum power."
          },
          strongTraits: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 key strengths of this sign."
          },
          weakTraits: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2 challenges or weaknesses to watch out for."
          },
          motivationalMessage: {
            type: Type.STRING,
            description: "An inspiring daily quote or message."
          },
          affirmations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 positive I AM affirmations."
          },
          chantingSpell: {
            type: Type.STRING,
            description: "A rhythmic, short mystic chant for manifestation."
          }
        },
        required: [
          "numbers", "horoscope", "detailedHoroscope", "powerColor", "favoriteColors", 
          "luckyTime", "strongTraits", "weakTraits", "motivationalMessage", 
          "affirmations", "chantingSpell"
        ]
      }
    }
  });

  const jsonStr = response.text.trim();
  return JSON.parse(jsonStr) as LuckPrediction;
};

export const generateInitialCharm = async (sign: string): Promise<string> => {
  const prompt = `A mystic, high-quality digital illustration of a lucky charm or celestial artifact for the zodiac sign ${sign}. Cosmic background, intricate gold details, 4k resolution.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
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
  throw new Error("Failed to generate image");
};

export const editCharmImage = async (base64Image: string, editPrompt: string): Promise<string> => {
  const base64Data = base64Image.split(',')[1];
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/png'
          }
        },
        {
          text: `Modify this image: ${editPrompt}. Maintain the mystic aesthetic.`
        }
      ]
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
  throw new Error("Failed to edit image");
};
