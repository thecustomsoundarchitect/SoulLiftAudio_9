export async function generatePromptSeeds(
  coreFeeling: string,
  tone: string,
  recipient: string,
  occasion: string,
  recipientAge: string,
  userAge: string,
  additionalConstraint?: string
): Promise<string[]> {
  try {
    const response = await fetch('/api/generate-prompt-seeds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        coreFeeling,
        tone,
        recipient,
        occasion,
        recipientAge,
        userAge,
        additionalConstraint
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.prompts;
  } catch (error) {
    console.error('Error generating prompt seeds:', error);
    throw error;
  }
}