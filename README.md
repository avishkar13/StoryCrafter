# 🚀 StoryCrafter – AI-Powered SaaS for YouTube Creators

[![Render Deployment](https://img.shields.io/badge/Deployed%20on-Render-3c83f6?style=for-the-badge&logo=render)](https://storycrafter.onrender.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-lightgrey.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

> ✨ Create engaging YouTube scripts, titles, thumbnails, and SEO tags with AI. Built with the MERN stack and OpenAI APIs.

🔗 **Live Site**: [https://storycrafter.onrender.com](https://storycrafter.onrender.com)

---

## 📸 Overview

**StoryCrafter** is an AI-powered SaaS platform tailored for YouTubers and content creators to ideate, script, and package high-quality videos — faster than ever.

### ✨ Features

- 📝 **Script Generator** – Generate full video scripts using AI.
- 🎬 **Title Creator** – Get catchy video titles instantly.
- 🖼️ **Thumbnail Prompt & Image Generator** – AI-crafted prompts & images for thumbnails.
- 🔍 **SEO Tags Generator** – Boost discoverability with smart tags.
- 🔊 **Text-to-Speech (TTS)** – Preview your scripts with audio.
- 🧠 **Google OAuth** – One-click secure login.
- 💾 **Save & Manage Content** – Organized history of your creations.
- 📊 **Dashboard** – Real-time overview, stats, and notes.

---

## 🧰 Tech Stack

| Frontend | Backend | Database | AI/ML | Deployment |
|---------|---------|----------|------|-------------|
| React + TailwindCSS | Node.js + Express | MongoDB Atlas | OpenRouter, Together.API | Render |

---

## 📂 Project Structure

```
StoryCrafter/
│
├── client/         # Frontend (Vite + React)
├── server/         # Backend (Express + MongoDB)
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   └── lib/
├── .env            # Environment Variables
├── package.json    # Root for full-stack deployment
```

---

## ⚙️ Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/avishkar13/StoryCrafter.git
cd StoryCrafter
```

### 2. Setup Environment Variables

Create `.env` files inside both `client/` and `server/` folders.

#### For `client/.env`:
```env
VITE_BACKEND_URL=http://localhost:5000/api
```

#### For `server/.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
```

### 3. Run the App Locally

```bash
# Root level
npm run build      # Builds frontend
npm run start      # Starts backend + serves frontend
```

Visit: [http://localhost:5000](http://localhost:5000)

---

## 🚀 Deployment on Render

1. Set **Root Directory** to `.`  
2. Install build script:
```json
"scripts": {
  "build": "npm install --prefix server && npm install --prefix client && npm run build --prefix client",
  "start": "npm run start --prefix server"
}
```
3. Add Environment Variables in Render settings for both client and server.
4. App auto-builds and deploys from root.

---


## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to fork the repo and submit a pull request.

---

## 📄 License

Licensed under the [ISC License](LICENSE).

---

## 🙋‍♂️ Author

**Avishkar Deogharia**  
📧 [Connect on LinkedIn](https://www.linkedin.com/in/avishkardeogharia/)  
🐙 [@avishkar13 on GitHub](https://github.com/avishkar13)

---

> Made with ❤️ for creators, by a creator. 
