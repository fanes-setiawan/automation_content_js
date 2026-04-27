# 🚀 YouTube Shorts Automation Backend

Backend berbasis **Hono.js** yang dirancang khusus untuk berjalan di **Cloudflare Workers**. Aplikasi ini berfungsi sebagai otak dari sistem otomasi pembuatan konten YouTube Shorts menggunakan AI (Gemini, Google Veo) yang terintegrasi dengan n8n.

---

## 🏗️ Arsitektur Proyek

- **Runtime**: Cloudflare Workers (Edge Computing)
- **Framework**: Hono.js (ES Modules)
- **AI Engine**: Google Gemini (Text & Metadata), Google Veo (Video Generation)
- **Monitoring**: Discord Webhook Integration
- **Otomasi**: Terkoneksi ke n8n melalui Webhooks

---

## 🛠️ Persiapan & Instalasi

### 1. Prasyarat
- Node.js & npm
- Akun Cloudflare
- Gemini API Key (dari [Google AI Studio](https://aistudio.google.com/))
- Discord Webhook URL

### 2. Environment Variables (Cloudflare Dashboard)
Setelah men-deploy, Anda **wajib** menambahkan variabel berikut di Dashboard Cloudflare (**Settings > Variables**):

| Nama Variabel | Deskripsi |
| :--- | :--- |
| `GEMINI_API_KEY` | Kunci API untuk akses model Gemini Flash & Veo. |
| `DISCORD_WEBHOOK_URL` | URL Webhook untuk mengirim log status ke server Discord. |

---

## 📡 API Documentation

Base URL: `https://automation-content-js.fanessetiawan-1401.workers.dev`

### 1. Membuat Skrip Video
Membuat skrip YouTube Shorts durasi < 60 detik dengan hook kuat.
- **Endpoint**: `/api/generate/script`
- **Method**: `POST`
- **Body**:
```json
{
  "topic": "Fakta unik tentang luar angkasa",
  "context": "Gunakan nada bicara yang misterius"
}
```

### 2. Membuat Metadata (Judul & Hashtag)
Membuat judul clickbait yang jujur, caption, dan hashtag viral.
- **Endpoint**: `/api/generate/metadata`
- **Method**: `POST`
- **Body**:
```json
{
  "topic": "Fakta unik tentang luar angkasa",
  "script": "Isi skrip yang dihasilkan sebelumnya..."
}
```

### 3. Membuat Prompt Thumbnail
Menghasilkan deskripsi visual detail untuk AI Image Generator.
- **Endpoint**: `/api/generate/thumbnail`
- **Method**: `POST`
- **Body**: `{"topic": "...", "script": "..."}`

### 4. Membuat Video (AI Video)
Memproses video menggunakan model Google Veo.
- **Endpoint**: `/api/generate/video`
- **Method**: `POST`
- **Body**: `{"topic": "...", "script": "..."}`

---

## 🤖 Integrasi n8n

Aplikasi ini dirancang untuk bekerja dalam alur kerja n8n:
1. **Trigger**: n8n menerima input topik.
2. **Action**: n8n memanggil `/api/generate/script`.
3. **Action**: n8n memanggil `/api/generate/metadata` dan `/api/generate/thumbnail`.
4. **Monitoring**: Setiap langkah akan otomatis mengirim notifikasi ke Discord Anda.

---

## 💻 Pengembangan Lokal

```bash
# Install dependensi
npm install

# Jalankan lokal (Wrangler dev)
npm start

# Deploy ke Cloudflare
npm run deploy
```

---

## 👨‍💻 Author
**Fanes Setiawan**
*Version 1.0.0*
