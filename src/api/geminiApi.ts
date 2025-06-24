import axios from 'axios';
import {
  translationSchema,
  type TranslationSchema,
} from '../schemas/translationSchema';

interface GenerateContentPayload {
  contents: Array<{
    role: string;
    parts: Array<{ text: string }>;
  }>;
  generationConfig: {
    responseMimeType: string;
    responseSchema: any; // Using 'any' here as Zod schema can be complex for direct typing
  };
}

interface GeminiApiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text: string }>;
    };
  }>;
  error?: {
    message: string;
  };
}

const API_BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
  import.meta.env.VITE_GEMINI_API_KEY
}`;

export const translateText = async (
  textInput: string,
): Promise<TranslationSchema> => {
  const prompt = `Translate the following text to English and provide additional linguistic information. Respond only with a JSON object containing the following keys:
  - "translation": the main English translation of the text.
  - "example": an object with "original" and "translated" keys for an example sentence relevant to the input (if appropriate).
  - "verbForms": an array of strings with different verb forms if the input is a verb (e.g., infinitive, past participle, simple past, conjugated forms). If not a verb, an empty array.
  - "otherTranslations": an array of strings for alternative or contextual translations.
  - "synonyms": an array of strings for synonyms of the translated word/concept.

  Original text: "${textInput}"`;

  const payload: GenerateContentPayload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          translation: { type: 'STRING' },
          example: {
            type: 'OBJECT',
            properties: {
              original: { type: 'STRING' },
              translated: { type: 'STRING' },
            },
          },
          verbForms: { type: 'ARRAY', items: { type: 'STRING' } },
          otherTranslations: { type: 'ARRAY', items: { type: 'STRING' } },
          synonyms: { type: 'ARRAY', items: { type: 'STRING' } },
        },
        required: ['translation'],
      },
    },
  };

  try {
    const response = await axios.post<GeminiApiResponse>(
      API_BASE_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${accessToken}` // Removed: using API Key instead
        },
      },
    );

    if (
      !response.data.candidates ||
      response.data.candidates.length === 0 ||
      !response.data.candidates[0].content ||
      !response.data.candidates[0].content.parts ||
      response.data.candidates[0].content.parts.length === 0
    ) {
      throw new Error(
        'Could not parse translation results from AI. Invalid response format.',
      );
    }

    const jsonString = response.data.candidates[0].content.parts[0].text;
    const parsedData = JSON.parse(jsonString);

    // Validate the parsed data with Zod schema
    const validatedData = translationSchema.parse(parsedData);
    return validatedData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `API error: ${error.response?.status} - ${
          error.response?.data?.error?.message || 'Unknown error'
        }`,
      );
    }
    throw new Error(
      `Translation failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
};
