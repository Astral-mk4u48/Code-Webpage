# Coding Buds — Code to Webpage

A tool for students to convert their code into shareable HTML webpages.

## Project Structure

```
coding-buds/
├── index.html         ← The frontend
├── api/
│   └── convert.js     ← Vercel serverless function (calls Gemini)
├── vercel.json        ← Vercel config
└── README.md
```

## Deploying to Vercel

### 1. Push to GitHub
Create a new GitHub repo and push this folder to it.

### 2. Import into Vercel
- Go to [vercel.com](https://vercel.com) and click **Add New Project**
- Import your GitHub repo
- Framework preset: **Other**

### 3. Add your Gemini API Key
In your Vercel project dashboard:
- Go to **Settings → Environment Variables**
- Add a new variable:
  - **Name:** `GEMINI_API_KEY`
  - **Value:** your Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 4. Deploy
Click **Deploy** — that's it! Vercel will build and host the project.

---

> The API key is stored securely as a Vercel environment variable and is never exposed to students.
