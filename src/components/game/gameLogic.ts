import { LetterState } from "../../types";

export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;

export function getLetterState(
  letter: string,
  index: number,
  attempt: string,
  targetWord: string
): LetterState {
  // If no attempt or no letter, return unused
  if (!attempt || !letter) return "unused";

  // If letter is in correct position, it's correct
  if (letter === targetWord[index]) return "correct";

  // Count how many times this letter appears in the target word
  const targetLetterCount = targetWord
    .split("")
    .filter((l) => l === letter).length;

  // Count how many times this letter appears in correct positions in the attempt
  const correctPositions = attempt
    .split("")
    .filter((l, i) => l === letter && l === targetWord[i]).length;

  // Count how many times this letter appears before the current position in the attempt
  const previousOccurrences = attempt
    .slice(0, index)
    .split("")
    .filter((l) => l === letter).length;

  // Count how many times this letter appears in correct positions before the current position
  const previousCorrect = attempt
    .slice(0, index)
    .split("")
    .filter((l, i) => l === letter && l === targetWord[i]).length;

  // Available letters for yellow highlighting = total in target - correct positions
  const availableForYellow = targetLetterCount - correctPositions;

  // If we haven't exceeded the available letters for yellow highlighting
  if (
    previousOccurrences - previousCorrect < availableForYellow &&
    targetWord.includes(letter)
  ) {
    return "present";
  }

  return "absent";
}

export function getKeyboardClass(
  letter: string,
  keyboardState: Record<string, LetterState>
): string {
  const state = keyboardState[letter];
  switch (state) {
    case "correct":
      return "bg-green-500 text-white";
    case "present":
      return "bg-yellow-500 text-white";
    case "absent":
      return "bg-gray-500 text-white opacity-50";
    default:
      return "bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-400";
  }
}

export function generateShareText(
  attempts: string[],
  targetWord: string
): string {
  const result = attempts
    .map((attempt) => {
      return attempt
        .split("")
        .map((letter, index) => {
          if (letter === targetWord[index]) return "🟩";
          if (targetWord.includes(letter)) return "🟨";
          return "⬜";
        })
        .join("");
    })
    .join("\n");

  return `Wordle ${attempts.length}/${MAX_ATTEMPTS}\n\n${result}`;
}

export function getToastMessage(attempts: number, isWon: boolean): string {
  if (!isWon) {
    return "Better luck next time!";
  }

  switch (attempts) {
    case 1:
      return "Genius!";
    case 2:
      return "Magnificent!";
    case 3:
      return "Impressive!";
    case 4:
      return "Splendid!";
    case 5:
      return "Great!";
    case 6:
      return "Phew!";
    default:
      return "Well done!";
  }
}
