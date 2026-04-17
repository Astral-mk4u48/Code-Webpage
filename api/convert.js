export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, language } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({ error: "No code provided." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server configuration error." });
  }

  const prompt = `You are a code-to-HTML converter tool. Your job is to take a student's code and produce a clean, complete HTML webpage that visually represents what the code does — its output, logic flow, or purpose — without changing anything about the code's behavior or logic.

Rules:
- Output ONLY raw HTML. No markdown, no code fences, no explanation, no comments outside the HTML.
- The HTML must be a complete document (<!DOCTYPE html>, <html>, <head>, <body>).
- Represent the code's output or behavior visually on the page (e.g. if it's a calculator, show a calculator UI; if it prints text, show that text nicely).
- Keep the look clean, modern, and student-friendly.
- Do NOT mention AI, machine learning, or any conversion tool anywhere in the HTML.
- Do NOT add any features or logic the original code doesn't have.
- The page should feel like the student built it themselves.

Language: ${language}

Code:
\`\`\`
${code}
\`\`\`

Respond with only the complete HTML document, nothing else.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini error:", err);
      return res.status(500).json({ error: "Conversion failed. Please try again." });
    }

    const data = await response.json();
    let html = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Strip any accidental markdown code fences
    html = html.replace(/^```[a-z]*\n?/i, "").replace(/```$/i, "").trim();

    return res.status(200).json({ html });
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
