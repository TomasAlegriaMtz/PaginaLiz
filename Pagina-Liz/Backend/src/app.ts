import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import { seedMasterUser } from './config/seeder';

// Load environment variables
dotenv.config();

// Connect to database and seed
connectDB().then(() => {
  seedMasterUser();
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../../data/uploads')));
// Serve static files (assets)
app.use('/assets', express.static(path.join(__dirname, '../../data/assets')));

// Routes
import authRoutes from './routes/auth.routes';
import documentRoutes from './routes/document.routes';
import contentRoutes from './routes/content.routes';
import categoryRoutes from './routes/category.routes';
import subjectRoutes from './routes/subject.routes';
import assetRoutes from './routes/asset.routes';
import userRoutes from './routes/user.routes';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/assets', assetRoutes);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;
