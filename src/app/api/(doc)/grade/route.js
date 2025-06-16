import pdfParse from 'pdf-parse';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const criteria = formData.get('criteria') || '';

    if (!file || file.type !== 'application/pdf') {
      return new Response(JSON.stringify({ error: 'File không hợp lệ hoặc không phải PDF' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdf = await pdfParse(buffer);
    console.log(pdf)

    const prompt = `Nội dung bài làm của học sinh:\n${pdf.text}\n\nChấm theo tiêu chí:\n${criteria}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCZF3UFZq2RUwVO6ioqvsFgkd21M1G110c`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    const result = await geminiRes.json();
    const output = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return new Response(JSON.stringify({ output }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Lỗi xử lý chấm điểm', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
