import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { buildPrompt, validatePrompts } from './promptRules.ts';
import userProfileRouter from './src/routes/userProfile.ts';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5001', 10);

app.use(cors({ origin: ['http://localhost:5173', 'http://10.0.0.145:5173'], credentials: true }));
app.use(express.json());
app.use('/api/v2/user-profile', userProfileRouter);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. Health check
app.get('/api/test', (_req: express.Request, res: express.Response) => {
  res.json({ message: 'Server is working!' });
});

// 2. Prompt seeds
app.post('/api/prompt-seeds', async (req: express.Request, res: express.Response) => {
  try {
    const {
      coreFeeling,
      tone,
      recipient,
      occasion,
      recipientName,
      recipientAge,
      writerAge
    } = req.body;

    const prompt = buildPrompt({
      coreFeeling,
      tone,
      recipient,
      occasion,
      recipientName,
      recipientAge,
      writerAge
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: prompt }],
      max_tokens: 200,
      temperature: 0.7
    });

    let content = completion.choices[0]?.message?.content || '';
    let lines = content
      .split(/\r?\n/)
      .map((l) =>
        l
          .replace(/^\s*\d+\.?\s*/, '')
          .replace(/^[-*]\s*/, '')
          .trim()
      )
      .filter((l) => l.length > 0);

    if (lines.length === 1 && lines[0].startsWith('[')) {
      try {
        const arr = JSON.parse(lines[0]);
        if (Array.isArray(arr)) lines = arr.map((x) => String(x));
      } catch {}
    }

    if (lines.length < 8) while (lines.length < 8) lines.push('');
    if (lines.length > 8) lines = lines.slice(0, 8);

    res.json(lines);
  } catch (err: any) {
    console.error('prompt-seeds error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Generate final message
app.post('/api/generate-message', async (req: express.Request, res: express.Response) => {
  try {
    const {
      collectedThoughts,
      descriptors,
      coreFeeling,
      tone,
      recipient,
      occasion,
      length
    } = req.body;

    const systemPrompt =
      'You are an expert at crafting heartfelt, personalized messages.';
    const userPrompt = `Write a ${length} message for ${
      recipient || 'someone special'
    } making them feel ${coreFeeling}.
Tone: ${tone || ''}
Occasion: ${occasion || ''}
Collected thoughts:
${collectedThoughts.join('\n')}
Descriptors: ${descriptors.join(', ')}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const message = completion.choices[0]?.message?.content?.trim();
    res.json({ message });
  } catch (err: any) {
    console.error('generate-message error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌊 SoulLift backend running on http://localhost:${PORT}`);
  console.log(`🔑 API key loaded: ${!!process.env.OPENAI_API_KEY}`);
});