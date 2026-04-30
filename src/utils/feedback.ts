export type FeedbackColor = "outline" | "warning" | "success" | "default" | "destructive";

export const getFeedbackColor = (color?: FeedbackColor): FeedbackColor => {
  return color ?? "default";
};

export const computeKeyboardFeedback = (
  current: Record<string, FeedbackColor>,
  guess: string,
  feedback: FeedbackColor[]
): Record<string, FeedbackColor> => {
  const updated = { ...current };

  guess.split("").forEach((char, index) => {
    const charFeedback = feedback[index];
    const existing = updated[char];

    if (charFeedback === "success") {
      updated[char] = "success";
    } else if (charFeedback === "warning" && existing !== "success") {
      updated[char] = "warning";
    } else if (charFeedback === "destructive" && !existing) {
      updated[char] = "destructive";
    }
  });

  return updated;
};

export const getFeedback = (guess: string, target: string): FeedbackColor[] => {
  const feedback: FeedbackColor[] = Array(6).fill("outline");
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
