const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
// Endpoint dasar Google AI Studio
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Fungsi eksperimental untuk memanggil Veo via AI Studio REST API.
 * Catatan: Endpoint ini mungkin berubah karena fitur masih preview.
 */
const generateVideoWithVeoStudio = async (prompt) => {
  try {
    if (!API_KEY) {
      throw new Error('GEMINI_API_KEY belum dikonfigurasi di .env');
    }

    // Nama model video Veo (bisa veo-001, veo-preview, atau disesuaikan dengan dokumentasi Google Anda)
    const model = 'veo-preview';
    const endpoint = `${BASE_URL}/${model}:predict?key=${API_KEY}`;

    const payload = {
      instances: [
        {
          prompt: prompt,
        },
      ],
      parameters: {
        sampleCount: 1,
      },
    };

    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = response.data;
    if (result && result.predictions && result.predictions.length > 0) {
      // Mengembalikan URL video atau base64
      return (
        result.predictions[0].videoUri || result.predictions[0].bytesBase64
      );
    } else {
      throw new Error('Tidak ada output video dari Veo AI Studio');
    }
  } catch (error) {
    // Menangkap error spesifik dari API Google
    if (error.response && error.response.data) {
      console.error(
        'Kesalahan API Veo:',
        JSON.stringify(error.response.data, null, 2),
      );
      throw new Error(
        `API Google menolak request: ${error.response.data.error?.message || error.message}`,
      );
    }
    console.error('Kesalahan Sistem:', error.message);
    throw error;
  }
};

module.exports = { generateVideoWithVeoStudio };
