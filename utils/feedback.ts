import { FeedbackColor } from "./types";

export const getFeedbackColor = (color?: FeedbackColor): FeedbackColor => {
  return color ?? "default";
};

export const getFeedback = (guess: string, target: string): FeedbackColor[] => {
  const feedback: FeedbackColor[] = Array(6).fill("accent");
  const targetChars = target.split("");
  const guessChars = guess.split("");

  // First pass: mark correct positions
  for (let i = 0; i < 6; i++) {
    if (guessChars[i] === targetChars[i]) {
      feedback[i] = "success";
      targetChars[i] = "";
      guessChars[i] = "";
    }
  }

  // Second pass: mark correct characters in wrong positions
  for (let i = 0; i < 6; i++) {
    if (guessChars[i] !== "") {
      const index = targetChars.indexOf(guessChars[i]);
      if (index !== -1) {
        feedback[i] = "warning";
        targetChars[index] = "";
      }
    }
  }

  return feedback;
};
