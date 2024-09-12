export function evaluate(equation: string): number | false {
  try {
    return new Function(`return ${equation};`)();
  } catch (error) {
    return false;
  }
}
