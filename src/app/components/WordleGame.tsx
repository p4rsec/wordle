"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FIVE_LETTER_WORDS } from "../data/words";

// Use only 5-letter words
const WORDS = FIVE_LETTER_WORDS;

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

type LetterState = "correct" | "present" | "absent" | "unused";

interface GameState {
  targetWord: string;
  attempts: string[];
  currentAttempt: string;
  gameStatus: "playing" | "won" | "lost";
  keyboardState: Record<string, LetterState>;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: Record<number, number>;
  };
}

export default function WordleGame() {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Load from localStorage or create new game
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wordle-game");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if it's the same day
        const today = new Date().toDateString();
        if (parsed.date === today) {
          return parsed.state;
        }
      }
    }

    return {
      targetWord: WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase(),
      attempts: [],
      currentAttempt: "",
      gameStatus: "playing",
      keyboardState: {},
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: {},
      },
    };
  });

  const [showStats, setShowStats] = useState(false);
  const [shake, setShake] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Save game state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saveData = {
        state: gameState,
        date: new Date().toDateString(),
      };
      localStorage.setItem("wordle-game", JSON.stringify(saveData));
    }
  }, [gameState]);

  const addLetter = useCallback(
    (letter: string) => {
      if (gameState.gameStatus !== "playing") return;
      if (gameState.currentAttempt.length < WORD_LENGTH) {
        setGameState((prev) => ({
          ...prev,
          currentAttempt: prev.currentAttempt + letter,
        }));
      }
    },
    [gameState.gameStatus, gameState.currentAttempt.length]
  );

  const removeLetter = useCallback(() => {
    if (gameState.gameStatus !== "playing") return;
    setGameState((prev) => ({
      ...prev,
      currentAttempt: prev.currentAttempt.slice(0, -1),
    }));
  }, [gameState.gameStatus]);

  const updateStats = useCallback((won: boolean, attempts: number) => {
    setGameState((prev) => {
      const newStats = { ...prev.stats };
      newStats.gamesPlayed += 1;

      if (won) {
        newStats.gamesWon += 1;
        newStats.currentStreak += 1;
        newStats.maxStreak = Math.max(
          newStats.maxStreak,
          newStats.currentStreak
        );
        newStats.guessDistribution[attempts] =
          (newStats.guessDistribution[attempts] || 0) + 1;
      } else {
        newStats.currentStreak = 0;
      }

      return {
        ...prev,
        stats: newStats,
      };
    });
  }, []);

  const submitAttempt = useCallback(() => {
    if (gameState.gameStatus !== "playing") return;
    if (gameState.currentAttempt.length !== WORD_LENGTH) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const newAttempts = [...gameState.attempts, gameState.currentAttempt];
    const newKeyboardState = { ...gameState.keyboardState };

    // Update keyboard state
    gameState.currentAttempt.split("").forEach((letter, index) => {
      const targetLetter = gameState.targetWord[index];
      if (letter === targetLetter) {
        newKeyboardState[letter] = "correct";
      } else if (gameState.targetWord.includes(letter)) {
        if (newKeyboardState[letter] !== "correct") {
          newKeyboardState[letter] = "present";
        }
      } else {
        newKeyboardState[letter] = "absent";
      }
    });

    const isWon = gameState.currentAttempt === gameState.targetWord;
    const isLost = newAttempts.length >= MAX_ATTEMPTS && !isWon;

    if (isWon || isLost) {
      updateStats(isWon, newAttempts.length);
    }

    setGameState((prev) => ({
      ...prev,
      attempts: newAttempts,
      currentAttempt: "",
      gameStatus: isWon ? "won" : isLost ? "lost" : "playing",
      keyboardState: newKeyboardState,
    }));
  }, [gameState, updateStats]);

  const resetGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      targetWord: WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase(),
      attempts: [],
      currentAttempt: "",
      gameStatus: "playing",
      keyboardState: {},
    }));
    setShowStats(false);
    setShowShare(false);
  }, []);

  const shareResult = useCallback(() => {
    const result = gameState.attempts
      .map((attempt) => {
        return attempt
          .split("")
          .map((letter, index) => {
            if (letter === gameState.targetWord[index]) return "🟩";
            if (gameState.targetWord.includes(letter)) return "🟨";
            return "⬜";
          })
          .join("");
      })
      .join("\n");

    const shareText = `Wordle ${gameState.attempts.length}/${MAX_ATTEMPTS}\n\n${result}`;

    if (navigator.share) {
      navigator.share({
        title: "Wordle Result",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      setShowShare(true);
      setTimeout(() => setShowShare(false), 2000);
    }
  }, [gameState.attempts, gameState.targetWord]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        submitAttempt();
      } else if (e.key === "Backspace") {
        removeLetter();
      } else if (/^[A-Za-z]$/.test(e.key)) {
        addLetter(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addLetter, removeLetter, submitAttempt]);

  const getLetterState = (
    letter: string,
    index: number,
    attempt: string
  ): LetterState => {
    // If no attempt or no letter, return unused
    if (!attempt || !letter) return "unused";

    // If letter is in correct position, it's correct
    if (letter === gameState.targetWord[index]) return "correct";

    // Count how many times this letter appears in the target word
    const targetLetterCount = gameState.targetWord
      .split("")
      .filter((l) => l === letter).length;

    // Count how many times this letter appears in correct positions in the attempt
    const correctPositions = attempt
      .split("")
      .filter((l, i) => l === letter && l === gameState.targetWord[i]).length;

    // Count how many times this letter appears before the current position in the attempt
    const previousOccurrences = attempt
      .slice(0, index)
      .split("")
      .filter((l) => l === letter).length;

    // Count how many times this letter appears in correct positions before the current position
    const previousCorrect = attempt
      .slice(0, index)
      .split("")
      .filter((l, i) => l === letter && l === gameState.targetWord[i]).length;

    // Available letters for yellow highlighting = total in target - correct positions
    const availableForYellow = targetLetterCount - correctPositions;

    // If we haven't exceeded the available letters for yellow highlighting
    if (
      previousOccurrences - previousCorrect < availableForYellow &&
      gameState.targetWord.includes(letter)
    ) {
      return "present";
    }

    return "absent";
  };

  const getKeyboardClass = (letter: string) => {
    const state = gameState.keyboardState[letter];
    switch (state) {
      case "correct":
        return "bg-green-500 text-white";
      case "present":
        return "bg-yellow-500 text-white";
      case "absent":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Wordle
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Guess the 5-letter word
          </p>
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStats(!showStats)}
              className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors"
            >
              Stats
            </motion.button>
            {gameState.gameStatus !== "playing" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareResult}
                className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors"
              >
                Share
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Stats Modal */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowStats(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">
                  Statistics
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {gameState.stats.gamesPlayed}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Played
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {gameState.stats.gamesPlayed > 0
                        ? Math.round(
                            (gameState.stats.gamesWon /
                              gameState.stats.gamesPlayed) *
                              100
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Win Rate
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {gameState.stats.currentStreak}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Current Streak
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {gameState.stats.maxStreak}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Max Streak
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowStats(false)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share Notification */}
        <AnimatePresence>
          {showShare && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg z-50"
            >
              Result copied to clipboard!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Grid */}
        <div className="mb-8">
          {Array.from({ length: MAX_ATTEMPTS }, (_, rowIndex) => (
            <motion.div
              key={rowIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rowIndex * 0.1 }}
              className={`flex gap-2 mb-2 ${
                shake && rowIndex === gameState.attempts.length
                  ? "animate-shake"
                  : ""
              }`}
            >
              {Array.from({ length: WORD_LENGTH }, (_, colIndex) => {
                const isCurrentRow = rowIndex === gameState.attempts.length;
                const letter = isCurrentRow
                  ? gameState.currentAttempt[colIndex]
                  : gameState.attempts[rowIndex]?.[colIndex];
                const state = isCurrentRow
                  ? "unused"
                  : getLetterState(
                      letter,
                      colIndex,
                      gameState.attempts[rowIndex]
                    );

                return (
                  <motion.div
                    key={colIndex}
                    className={`
                      w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-bold
                      ${
                        letter
                          ? "border-gray-400"
                          : "border-gray-300 dark:border-gray-600"
                      }
                      ${
                        state === "correct"
                          ? "bg-green-500 border-green-500 text-white"
                          : ""
                      }
                      ${
                        state === "present"
                          ? "bg-yellow-500 border-yellow-500 text-white"
                          : ""
                      }
                      ${
                        state === "absent"
                          ? "bg-gray-500 border-gray-500 text-white"
                          : ""
                      }
                      ${
                        state === "unused"
                          ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          : ""
                      }
                    `}
                    initial={letter ? { scale: 0.8, rotateY: 0 } : false}
                    animate={letter ? { scale: 1, rotateY: 360 } : false}
                    transition={{ duration: 0.3, delay: colIndex * 0.1 }}
                  >
                    {letter}
                  </motion.div>
                );
              })}
            </motion.div>
          ))}
        </div>

        {/* Game Status */}
        <AnimatePresence>
          {gameState.gameStatus !== "playing" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center mb-6"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className={`text-xl font-bold mb-2 ${
                  gameState.gameStatus === "won"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {gameState.gameStatus === "won"
                  ? "🎉 You Won!"
                  : "😔 Game Over"}
              </motion.div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The word was:{" "}
                <span className="font-bold">{gameState.targetWord}</span>
              </p>
              <div className="flex gap-2 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Play Again
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Virtual Keyboard */}
        <div className="space-y-2">
          {[
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
            ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
          ].map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + rowIndex * 0.1 }}
              className="flex gap-1 justify-center"
            >
              {row.map((key) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (key === "ENTER") submitAttempt();
                    else if (key === "BACKSPACE") removeLetter();
                    else addLetter(key);
                  }}
                  className={`
                    px-3 py-4 rounded-lg font-medium text-sm transition-all duration-200
                    ${
                      key === "ENTER" || key === "BACKSPACE"
                        ? "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white"
                        : getKeyboardClass(key)
                    }
                    ${
                      key === "ENTER" || key === "BACKSPACE"
                        ? "min-w-[60px]"
                        : "min-w-[40px]"
                    }
                  `}
                >
                  {key === "BACKSPACE" ? "⌫" : key}
                </motion.button>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>Press Enter to submit, Backspace to delete</p>
          <p className="mt-1">
            Green = correct position, Yellow = wrong position
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
