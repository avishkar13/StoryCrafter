import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import ttsRoute from './routes/tts.js';
import thumbnailRoute from './routes/thumbnailRoute.js';

import session from 'express-session';
import passport from 'passport';
import './config/passport.js';

dotenv.config();
connectDB();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;

// === MIDDLEWARE ===
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret', 
  resave: false,
  saveUninitialized: true,
  cookie: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
}));

app.use(passport.initialize());
app.use(passport.session());

// === ROUTES ===
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api', ttsRoute);
app.use('/api', thumbnailRoute);

// === STATIC FRONTEND ===
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// === SPA ROUTE FALLBACK ===
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
