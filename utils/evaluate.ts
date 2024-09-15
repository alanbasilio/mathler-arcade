export function evaluate(equation: string): number {
  try {
    return new Function(`return ${equation};`)();
  } catch (error) {
    return 0;
  }
}
