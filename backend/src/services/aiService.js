const fallbackResponse = (message, language) => {
  const english = `I can help with that. I do not have a Groq key configured yet, but I understood: "${message}".`;
  const hindi = `मैं इसमें आपकी मदद कर सकता हूँ। अभी Groq key configured नहीं है, लेकिन मैंने यह समझा: "${message}".`;
  return language === 'hi' ? hindi : english;
};

const createClient = () => {
  if (!process.env.GROQ_API_KEY) return null;

  return {
    async chatCompletion({ model, messages, temperature, max_tokens }) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(errorText || `Groq request failed with status ${response.status}`);
        error.status = response.status;
        throw error;
      }

      return response.json();
    }
  };
};

export const generateReply = async ({ message, history = [], language = 'en', products = [] }) => {
  const client = createClient();
  if (!client) {
    return fallbackResponse(message, language);
  }

  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
  const languageInstruction = language === 'hi'
    ? 'Reply naturally in Hindi. If English is better for code, use clear Hinglish only when helpful.'
    : 'Reply naturally in English.';

  const systemPrompt = [
    'You are a strict shopping assistant.',
    'Only talk about shopping recommendations, products, prices, and buying advice.',
    'Do not provide code, scripts, programming help, or unrelated general knowledge.',
    'Keep responses concise and conversational, suitable for voice output.',
    'When product results are supplied, give a short structured summary with bullet points.',
    'Do not print raw URLs or markdown links in the text response because the UI renders buy buttons separately.',
    'Focus on relevance: mention product name, approximate price, and why it is a good fit.',
    languageInstruction
  ].join(' ');

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((item) => ({ role: item.role, content: item.content })),
    products.length
      ? { role: 'system', content: `Shopping results available: ${JSON.stringify(products.slice(0, 5))}` }
      : null,
    { role: 'user', content: message }
  ].filter(Boolean);

  try {
    const completion = await client.chatCompletion({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 450
    });

    return completion.choices?.[0]?.message?.content?.trim() || fallbackResponse(message, language);
  } catch (error) {
    const status = error?.status || error?.response?.status;
    const isQuotaOrAuthIssue = status === 401 || status === 429;

    if (isQuotaOrAuthIssue) {
      console.warn(`Groq unavailable (${status}). Using fallback assistant reply.`);
      return fallbackResponse(message, language);
    }

    console.error('Groq request failed:', error?.message || error);
    return fallbackResponse(message, language);
  }
};
