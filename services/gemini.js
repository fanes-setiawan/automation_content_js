const { GoogleGenerativeAI } = require('@google/generative-ai');

const generateContent = async (prompt, env = {}) => {
  try {
    const API_KEY = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
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

module.exports = { generateContent };
