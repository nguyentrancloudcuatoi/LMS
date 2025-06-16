// pages/api/read-doc.js
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';

export default async function POST(req, res) {
    const { filePath } = req.body;

    if (!filePath) {
        return res.status(400).json({ error: 'File path is required' });
    }

    try {
        const resolvedPath = path.resolve(filePath);
        if (!fs.existsSync(resolvedPath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        const fileBuffer = fs.readFileSync(resolvedPath);
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        res.status(200).json({ text: result.value });
    } catch (error) {
        res.status(500).json({ error: 'Error reading file' });
    }
}