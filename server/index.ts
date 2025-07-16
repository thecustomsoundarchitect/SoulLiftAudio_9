// server/index.ts  (cleaned-up)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { buildPrompt, validatePrompts } from './promptRules.ts';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. Health check
app.get('/api/test', (_req, res) => res.json({ message: 'Server is working!' }));

// 2. Prompt seeds (modern chat endpoint)
// --- /api/prompt-seeds  (backend) ---
app.post('/api/prompt-seeds', async (req, res) => {
    // Debug: log raw OpenAI output
    console.log('[PromptDebug] Raw OpenAI output:', response.choices[0]?.message?.content);
  try {
    const { coreFeeling, tone, recipient, occasion } = req.body;

    const systemPrompt = `
You are a creative assistant. Generate exactly 8 short emotionally-resonant prompts:
- Each must be 3–6 words
- 6 must be questions
- 2 must be statements
- No references to "smell"
- No repetition
- No punctuation or bullets
- No greetings or explanations
Output should be a raw JSON array of strings.
`;

    const userPrompt = `For ${recipient} on ${occasion}. Core feeling: ${coreFeeling}. Tone: ${tone}.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 80,
      temperature: 0.7,
      n: 1,
    });

    // Try to parse as JSON array, fallback to line split
    let rawArr: string[] = [];
    try {
      rawArr = JSON.parse(response.choices[0]?.message?.content || '[]');
    } catch {
      rawArr = (response.choices[0]?.message?.content || '')
        .split(/\n|\r|\./)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Remove punctuation and aggressively split long lines into 3–6 word chunks
    let cleaned: string[] = [];
    for (const s of rawArr) {
      const line = s.replace(/[.,!?;:]/g, '').trim();
      if (!line) continue;
      const words = line.split(/\s+/);
      if (words.length <= 6) {
        cleaned.push(line);
      } else {
        // Split into 3–6 word chunks
        for (let i = 0; i < words.length; i += 4) {
          const chunk = words.slice(i, i + 5).join(' ');
          if (chunk.split(' ').length >= 3 && chunk.split(' ').length <= 6) {
            cleaned.push(chunk);
          }
        }
      }
    }
    // Debug: log cleaned lines
    console.log('[PromptDebug] Cleaned lines:', cleaned);

    // Validate and log issues
    const { valid, issues } = validatePrompts(cleaned);
    if (issues.length > 0) {
      // Already logged in validatePrompts
    }
    // Debug: log final valid output
    console.log('[PromptDebug] Final valid output:', valid);

    // Ensure 6 questions, 2 statements
    const questionStarters = [
      'who','what','when','where','why','how','can','will','would','could','should','do','does','did','is','are','am','may','might','shall','have','has','had'
    ];
    let questions = valid.filter(s => questionStarters.includes(s.split(' ')[0].toLowerCase()));
    let statements = valid.filter(s => !questionStarters.includes(s.split(' ')[0].toLowerCase()));

    while (questions.length < 6) questions.push('What lifts your spirit');
    while (statements.length < 2) statements.push('You are deeply valued');

    const result = [...questions.slice(0, 6), ...statements.slice(0, 2)];
    res.json(result);
  } catch (err: any) {
    console.error('prompt-seeds error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Generate final message
app.post('/api/generate-message', async (req, res) => {
  try {
    const { collectedThoughts, descriptors, coreFeeling, tone, recipient, occasion, length } = req.body;

    const systemPrompt = `You are an expert at crafting heartfelt, personalized messages.`;
    const userPrompt = `Write a ${length} message for ${recipient || 'someone special'} making them feel ${coreFeeling}.
Tone: ${tone || ''}
Occasion: ${occasion || ''}
Collected thoughts:
${collectedThoughts.join('\n')}
Descriptors: ${descriptors.join(', ')}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const message = response.choices[0]?.message?.content?.trim();
    res.json({ message });
  } catch (err: any) {
    console.error('generate-message error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🌊 SoulLift backend running on http://localhost:${PORT}`);
  console.log(`🔑 API key loaded: ${!!process.env.OPENAI_API_KEY}`);
});