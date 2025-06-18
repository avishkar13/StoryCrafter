import Content from '../models/contentModel.js';
import axios from 'axios';

// CREATE new content (script, title, thumbnailPrompt, seo)
export const createContent = async (req, res) => {
  try {
    const { type, data } = req.body;
    const userId = req.user._id;

    // Validate content type
    const allowedTypes = ['script', 'title', 'thumbnailPrompt', 'seo'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid content type' });
    }

    // Validate data
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ message: 'Data must be a valid object' });
    }

    const content = new Content({
      user: userId,
      type,
      data,
    });

    await content.save();
    res.status(201).json(content);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create content', error: err.message });
  }
};

// GET all content for logged-in user
export const getUserContent = async (req, res) => {
  try {
    const userId = req.user._id;
    const contents = await Content.find({ user: userId }).sort({ createdAt: -1 });
    res.json(contents);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch content', error: err.message });
  }
};

// DELETE content by ID
export const deleteContent = async (req, res) => {
  try {
    const userId = req.user._id;
    const contentId = req.params.id;

    const content = await Content.findOneAndDelete({ _id: contentId, user: userId });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete content', error: err.message });
  }
};

// GENERATE content using OpenRouter API (script, title, thumbnailPrompt, etc.)
export const generateContent = async (req, res) => {
  try {
    const { prompt, type } = req.body;
    const userId = req.user._id;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return res.status(400).json({ message: "Prompt must be a non-empty string" });
    }

    const allowedTypes = ["script", "title", "thumbnailPrompt", "seo"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid content type" });
    }

    // Prepend instruction directly into the user message
    let finalPrompt = prompt;

    if (type === "title") {
      finalPrompt = `Write upto 5 titles, catchy YouTube title under 12 words. No explanation.Don't use symbols only plain text.\n\n ${prompt}`;
    } else if (type === "thumbnailPrompt") {
      finalPrompt = `Write a detailed AI image prompt for a YouTube thumbnail, under 30 words.Only One no options. No explanation.\n\n ${prompt}`;
    } else if (type === "seo") {
      finalPrompt = `Write a concise YouTube SEO description under 30 words. No explanation.\n\n ${prompt}`;
    }

    const openRouterResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemma-3n-e4b-it:free",
        messages: [{ role: "user", content: finalPrompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const contentResponse = openRouterResponse.data?.choices?.[0]?.message?.content?.trim() || "";

    res.status(200).json({
      type,
      data: {
        prompt,
        response: contentResponse,
      },
    });
  } catch (err) {
    console.error("OpenRouter generation failed:", err.response?.data || err.message);
    return res.status(500).json({
      message: "Generation failed",
      error: err?.response?.data || err.message,
    });
  }
};



//Save content to database
export const saveContent = async (req, res) => {
  const { type, data } = req.body;

  if (!type || !data?.prompt || !data?.response) {
    return res.status(400).json({ message: 'Invalid content data' });
  }

  try {
    const content = await Content.create({
      user: req.user._id,
      type,
      data,
    });

    res.status(201).json(content);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save content', error: err.message });
  }
};

