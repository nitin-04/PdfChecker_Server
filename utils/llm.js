const Groq = require('groq-sdk');

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

function buildPrompt(textByPages, rules) {
  const pagesText = textByPages
    .map((t, i) => `Page ${i + 1}:\n${t}`)
    .join('\n\n---\n\n');

  return `You are an assistant that inspects a document and evaluates rules.

Document pages:
${pagesText}

Rules to check (evaluate each one):
${rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}

For each rule, produce a JSON object with:
- "rule"
- "status": "pass" or "fail"
- "evidence": one short sentence with a quote + page number
- "reasoning": 1–2 sentences
- "confidence": integer 0–100

Return ONLY a JSON array. Example:
[
  {"rule": "...", "status": "pass", "evidence": "...", "reasoning": "...", "confidence": 92}
]`;
}

async function callLLMForRules(textByPages, rules) {
  const prompt = buildPrompt(textByPages, rules);

  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 800,
    temperature: 0.2,
  });

  const raw = completion.choices?.[0]?.message?.content || '';

  try {
    const jsonText = raw
      .replace(/^[\s\S]*?```json\s*/, '')
      .replace(/```[\s\S]*$/, '')
      .trim();

    const parsed = JSON.parse(jsonText);

    return parsed.map((item) => ({
      rule: item.rule || '',
      status: (item.status || '').toLowerCase().includes('pass')
        ? 'pass'
        : 'fail',
      evidence: item.evidence || '',
      reasoning: item.reasoning || '',
      confidence: Math.min(100, Math.max(0, parseInt(item.confidence) || 0)),
    }));
  } catch (err) {
    throw new Error('Groq JSON parse error. Raw output: ' + raw.slice(0, 1000));
  }
}

module.exports = { callLLMForRules };
