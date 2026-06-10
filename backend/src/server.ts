import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import staffRoutes from './routes/staff.routes';
import memberRoutes from './routes/member.routes';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/member', memberRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Delight Pack Backend Running' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
