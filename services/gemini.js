/**
 * Gemini Service (Raw Fetch Implementation)
 * Menggunakan standar REST API Google agar lebih ringan di Cloudflare Workers.
 */

export const generateContent = async (prompt, env = {}) => {
  try {
    const API_KEY = env?.GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined);
    
    if (!API_KEY) {
      throw new Error('GEMINI_API_KEY belum dikonfigurasi di Cloudflare Variables');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error dari Google API:', data);
      throw new Error(`Google API Error: ${data.error?.message || response.statusText}`);
    }

    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Tidak ada jawaban (candidates) dari Gemini');
    }
  } catch (error) {
    console.error('Kesalahan Gemini Service:', error.message);
    throw error;
  }
};
