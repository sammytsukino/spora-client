import { MOOD_LEXICONS } from "@/data/mood-lexicons";

export interface MorphologyResult {
  dominantMood: string;
  sentimentStrength: number;
  vowelDensity: number;
  sibilanceIndex: number;
  entropy: number;
  avgLengthDelta: number;
}

export function extractMorphology(text: string | null | undefined): MorphologyResult | null {
  if (!text || text.trim() === "") return null;

  const words = text.trim().split(/\s+/);
  const chars = text.replace(/\s/g, "");
  const totalChars = chars.length;
  const totalWords = words.length;

  if (totalChars === 0) return null;

  const categoryScores: Record<string, number> = {};
  for (const key of Object.keys(MOOD_LEXICONS)) categoryScores[key] = 0;

  words.forEach((word) => {
    const clean = word.toLowerCase().replace(/[^a-záéíóúüñ]/g, "");
    if (clean.length > 2) {
      for (const [profileKey, lexicon] of Object.entries(MOOD_LEXICONS)) {
        if (lexicon.includes(clean)) categoryScores[profileKey]++;
      }
    }
  });

  let dominantMood = "neutral";
  let maxScore = 0;
  for (const [profileKey, score] of Object.entries(categoryScores)) {
    if (score > maxScore) {
      maxScore = score;
      dominantMood = profileKey;
    }
  }

  const vowels = (text.match(/[aeiouáéíóúüAEIOUÁÉÍÓÚÜ]/g) || []).length;
  const sibilants = (text.match(/[szxfcSZXFC]/g) || []).length;
  const uniqueChars = new Set(chars.toLowerCase().split("")).size;

  let totalLengthDelta = 0;
  words.forEach((word, i) => {
    if (i > 0) {
      totalLengthDelta += Math.abs(word.length - words[i - 1].length);
    }
  });

  return {
    dominantMood,
    sentimentStrength: maxScore,
    vowelDensity: vowels / totalChars,
    sibilanceIndex: sibilants / totalChars,
    entropy: uniqueChars / 30,
    avgLengthDelta: totalWords > 1 ? totalLengthDelta / (totalWords - 1) : 0,
  };
}
