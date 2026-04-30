const SAFE_EQUATION_REGEX = /^[\d+\-*/]+$/;
const CONSECUTIVE_OPERATORS_REGEX = /[+\-*/]{2}/;

/**
 * Evaluates a math expression with standard operator precedence (* and / before + and -).
 * Returns null for invalid or unsafe expressions.
 */
const safeEval = (equation: string): number => {
  const tokens = equation.match(/\d+|[+\-*/]/g) ?? [];

  // First pass: resolve * and /
  const simplified: (number | string)[] = [];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token === "*" || token === "/") {
      const left = simplified.pop() as number;
      const right = Number(tokens[i + 1]);
      simplified.push(token === "*" ? left * right : left / right);
      i += 2;
    } else {
      simplified.push(Number.isNaN(Number(token)) ? token : Number(token));
      i++;
    }
  }

  // Second pass: resolve + and -
  let result = simplified[0] as number;
  for (let j = 1; j < simplified.length; j += 2) {
    const op = simplified[j] as string;
    const operand = simplified[j + 1] as number;
    result = op === "+" ? result + operand : result - operand;
  }

  return result;
};

export const evaluate = (equation: string): number | null => {
  if (!SAFE_EQUATION_REGEX.test(equation)) return null;
  if (CONSECUTIVE_OPERATORS_REGEX.test(equation)) return null;
  if (!/^\d/.test(equation)) return null;

  const result = safeEval(equation);
  return Number.isFinite(result) ? result : null;
};

export const isCumulativeSolution = (
  arr1: string[],
  arr2: string[],
): boolean => {
  if (arr1.length !== arr2.length) return false;
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();
  return sortedArr1.every((char, index) => char === sortedArr2[index]);
};
