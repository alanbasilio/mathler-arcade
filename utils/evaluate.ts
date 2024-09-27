export function evaluate(equation: string): number {
  try {
    return new Function(`return ${equation};`)();
  } catch (error) {
    return 0;
  }
}

export const isValidEquationWithoutZero = (equation: string): boolean => {
  const zeroWithOperatorsPattern = /[+\-*\/]0[+\-*\/]|0[+\-*\/]/;
  return !zeroWithOperatorsPattern.test(equation);
};

export const isCumulativeSolution = (
  arr1: string[],
  arr2: string[]
): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
};
