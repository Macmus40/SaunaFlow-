import { GoogleGenAI, Type } from "@google/genai";
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// Zdefiniuj oczekiwaną schemę JSON dla odpowiedzi AI, aby zapewnić spójność danych
const responseSchema = {
    type: Type.OBJECT,
    properties: {
        cycles: {
            type: Type.INTEGER,
            description: 'Number of cycles, an integer between 2 and 5.'
        },
        saunaDuration: {
            type: Type.INTEGER,
            description: 'Duration of the sauna stage in minutes, an integer between 5 and 20.'
        },
        isColdEnabled: {
            type: Type.BOOLEAN,
            description: 'Whether the cold stage should be enabled. Should be false for beginners.'
        },
        coldDuration: {
            type: Type.INTEGER,
            description: 'Duration of the cold stage in minutes, an integer between 1 and 5. Can be 0 if isColdEnabled is false.'
        },
        restDuration: {
            type: Type.INTEGER,
            description: 'Duration of the rest stage in minutes, an integer between 8 and 15.'
        },
    },
    required: ["cycles", "saunaDuration", "isColdEnabled", "coldDuration", "restDuration"],
};

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY environment variable not set.");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server configuration error.' }),
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const prompt = body.prompt;

        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Prompt is required.' }),
            };
        }
        
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
           model: "gemini-2.5-flash",
           contents: prompt,
           config: {
             responseMimeType: "application/json",
             responseSchema: responseSchema,
           },
        });
        
        // Odpowiedź AI jest już w formacie JSON dzięki responseSchema
        const suggestionJson = JSON.parse(response.text);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(suggestionJson),
        };

    } catch (error) {
        console.error('Error generating AI suggestion:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to get AI suggestion.';

        return {
            statusCode: 500,
            body: JSON.stringify({ error: errorMessage }),
        };
    }
};

export { handler };