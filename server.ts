import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // API Endpoint: AI Inventory & Sales Assistant Insights
  app.post('/api/ai/stock-insights', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY not configured in server environment.',
        });
      }

      const { products, salesHistory } = req.body;

      const prompt = `
Anda adalah Pakar Analis Inventaris & Penjualan Ritel untuk sistem ERP.
Berdasarkan data produk dan riwayat penjualan berikut:

Data Produk:
${JSON.stringify(products, null, 2)}

Riwayat Penjualan Terbaru:
${JSON.stringify(salesHistory, null, 2)}

Tolong berikan analisis singkat dan rekomendasi strategis dalam format JSON berikut:
{
  "summary": "Ringkasan performa penjualan dan kesehatan stok secara umum",
  "criticalAlerts": ["Daftar peringatan stok kritis atau barang paling rawan habis"],
  "restockRecommendations": [
    {
      "productName": "Nama Produk",
      "recommendedQty": 50,
      "reason": "Alasan jumlah pemesanan kembali"
    }
  ],
  "salesGrowthTips": "1-2 saran konkret untuk meningkatkan efisiensi penjualan atau pemasaran stok mati/lambat"
}
Berikan respon HANYA berupa objek JSON yang valid.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const parsedData = JSON.parse(text);
      return res.json(parsedData);
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      return res.status(500).json({
        error: 'Gagal menganalisis data dengan AI: ' + err.message,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
