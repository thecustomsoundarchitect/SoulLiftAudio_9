// Validate prompts for backend filtering and monitoring
export function validatePrompts(prompts: string[]): { valid: string[]; issues: string[] } {
  const issues: string[] = [];
  const seen = new Set<string>();
  let questions = 0;
  let statements = 0;

  const valid = prompts.filter((prompt, idx) => {
    const trimmed = prompt.trim();

    // Rule: Length 3–6 words
    const wordCount = trimmed.split(/\s+/).length;
    if (wordCount < 3 || wordCount > 6) {
      issues.push(`Line ${idx + 1}: "${trimmed}" is ${wordCount} words`);
      return false;
    }

    // Rule: No "smell"
    if (/smell/i.test(trimmed)) {
      issues.push(`Line ${idx + 1}: contains 'smell'`);
      return false;
    }

    // Rule: Uniqueness
    const lower = trimmed.toLowerCase();
    if (seen.has(lower)) {
      issues.push(`Line ${idx + 1}: duplicate prompt`);
      return false;
    }
    seen.add(lower);

    // Rule: Question/Statement
    const firstWord = trimmed.split(' ')[0].toLowerCase();
    const questionStarters = [
      'who','what','when','where','why','how','can','will','would','could','should','do','does','did','is','are','am','may','might','shall','have','has','had'
    ];
    if (questionStarters.includes(firstWord)) {
      questions++;
    } else {
      statements++;
    }

    return true;
  });

  // Rule: 6 questions, 2 statements
  if (questions < 6) {
    issues.push(`Only ${questions} questions (need 6)`);
  }
  if (statements < 2) {
    issues.push(`Only ${statements} statements (need 2)`);
  }

  if (issues.length > 0) {
    console.warn('[PromptValidation]', { issues, prompts });
  }

  return { valid, issues };
}
export interface PromptSeedOptions {
  coreFeeling: string;
  tone: string;
  recipient: string;
  occasion: string;
}

export function buildPrompt({
  coreFeeling,
  tone,
  recipient,
  occasion
}: PromptSeedOptions): string {
  return `
You are a creative emotional assistant.

Your task:
- Generate exactly 8 short emotionally resonant prompts.
- 6 must be **questions**
- 2 must be **statements**
- Each must be a short **phrase** (3–6 words only)
- No greetings or explanations
- No punctuation, no numbering
- DO NOT reference "smell" in any form
- Avoid repetition
- Format: raw list, one per line

Context:
Feeling: ${coreFeeling}
Tone: ${tone || 'neutral'}
Recipient: ${recipient || 'a loved one'}
Occasion: ${occasion || 'no occasion'}
`;
}