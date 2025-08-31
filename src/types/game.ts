export type LetterState = "correct" | "present" | "absent" | "unused";

export interface GameState {
  targetWord: string;
  attempts: string[];
  currentAttempt: string;
  gameStatus: "playing" | "won" | "lost";
  keyboardState: Record<string, LetterState>;
  stats: GameStats;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>;
}
