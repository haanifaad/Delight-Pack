/**
 * Safely evaluates a simple mathematical expression string without using eval().
 * Supports basic operators: +, -, *, /
 * 
 * @param input The string to evaluate (e.g., '500 * 1.05 + 50')
 * @returns The calculated number, or the original string if invalid/not math.
 */
export function evaluateInlineMath(input: string): string | number {
  if (typeof input !== 'string') return input;

  // Clean the input: remove all spaces
  const sanitized = input.replace(/\s+/g, '');

  // Check if it's a pure number already
  if (!isNaN(Number(sanitized)) && sanitized.trim() !== '') {
    return Number(sanitized);
  }

  // Regex to ensure the string ONLY contains numbers, decimals, and basic operators (+, -, *, /)
  // This prevents malicious code execution since we aren't using eval.
  // We use Function constructor which is safer than eval but we still restrict characters strongly.
  const mathRegex = /^[0-9+\-*/.()]+$/;
  
  if (!mathRegex.test(sanitized)) {
    return input; // Return original if it has letters or invalid characters
  }

  try {
    const result = new Function(`return ${sanitized}`)();
    
    // Ensure the result is a valid number
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      // Return with 2 decimal precision if it's a float to avoid long float issues
      return Number.isInteger(result) ? result : Number(result.toFixed(4));
    }
    return input;
  } catch (error) {
    console.error("Math evaluation error:", error);
    return input; // Fallback to original string
  }
}
