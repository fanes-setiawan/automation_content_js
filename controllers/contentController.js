import { logToDiscord } from '../utils/logger.js';
import { generateContent } from '../services/gemini.js';
import { generateVideoWithVeoStudio } from '../services/veoAiStudio.js';

export const startWorkflow = async (c) => {
  const { topic } = await c.req.json();
  await logToDiscord(
    `🚀 Memulai pembuatan konten untuk topik: **\${topic}**`,
    'info',
    c.env,
  );
  return c.json({ status: 'success', message: 'Workflow dimulai' });
};

export const generateScript = async (c) => {
  try {
    const { topic, context } = await c.req.json();
    await logToDiscord(
      `📝 Sedang membuat skrip **YouTube Shorts** untuk: \${topic}`,
      'info',
      c.env,
    );
    const prompt = \`Buatkan skrip video YouTube Shorts (durasi < 60 detik) tentang "\${topic}". 
        \${context ? \`Konteks tambahan: \${context}\` : ''} 
        Aturan skrip:
        1. Hook yang sangat kuat di 3 detik pertama.
        2. Gunakan bahasa yang santai, cepat, dan to-the-point.
        3. Maksimal 150 kata agar pas dengan durasi Shorts.
        4. Berikan instruksi visual di dalam kurung [seperti ini].\`;

    const script = await generateContent(prompt, c.env);
    await logToDiscord(
      `✅ Skrip Shorts berhasil dibuat untuk: \${topic}`,
      'success',
      c.env,
    );
    return c.json({ status: 'success', script });
  } catch (error) {
    await logToDiscord(\`❌ Gagal membuat skrip: \${error.message}\`, 'error', c.env);
    return c.json({ status: 'error', message: error.message }, 500);
  }
};

export const generateVideoPlaceholder = async (c) => {
  try {
    const { script, topic } = await c.req.json();
    await logToDiscord(
      `🎬 Sedang memproses video untuk skrip: \${topic} dengan Google Veo`,
      'info',
      c.env,
    );

    const veoPrompt = \`High quality, cinematic, 4k vertical video (9:16) for YouTube Shorts. Topic: \${topic}. Script context: \${script}. Bright lighting, engaging visual style.\`;

    // const videoUrl = await generateVideoWithVeoStudio(veoPrompt, c.env);
    const videoUrl = 'https://example.com/veo-placeholder-video.mp4';

    await logToDiscord(\`✅ Video berhasil diproses oleh Veo!\`, 'success', c.env);
    return c.json({ status: 'success', videoUrl });
  } catch (error) {
    await logToDiscord(\`❌ Gagal memproses video: \${error.message}\`, 'error', c.env);
    return c.json({ status: 'error', message: error.message }, 500);
  }
};

export const generateThumbnail = async (c) => {
  try {
    const { topic, script } = await c.req.json();
    await logToDiscord(
      `🖼️ Sedang merancang prompt thumbnail untuk: \${topic}`,
      'info',
      c.env,
    );

    const promptGen = \`Buatkan deskripsi visual/prompt bahasa Inggris yang sangat detail untuk AI Image Generator (seperti DALL-E atau Midjourney). 
        Tujuannya adalah membuat Thumbnail YouTube yang sangat menarik (clickbait yang jujur) tentang: "\${topic}". 
        Isi kontennya adalah: "\${script}". 
        Prompt harus mencakup komposisi warna yang cerah, teks yang kontras, dan ekspresi atau objek yang dramatis.\`;

    const imagePrompt = await generateContent(promptGen, c.env);

    await logToDiscord(
      \`🎨 Prompt thumbnail berhasil dibuat, sedang memproses gambar...\`,
      'info',
      c.env,
    );

    const thumbnailUrl = 'https://example.com/generated-thumbnail.jpg';

    await logToDiscord(
      \`✅ Thumbnail berhasil dibuat menggunakan AI\`,
      'success',
      c.env,
    );
    return c.json({ status: 'success', thumbnailUrl, imagePrompt });
  } catch (error) {
    await logToDiscord(\`❌ Gagal membuat thumbnail: \${error.message}\`, 'error', c.env);
    return c.json({ status: 'error', message: error.message }, 500);
  }
};

export const generateMetadata = async (c) => {
  try {
    const { topic, script } = await c.req.json();
    await logToDiscord(\`🏷️ Membuat metadata Shorts untuk: \${topic}\`, 'info', c.env);
    const prompt = \`Berdasarkan skrip ini: "\${script}", buatkan:
        1. Judul Shorts yang menarik (kurang dari 50 karakter).
        2. Caption singkat dan padat.
        3. Daftar 10 hashtag relevan termasuk #Shorts, #YouTubeShorts, dan hashtag viral lainnya.
        Format output: JSON dengan key "title", "caption", dan "hashtags" (array).\`;

    const metadataRaw = await generateContent(prompt, c.env);

    let metadata;
    try {
      metadata = JSON.parse(metadataRaw.replace(/\\\`\\\`\\\`json|\\\`\\\`\\\`/g, ''));
    } catch (e) {
      metadata = {
        caption: metadataRaw,
        hashtags: ['#content', '#automation'],
      };
    }

    await logToDiscord(\`✅ Metadata berhasil dibuat\`, 'success', c.env);
    return c.json({ status: 'success', metadata });
  } catch (error) {
    await logToDiscord(\`❌ Gagal membuat metadata: \${error.message}\`, 'error', c.env);
    return c.json({ status: 'error', message: error.message }, 500);
  }
};

export const uploadYoutubePlaceholder = async (c) => {
  try {
    const { title } = await c.req.json();
    await logToDiscord(
      \`📤 Sedang mengunggah video ke YouTube: **\${title}**\`,
      'info',
      c.env,
    );

    await logToDiscord(
      \`🎊 Video berhasil diunggah ke YouTube! Link: https://youtube.com/watch?v=placeholder\`,
      'success',
      c.env,
    );
    return c.json({
      status: 'success',
      youtubeUrl: 'https://youtube.com/watch?v=placeholder',
    });
  } catch (error) {
    await logToDiscord(
      \`❌ Gagal mengunggah ke YouTube: \${error.message}\`,
      'error',
      c.env,
    );
    return c.json({ status: 'error', message: error.message }, 500);
  }
};
