import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    try {
        const apiKey = 'AIzaSyCZF3UFZq2RUwVO6ioqvsFgkd21M1G110c';
        if (!apiKey) {
            throw new Error('API key is missing');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const { body: prompt } = await req.json();
        if (!prompt) {
            throw new Error('Invalid input: prompt is required');
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const output = await response.text();

        return new Response(JSON.stringify({ output }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error:', error.message);
        return new Response(JSON.stringify({ error: error.message || 'Error occurred while calling the API' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
