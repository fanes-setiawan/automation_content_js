import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateContent = async (prompt, env = {}) => {
  try {
    // Di Cloudflare Workers, variabel env ada di dalam parameter env.
    // process.env hanya ada di Node.js lokal.
    const API_KEY = env?.GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined);
    
    if (!API_KEY) {
      throw new Error('GEMINI_API_KEY belum dikonfigurasi di Environment Variables');
    }
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Kesalahan Gemini Service:', error.message);
    throw error;
  }
};
