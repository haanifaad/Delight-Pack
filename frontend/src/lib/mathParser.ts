import { evaluate } from 'mathjs';

/**
 * Safely evaluates a mathematical expression string.
 * Returns the numerical result or the original string if it cannot be evaluated.
 */
export const evaluateMathString = (input: string | number): string | number => {
  if (typeof input === 'number') return input;
  if (!input || input.trim() === '') return input;

  try {
    // Basic regex to check if string contains math operators
    // Ensures we don't accidentally evaluate plain text like "Box A"
    const mathRegex = /^[0-9\+\-\*\/\(\)\.\s]+$/;
    
    if (mathRegex.test(input)) {
      const result = evaluate(input);
      // Ensure the result is a number and not an object/function
      if (typeof result === 'number' && !isNaN(result)) {
        return Number(result.toFixed(4)); // Cap to 4 decimal places for precision issues
      }
    }
    return input;
  } catch (error) {
    // If evaluation fails, return original input silently
    return input;
  }
};
