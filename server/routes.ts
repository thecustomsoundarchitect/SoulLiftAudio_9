import { Router } from "express";
import OpenAI from "openai";

const router = Router();

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate message endpoint
router.post("/generate-message", async (req, res) => {
  try {
    const { stories, descriptors, coreFeeling, tone, recipient, occasion, length } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    // Combine stories and descriptors into a comprehensive prompt
    const allContent = [...(stories || []), ...(descriptors || [])];
    const contentText = allContent.join(", ");

    // Determine target length based on the length parameter
    const lengthInstructions = {
      "30s": "Keep the message concise and impactful, around 30-40 words suitable for a 30-second audio message.",
      "1m": "Create a heartfelt message of about 80-120 words suitable for a 1-minute audio message.",
      "2m": "Craft a detailed and emotionally rich message of about 150-200 words suitable for a 90-120 second audio message."
    };

    const lengthInstruction = lengthInstructions[length as keyof typeof lengthInstructions] || lengthInstructions["1m"];

    const systemPrompt = `You are an expert at crafting heartfelt, personal messages that create emotional connections. Your task is to create a deeply moving message that feels authentic and personal. ${lengthInstruction}

The message should:
- Be written in a warm, conversational tone
- Feel personal and genuine
- Incorporate the provided stories and descriptors naturally
- Be emotionally resonant and uplifting
- Flow smoothly when read aloud
- Avoid clichés and generic phrases`;

    const userPrompt = `Please create a heartfelt message using these details:

${contentText ? `Stories and descriptors: ${contentText}` : ''}
${coreFeeling ? `Core feeling: ${coreFeeling}` : ''}
${tone ? `Tone: ${tone}` : ''}
${recipient ? `Recipient: ${recipient}` : ''}
${occasion ? `Occasion: ${occasion}` : ''}

Create a message that naturally weaves these elements together in a way that feels authentic and personally meaningful.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: length === "30s" ? 80 : length === "2m" ? 300 : 150,
      temperature: 0.7,
    });

    const message = completion.choices[0].message.content;

    if (!message) {
      throw new Error("No message generated");
    }

    res.json({ message });
  } catch (error) {
    console.error("Error generating message:", error);
    res.status(500).json({ error: "Failed to generate message" });
  }
});

export default router;
