// server/promptRules.ts
// SoulLift prompt generation & validation
// – 8 prompts (6 Q / 2 S)                – 6-10 words
// – Allows “you / your / they / their”   – Bans gendered pronouns
// – Bans “smell”, “touch”, unsafe topics – Optional recipient name usage

/* ---------- CONSTANTS ---------- */
const bannedSmellWords = ['smell', 'smells', 'scent', 'odor', 'aroma'];
const unsafeTopics = [
  'difficult times', 'lowest moments', 'depression', 'suicidal', 'crisis',
  'drinking', 'drugs', 'alcohol', 'substance', 'address', 'money',
  'financial', 'abuse', 'neglect', 'dysfunction'
];
const bannedGenderPronouns = ['he', 'she', 'him', 'her', 'his', 'hers'];

/* ---------- VALIDATOR ---------- */
export function validatePrompts(
  prompts: string[],
  recipientName?: string
): { valid: string[]; issues: string[] } {
  const issues: string[] = [];
  const seen = new Set<string>();
  let questions = 0;
  let statements = 0;
  let nameHits = 0;

  const valid = prompts.filter((prompt, idx) => {
    const trimmed = prompt.trim();
    const lower = trimmed.toLowerCase();

    // 1. Word count 6-10
    const count = trimmed.replace(/[?.!]/g, '').split(/\s+/).length;
    if (count < 6 || count > 10) {
      issues.push(`Line ${idx + 1}: word count ${count}`);
      return false;
    }

    // 2. Banned words / topics
    if (bannedSmellWords.some(w => lower.includes(w))) {
      issues.push(`Line ${idx + 1}: contains smell word`);
      return false;
    }
    if (unsafeTopics.some(t => lower.includes(t))) {
      issues.push(`Line ${idx + 1}: unsafe topic`);
      return false;
    }
    if (bannedGenderPronouns.some(p => new RegExp(`\\b${p}\\b`, 'i').test(trimmed))) {
      issues.push(`Line ${idx + 1}: gendered pronoun`);
      return false;
    }

    // 3. Duplicate check
    if (seen.has(lower)) {
      issues.push(`Line ${idx + 1}: duplicate`);
      return false;
    }
    seen.add(lower);

    // 4. Question / statement counting
    trimmed.endsWith('?') ? questions++ : statements++;

    // 5. Name usage count
    if (recipientName && new RegExp(`\\b${recipientName}\\b`, 'i').test(trimmed)) {
      nameHits++;
    }

    return true;
  });

  // Require 6 questions, 2 statements
  if (questions < 6) issues.push(`Only ${questions} questions (need 6)`);
  if (statements < 2) issues.push(`Only ${statements} statements (need 2)`);

  // Require at least 1 name use if provided
  if (recipientName && nameHits === 0) {
    issues.push(`Recipient name "${recipientName}" never used`);
  }

  if (issues.length) console.warn('[PromptValidation]', { issues, prompts });
  return { valid, issues };
}

/* ---------- PROMPT BUILDER ---------- */
export interface PromptSeedOptions {
  coreFeeling: string;
  tone?: string;
  recipient?: string;
  occasion?: string;
  recipientName?: string;
  recipientAge?: number;
  writerAge?: number;
}

export function buildPrompt({
  coreFeeling,
  tone,
  recipient,
  occasion,
  recipientName,
  recipientAge,
  writerAge
}: PromptSeedOptions): string {
  return `
You are a creative emotional assistant.

Generate exactly 8 prompts for the writer.

Rules:
• 6 prompts must be QUESTIONS (end with “?”)
• 2 prompts must be STATEMENTS (no “?”)
• Each prompt is 6–10 words long
• Prompts should help the writer talk about the recipient’s:
  – unique traits
  – shared rituals or traditions
  – memorable moments of kindness or surprise
  – go-to way of cheering others up
  – small gestures that show appreciation
• Pronouns “you / your / they / their” are allowed
• Do NOT use gendered pronouns (he, she, him, her, his, hers)
• Avoid the words “smell” and “touch”
• If Recipient Name is provided, include it in at least two prompts
• No greetings, numbering, or filler text
• Output one prompt per line only

Context:
Feeling: ${coreFeeling}
${tone ? `Tone: ${tone}` : ''}
${recipient ? `Recipient role: ${recipient}` : ''}
${occasion ? `Occasion: ${occasion}` : ''}
${recipientName ? `Recipient Name: ${recipientName}` : ''}
${recipientAge ? `Recipient Age: ${recipientAge}` : ''}
${writerAge ? `Writer Age: ${writerAge}` : ''}
`;
}