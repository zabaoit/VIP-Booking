import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';

dotenv.config({ quiet: true });

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(cors());
app.use(express.json());

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'JSON body không hợp lệ',
    });
  }

  return next(error);
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VIP-Booking API is running',
  });
});

app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
