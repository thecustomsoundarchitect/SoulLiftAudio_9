// server/index.ts  (cleaned-up)
import express, { Request, Response } from 'express';
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
app.get('/api/test', (_req, res: Response) => res.json({ message: 'Server is working!' }));

// 2. Prompt seeds (modern chat endpoint)
// --- /api/prompt-seeds  (backend) ---
// 2. Prompt seeds (copied from routes.ts)
app.post('/api/prompt-seeds', async (req: Request, res: Response) => {
  try {
    const { coreFeeling, tone, recipient, occasion } = req.body;
    const prompt = `Generate 8 very short, inspirational prompts (each no more than 10 words, no greetings, no full sentences, just short phrases) for ${recipient} about ${coreFeeling} in a ${tone} tone for ${occasion}. Number them 1-8, one per line.`;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });
    let content = response.choices[0]?.message?.content || '';
    let lines = content.split(/\r?\n/)
      .map(l => l.replace(/^\s*\d+\.?\s*/, '').replace(/^[-*]\s*/, '').trim())
      .filter(l => l.length > 0);
    if (lines.length === 1 && lines[0].startsWith('[')) {
      try {
        const arr = JSON.parse(lines[0]);
        if (Array.isArray(arr)) lines = arr.map(x => (typeof x === 'string' ? x : String(x)));
      } catch {}
    }
    if (lines.length < 8) {
      while (lines.length < 8) lines.push('');
    } else if (lines.length > 8) {
      lines = lines.slice(0, 8);
    }
    res.json(lines);
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