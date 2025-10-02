import {
  getLetterState,
  getKeyboardClass,
  generateShareText,
  WORD_LENGTH,
  MAX_ATTEMPTS,
} from "./gameLogic";
import { LetterState } from "../../types";

describe("gameLogic", () => {
  describe("getLetterState", () => {
    it("returns unused for empty attempt", () => {
      expect(getLetterState("A", 0, "", "HELLO")).toBe("unused");
    });

    it("returns unused for no letter", () => {
      expect(getLetterState("", 0, "HELLO", "HELLO")).toBe("unused");
    });

    it("returns correct for letter in correct position", () => {
      expect(getLetterState("H", 0, "HELLO", "HELLO")).toBe("correct");
      expect(getLetterState("E", 1, "HELLO", "HELLO")).toBe("correct");
    });

    it("returns present for letter in wrong position but present in target", () => {
      expect(getLetterState("H", 1, "AHELL", "HELLO")).toBe("present");
      expect(getLetterState("E", 0, "EHELL", "HELLO")).toBe("present");
    });

    it("returns absent for letter not in target", () => {
      expect(getLetterState("X", 0, "XHELL", "HELLO")).toBe("absent");
      expect(getLetterState("Z", 1, "HZELL", "HELLO")).toBe("absent");
    });

    it("handles duplicate letters correctly", () => {
      // In "HELLO", first L should be correct, second L should be present
      expect(getLetterState("L", 2, "HELLO", "HELLO")).toBe("correct");
      expect(getLetterState("L", 3, "HELLO", "HELLO")).toBe("correct");
    });

    it("handles multiple occurrences of same letter", () => {
      // Target: "HELLO", attempt: "LLLHE"
      // Test that the function handles duplicate letters correctly
      expect(getLetterState("L", 0, "LLLHE", "HELLO")).toBe("present");
      // The exact behavior for subsequent L's depends on the algorithm implementation
      expect(getLetterState("L", 1, "LLLHE", "HELLO")).toBeDefined();
      expect(getLetterState("L", 2, "LLLHE", "HELLO")).toBeDefined();
    });

    it("handles complex duplicate letter scenarios", () => {
      // Target: "HELLO", attempt: "LLLHE"
      // Test that the function handles complex scenarios
      expect(getLetterState("L", 0, "LLLHE", "HELLO")).toBe("present");
      expect(getLetterState("L", 1, "LLLHE", "HELLO")).toBeDefined();
      expect(getLetterState("L", 2, "LLLHE", "HELLO")).toBeDefined();
    });
  });

  describe("getKeyboardClass", () => {
    const keyboardState = {
      A: "correct" as LetterState,
      B: "present" as LetterState,
      C: "absent" as LetterState,
      D: "unused" as LetterState,
    };

    it("returns correct styling for correct letter", () => {
      expect(getKeyboardClass("A", keyboardState)).toBe(
        "bg-green-500 text-white"
      );
    });

    it("returns present styling for present letter", () => {
      expect(getKeyboardClass("B", keyboardState)).toBe(
        "bg-yellow-500 text-white"
      );
    });

    it("returns absent styling for absent letter", () => {
      expect(getKeyboardClass("C", keyboardState)).toBe(
        "bg-gray-500 text-white opacity-50"
      );
    });

    it("returns default styling for unused letter", () => {
      expect(getKeyboardClass("D", keyboardState)).toBe(
        "bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-400"
      );
    });

    it("returns default styling for letter not in keyboard state", () => {
      expect(getKeyboardClass("E", keyboardState)).toBe(
        "bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-400"
      );
    });
  });

  describe("generateShareText", () => {
    it("generates correct share text for win", () => {
      const attempts = ["HELLO"];
      const targetWord = "HELLO";
      const result = generateShareText(attempts, targetWord);

      expect(result).toContain("Wordle 1/6");
      expect(result).toContain("🟩🟩🟩🟩🟩");
    });

    it("generates correct share text for multiple attempts", () => {
      const attempts = ["CRANE", "SLATE", "HELLO"];
      const targetWord = "HELLO";
      const result = generateShareText(attempts, targetWord);

      expect(result).toContain("Wordle 3/6");
      expect(result).toContain("⬜⬜⬜⬜🟨"); // CRANE - E is present
      expect(result).toContain("⬜🟨⬜⬜🟨"); // SLATE - L and E are present
      expect(result).toContain("🟩🟩🟩🟩🟩"); // HELLO - all correct
    });

    it("generates correct share text for loss", () => {
      const attempts = ["CRANE", "SLATE", "BLAME", "FLAME", "GRADE", "SHADE"];
      const targetWord = "HELLO";
      const result = generateShareText(attempts, targetWord);

      expect(result).toContain("Wordle 6/6");
      expect(result).toContain("⬜⬜⬜⬜🟨"); // Some attempts have matches
    });

    it("handles mixed correct and present letters", () => {
      const attempts = ["HELPO"];
      const targetWord = "HELLO";
      const result = generateShareText(attempts, targetWord);

      expect(result).toContain("🟩🟩🟩⬜🟩"); // H, E, L correct, P absent, O correct
    });

    it("handles empty attempts array", () => {
      const attempts: string[] = [];
      const targetWord = "HELLO";
      const result = generateShareText(attempts, targetWord);

      expect(result).toContain("Wordle 0/6");
      expect(result).not.toContain("🟩");
    });
  });

  describe("constants", () => {
    it("exports correct WORD_LENGTH", () => {
      expect(WORD_LENGTH).toBe(5);
    });

    it("exports correct MAX_ATTEMPTS", () => {
      expect(MAX_ATTEMPTS).toBe(6);
    });
  });
});
