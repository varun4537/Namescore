import { RARE_LETTERS, SOFT_CLUSTERS } from '../constants';

/**
 * Deterministically calculates a "Name Score" based on playful linguistic rules.
 * This ensures "Alice" always gets the same score locally before we enhance it with AI.
 */
export const calculateDeterministicScore = (name: string): number => {
  const lowerName = name.toLowerCase().trim();
  if (!lowerName) return 0;

  let score = 50; // Base score

  // 1. Length Bonus/Penalty
  // Sweet spot is 4-7 letters
  if (lowerName.length >= 4 && lowerName.length <= 7) score += 5;
  if (lowerName.length < 3) score -= 5; // Too short
  if (lowerName.length > 9) score -= 5; // Too long

  // 2. Consonant vs Vowel Balance
  const vowels = lowerName.match(/[aeiouy]/g) || [];
  const consonants = lowerName.match(/[bcdfghjklmnpqrstvwxz]/g) || [];
  
  const vowelCount = vowels.length;
  const consonantCount = consonants.length;

  // We prefer balanced or slightly consonant heavy
  if (consonantCount > vowelCount) {
    score += (consonantCount - vowelCount) * 2;
  } else if (vowelCount > consonantCount + 1) {
    // Too many vowels (softness penalty)
    score -= (vowelCount - consonantCount) * 2;
  }

  // 3. Rare Letter Bonus (The "Cool" Factor)
  let rareBonus = 0;
  for (const char of lowerName) {
    if (RARE_LETTERS.includes(char)) {
      rareBonus += 8;
    }
  }
  score += Math.min(rareBonus, 30); // Cap rare bonus

  // 4. Soft Cluster Penalty
  for (const cluster of SOFT_CLUSTERS) {
    if (lowerName.includes(cluster)) {
      score -= 4;
    }
  }

  // 5. First Letter Impact
  const firstChar = lowerName[0];
  if (RARE_LETTERS.includes(firstChar)) {
    score += 5; // Strong start
  }

  // Normalize
  return Math.min(99, Math.max(12, Math.floor(score)));
};

export const getRarityLevel = (score: number): 'Common' | 'Rare' | 'Legendary' | 'Mythical' => {
  if (score >= 90) return 'Mythical';
  if (score >= 75) return 'Legendary';
  if (score >= 50) return 'Rare';
  return 'Common';
};