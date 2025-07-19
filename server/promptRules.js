"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePrompts = validatePrompts;
exports.buildPrompt = buildPrompt;
// server/promptRules.ts
// Validate prompts for backend filtering and monitoring
function validatePrompts(prompts) {
    var issues = [];
    var seen = new Set();
    var questions = 0;
    var statements = 0;
    var valid = prompts.filter(function (prompt, idx) {
        var trimmed = prompt.trim();
        // Rule: Length 3–6 words
        var wordCount = trimmed.split(/\s+/).length;
        if (wordCount < 3 || wordCount > 6) {
            issues.push("Line ".concat(idx + 1, ": \"").concat(trimmed, "\" is ").concat(wordCount, " words"));
            return false;
        }
        // Rule: No "smell"
        if (/smell/i.test(trimmed)) {
            issues.push("Line ".concat(idx + 1, ": contains 'smell'"));
            return false;
        }
        // Rule: Uniqueness
        var lower = trimmed.toLowerCase();
        if (seen.has(lower)) {
            issues.push("Line ".concat(idx + 1, ": duplicate prompt"));
            return false;
        }
        seen.add(lower);
        // Rule: Question/Statement
        var firstWord = trimmed.split(' ')[0].toLowerCase();
        var questionStarters = [
            'who', 'what', 'when', 'where', 'why', 'how', 'can', 'will', 'would', 'could', 'should', 'do', 'does', 'did', 'is', 'are', 'am', 'may', 'might', 'shall', 'have', 'has', 'had'
        ];
        if (questionStarters.includes(firstWord)) {
            questions++;
        }
        else {
            statements++;
        }
        return true;
    });
    // Rule: 6 questions, 2 statements
    if (questions < 6) {
        issues.push("Only ".concat(questions, " questions (need 6)"));
    }
    if (statements < 2) {
        issues.push("Only ".concat(statements, " statements (need 2)"));
    }
    if (issues.length > 0) {
        console.warn('[PromptValidation]', { issues: issues, prompts: prompts });
    }
    return { valid: valid, issues: issues };
}
function buildPrompt(_a) {
    var coreFeeling = _a.coreFeeling, tone = _a.tone, recipient = _a.recipient, occasion = _a.occasion;
    return "\nYou are a creative emotional assistant.\n\nYour task:\n- Generate exactly 8 short emotionally resonant prompts.\n- 6 must be **questions**\n- 2 must be **statements**\n- Each must be a short **phrase** (3\u20136 words only)\n- No greetings or explanations\n- No punctuation, no numbering\n- DO NOT reference \"smell\" in any form\n- Avoid repetition\n- Format: raw list, one per line\n\nContext:\nFeeling: ".concat(coreFeeling, "\nTone: ").concat(tone || 'neutral', "\nRecipient: ").concat(recipient || 'a loved one', "\nOccasion: ").concat(occasion || 'no occasion', "\n");
}
