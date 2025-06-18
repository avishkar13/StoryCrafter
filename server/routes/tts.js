// routes/tts.js
import express from 'express';
import googleTTS from 'google-tts-api';

const router = express.Router();

router.post('/tts', async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: 'Text is required.' });

  try {
    const maxLength = 200; // Google TTS limit
    const sentences = text.match(new RegExp(`.{1,${maxLength}}`, 'g'));

    const urls = await Promise.all(
      sentences.map((part) =>
        googleTTS.getAudioUrl(part, {
          lang: 'en',
          slow: false,
          host: 'https://translate.google.com',
        })
      )
    );

    // Stream merged audio
    const fetch = (await import('node-fetch')).default;
    const audios = await Promise.all(urls.map(url => fetch(url).then(res => res.arrayBuffer())));
    const mergedAudio = Buffer.concat(audios.map(buf => Buffer.from(buf)));

    res.set('Content-Type', 'audio/mpeg');
    res.send(mergedAudio);
  } catch (err) {
    console.error('TTS API Error:', err);
    res.status(500).json({ error: 'Failed to generate speech.' });
  }
});

export default router;
