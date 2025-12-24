import confetti from "canvas-confetti";

export const getDifficultyBadgeClass = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};

// normalize output for comparison
export const normalizeOutput = (output) => {
  // normalize output for comparison (trim whitespace, handle different spacing)
  return output
    .trim()
    .split("\n")
    .map((line) =>
      line
        .trim()
        // remove spaces after [ and before ]
        .replace(/\[\s+/g, "[")
        .replace(/\s+\]/g, "]")
        // normalize spaces around commas to single space after comma
        .replace(/\s*,\s*/g, ",")
    )
    .filter((line) => line.length > 0)
    .join("\n");
};

// trigger confetti animation
export const triggerConfetti = () => {
  confetti({
    particleCount: 80,
    spread: 250,
    origin: { x: 0.2, y: 0.6 },
  });

  confetti({
    particleCount: 80,
    spread: 250,
    origin: { x: 0.8, y: 0.6 },
  });
};
