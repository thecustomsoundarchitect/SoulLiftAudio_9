
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { storage } from "./storage";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function registerRoutes(app: Express): Promise<Server> {

  // /api/prompt-seeds
  app.post('/api/prompt-seeds', async (req: Request, res: Response) => {
    try {
      const { coreFeeling, tone, recipient, occasion } = req.body;
      // You can add more rules/conditions here as needed
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

  // /api/generate-message
  app.post('/api/generate-message', async (req: Request, res: Response) => {
    try {
      const { collectedThoughts, descriptors, coreFeeling, tone, recipient, occasion, length } = req.body;
      const systemPrompt = `You are an expert at crafting heartfelt, personalized messages.`;
      const userPrompt = `Write a ${length} message for ${recipient || 'someone special'} making them feel ${coreFeeling}.\nTone: ${tone || ''}\nOccasion: ${occasion || ''}\nCollected thoughts:\n${collectedThoughts?.join('\n') || ''}\nDescriptors: ${descriptors?.join(', ') || ''}`;
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

  const httpServer = createServer(app);

  return httpServer;
}
