import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes/index';
import { randomUUID } from 'crypto';

const app = express();

// Middleware CORS dengan opsi exposedHeaders
app.use(cors({ exposedHeaders: ['X-Request-Id'] }));

// Middleware untuk membuat X-Request-Id
app.use((req, res, next) => {
  const requestId = randomUUID();
  res.locals.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
});

// Middleware untuk mencetak log request
app.use((req, res, next) => {
  console.log(`[${res.locals.requestId}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());

// Route utama - cek apakah server berjalan
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Backend Todo Praktikum Berjalan Mulus!' });
});

// Daftarkan semua route dengan prefix /api
app.use('/api', routes);

// 404 Handler - dipanggil jika tidak ada route yang cocok
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} tidak ditemukan!` });
});

// Global Error Handler - menangkap error yang tidak tertangani
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Terjadi error:', err.message);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
});

export default app;