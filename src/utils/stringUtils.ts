
/**
 * Calculate the similarity between two strings using Levenshtein distance
 * @param str1 First string to compare
 * @param str2 Second string to compare
 * @param threshold Similarity threshold (0-1, where 1 is exact match)
 * @returns Boolean indicating if strings are similar based on threshold
 */
export function isSimilarString(str1: string, str2: string, threshold = 0.7): boolean {
  // Quick check for exact matches
  if (str1 === str2) return true;
  
  // Normalize strings for comparison
  const normalized1 = str1.toLowerCase().trim();
  const normalized2 = str2.toLowerCase().trim();
  
  // If either string is too short, use simpler comparison
  if (normalized1.length < 5 || normalized2.length < 5) {
    // For short strings, check if one contains the other
    return normalized1.includes(normalized2) || normalized2.includes(normalized1);
  }

  // Calculate Levenshtein distance
  const distance = levenshteinDistance(normalized1, normalized2);
  
  // Calculate similarity as a ratio (1 - distance/maxLength)
  const maxLength = Math.max(normalized1.length, normalized2.length);
  const similarity = 1 - distance / maxLength;
  
  return similarity >= threshold;
}

/**
 * Calculate the Levenshtein distance between two strings
 * (minimum number of single-character edits required to change one string into the other)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;

  // Create the distance matrix
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  // Initialize the matrix
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Alternative similarity method using word overlap
 * Useful for detecting semantically similar questions
 */
export function calculateWordOverlap(str1: string, str2: string): number {
  // Normalize and split into words
  const words1 = new Set(str1.toLowerCase().trim().split(/\W+/).filter(w => w.length > 2));
  const words2 = new Set(str2.toLowerCase().trim().split(/\W+/).filter(w => w.length > 2));
  
  // Count overlapping words
  let overlapCount = 0;
  words1.forEach(word => {
    if (words2.has(word)) overlapCount++;
  });
  
  // Calculate overlap ratio
  const totalUniqueWords = new Set([...words1, ...words2]).size;
  return totalUniqueWords > 0 ? overlapCount / totalUniqueWords : 0;
}

/**
 * Enhanced similarity check that combines multiple methods
 * to better identify duplicate questions, especially for follow-up questions
 */
export function isQuestionDuplicate(question1: string, question2: string): boolean {
  // Quick exact match check
  if (question1 === question2) return true;
  
  // Normalize questions
  const q1 = question1.toLowerCase().trim().replace(/\?+$/, '');
  const q2 = question2.toLowerCase().trim().replace(/\?+$/, '');
  
  // Check if one completely contains the other (for short questions)
  if (q1.includes(q2) || q2.includes(q1)) return true;
  
  // For questions that might be phrased differently but have the same intent
  const stringSimScore = isSimilarString(q1, q2, 0.75); // Higher threshold
  const wordOverlapScore = calculateWordOverlap(q1, q2);
  
  // If both similarity scores are high enough, consider it duplicate
  return stringSimScore && wordOverlapScore > 0.5;
}
