import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
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

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', 
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api', ttsRoute);
app.use("/api", thumbnailRoute);

app.get('/', (req, res) => {
    res.send('StoryCrafter Backend is Running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


