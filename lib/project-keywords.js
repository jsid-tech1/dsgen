export async function projectKeywords(description) {
  if (!process.env.SARVAM_API_KEY || !description.trim()) return [];
  try {
    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-subscription-key": process.env.SARVAM_API_KEY },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        model: "sarvam-105b",
        max_tokens: 128,
        messages: [
          { role: "system", content: 'Classify the project brief. Return JSON {"keywords":[]} with up to 10 English single-word tags for its industry, audience, product and mood.' },
          { role: "user", content: description },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!response.ok) return [];
    const payload = await response.json();
    const { keywords } = JSON.parse(payload.choices[0].message.content);
    return keywords.filter(word => typeof word === "string" && /^[a-z]{2,24}$/i.test(word)).slice(0, 10);
  } catch {
    return [];
  }
}
