import mammoth from 'mammoth';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { fileUrl } = await req.json();

    try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.extractRawText({ buffer: arrayBuffer });
        console.log(result);
        return NextResponse.json({ text: result.value }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error reading file', details: error.message }, { status: 500 });
    }
}
