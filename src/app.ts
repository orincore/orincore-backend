import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import portfolioRoutes from './routes/portfolio';
import reviewsRoutes from './routes/reviews';
import contactRoutes from './routes/contact';
import uploadRoutes from './routes/upload';
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(errorHandler);

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'Server is Running' });
});

app.use('/api/portfolio', portfolioRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
