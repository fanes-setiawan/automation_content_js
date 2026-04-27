const { logToDiscord } = require('../utils/logger');
const { generateContent } = require('../services/gemini');
const { generateVideoWithVeoStudio } = require('../services/veoAiStudio');

const startWorkflow = async (req, res) => {
  const { topic } = req.body;
  await logToDiscord(
    `🚀 Memulai pembuatan konten untuk topik: **${topic}**`,
    'info',
  );
  res.json({ status: 'success', message: 'Workflow dimulai' });
};

const generateScript = async (req, res) => {
  const { topic, context } = req.body;
  try {
    await logToDiscord(
      `📝 Sedang membuat skrip **YouTube Shorts** untuk: ${topic}`,
      'info',
    );
    const prompt = `Buatkan skrip video YouTube Shorts (durasi < 60 detik) tentang "${topic}". 
        ${context ? `Konteks tambahan: ${context}` : ''} 
        Aturan skrip:
        1. Hook yang sangat kuat di 3 detik pertama.
        2. Gunakan bahasa yang santai, cepat, dan to-the-point.
        3. Maksimal 150 kata agar pas dengan durasi Shorts.
        4. Berikan instruksi visual di dalam kurung [seperti ini].`;

    const script = await generateContent(prompt);
    await logToDiscord(
      `✅ Skrip Shorts berhasil dibuat untuk: ${topic}`,
      'success',
    );
    res.json({ status: 'success', script });
  } catch (error) {
    await logToDiscord(`❌ Gagal membuat skrip: ${error.message}`, 'error');
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const generateVideoPlaceholder = async (req, res) => {
  const { script, topic } = req.body;
  try {
    await logToDiscord(
      `🎬 Sedang memproses video untuk skrip: ${topic} dengan Google Veo`,
      'info',
    );

    // Membangun prompt visual untuk Veo berdasarkan skrip
    const veoPrompt = `High quality, cinematic, 4k vertical video (9:16) for YouTube Shorts. Topic: ${topic}. Script context: ${script}. Bright lighting, engaging visual style.`;

    // Panggil layanan Veo AI Studio
    const videoUrl = await generateVideoWithVeoStudio(veoPrompt);

    // Fallback sementara (jika mau dimatikan)
    // const videoUrl = 'https://example.com/veo-placeholder-video.mp4';

    await logToDiscord(`✅ Video berhasil diproses oleh Veo!`, 'success');
    res.json({ status: 'success', videoUrl });
  } catch (error) {
    await logToDiscord(`❌ Gagal memproses video: ${error.message}`, 'error');
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const generateThumbnail = async (req, res) => {
  const { topic, script } = req.body;
  try {
    await logToDiscord(
      `🖼️ Sedang merancang prompt thumbnail untuk: ${topic}`,
      'info',
    );

    const promptGen = `Buatkan deskripsi visual/prompt bahasa Inggris yang sangat detail untuk AI Image Generator (seperti DALL-E atau Midjourney). 
        Tujuannya adalah membuat Thumbnail YouTube yang sangat menarik (clickbait yang jujur) tentang: "${topic}". 
        Isi kontennya adalah: "${script}". 
        Prompt harus mencakup komposisi warna yang cerah, teks yang kontras, dan ekspresi atau objek yang dramatis.`;

    const imagePrompt = await generateContent(promptGen);

    await logToDiscord(
      `🎨 Prompt thumbnail berhasil dibuat, sedang memproses gambar...`,
      'info',
    );

    // Placeholder untuk integrasi API eksternal
    const thumbnailUrl = 'https://example.com/generated-thumbnail.jpg';

    await logToDiscord(
      `✅ Thumbnail berhasil dibuat menggunakan AI`,
      'success',
    );
    res.json({ status: 'success', thumbnailUrl, imagePrompt });
  } catch (error) {
    await logToDiscord(`❌ Gagal membuat thumbnail: ${error.message}`, 'error');
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const generateMetadata = async (req, res) => {
  const { topic, script } = req.body;
  try {
    await logToDiscord(`🏷️ Membuat metadata Shorts untuk: ${topic}`, 'info');
    const prompt = `Berdasarkan skrip ini: "${script}", buatkan:
        1. Judul Shorts yang menarik (kurang dari 50 karakter).
        2. Caption singkat dan padat.
        3. Daftar 10 hashtag relevan termasuk #Shorts, #YouTubeShorts, dan hashtag viral lainnya.
        Format output: JSON dengan key "title", "caption", dan "hashtags" (array).`;

    const metadataRaw = await generateContent(prompt);

    let metadata;
    try {
      metadata = JSON.parse(metadataRaw.replace(/```json|```/g, ''));
    } catch (e) {
      metadata = {
        caption: metadataRaw,
        hashtags: ['#content', '#automation'],
      };
    }

    await logToDiscord(`✅ Metadata berhasil dibuat`, 'success');
    res.json({ status: 'success', metadata });
  } catch (error) {
    await logToDiscord(`❌ Gagal membuat metadata: ${error.message}`, 'error');
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const uploadYoutubePlaceholder = async (req, res) => {
  const { videoUrl, title, description, tags } = req.body;
  try {
    await logToDiscord(
      `📤 Sedang mengunggah video ke YouTube: **${title}**`,
      'info',
    );

    // Implementasi integrasi YouTube Data API v3 akan diletakkan di sini.
    await logToDiscord(
      `🎊 Video berhasil diunggah ke YouTube! Link: https://youtube.com/watch?v=placeholder`,
      'success',
    );
    res.json({
      status: 'success',
      youtubeUrl: 'https://youtube.com/watch?v=placeholder',
    });
  } catch (error) {
    await logToDiscord(
      `❌ Gagal mengunggah ke YouTube: ${error.message}`,
      'error',
    );
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  startWorkflow,
  generateScript,
  generateVideoPlaceholder,
  generateThumbnail,
  generateMetadata,
  uploadYoutubePlaceholder,
};
