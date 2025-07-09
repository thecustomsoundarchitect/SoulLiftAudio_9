export async function generatePromptSeeds(
  coreFeeling: string,
  tone: string,
  recipient: string,
  occasion: string,
  recipientAge: string,
  userAge: string,
  additionalConstraint?: string
): Promise<string[]> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found in environment variables');
  }

  const systemPrompt = `You are an expert at generating emotionally guided prompts for heartfelt messages. Generate 8 short, inspirational prompts that help users craft meaningful messages. Each prompt should be emotionally resonant and specific to the context provided. ${additionalConstraint || ''}`;

  const userPrompt = `Core feeling: ${coreFeeling}
Tone: ${tone}
Recipient: ${recipient}
Occasion: ${occasion}
Recipient Age: ${recipientAge}
User Age: ${userAge}
Please respond with a JSON array of 8 short inspirational prompts.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content;
    
    // Parse the JSON response
    const prompts = JSON.parse(responseText);
    
    if (!Array.isArray(prompts)) {
      throw new Error('Response is not an array');
    }
    
    // Handle both string and object responses
    const processedPrompts = prompts.map(prompt => {
      if (typeof prompt === 'string') {
        return prompt;
      } else if (prompt && typeof prompt === 'object' && prompt.prompt) {
        return prompt.prompt;
      } else {
        return String(prompt);
      }
    });
    
    return processedPrompts;
  } catch (error) {
    console.error('Error generating prompt seeds:', error);
    throw error;
  }
}
