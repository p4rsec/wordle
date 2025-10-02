"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WORDLE_LA } from "../../data/wordle-La";
import { WORDLE_TA } from "../../data/wordle-Ta";
import { GameState, LetterState } from "../../types";
import {
  getLetterState,
  getKeyboardClass,
  generateShareText,
  WORD_LENGTH,
  MAX_ATTEMPTS,
} from "./gameLogic";
import GameHeader from "./GameHeader";
import GameGrid from "./GameGrid";
import VirtualKeyboard from "./VirtualKeyboard";
import GameStatus from "./GameStatus";
import StatsModal from "./StatsModal";
import ShareNotification from "./ShareNotification";

const VALID_WORDS = WORDLE_LA.concat(WORDLE_TA);

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
      targetWord:
        WORDLE_LA[Math.floor(Math.random() * WORDLE_LA.length)].toUpperCase(),
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
  const [flipRow, setFlipRow] = useState<number | null>(null);

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

    // Check if the word is valid (exists in the word list)
    const isValidWord = VALID_WORDS.includes(
      gameState.currentAttempt.toLowerCase()
    );
    if (!isValidWord) {
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

    // Trigger flip animation for the current row
    setFlipRow(gameState.attempts.length);

    setGameState((prev) => ({
      ...prev,
      attempts: newAttempts,
      currentAttempt: "",
      gameStatus: isWon ? "won" : isLost ? "lost" : "playing",
      keyboardState: newKeyboardState,
    }));

    // Reset flip animation after animation completes
    setTimeout(() => setFlipRow(null), 1000);
  }, [gameState, updateStats]);

  const resetGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      targetWord:
        WORDLE_LA[Math.floor(Math.random() * WORDLE_LA.length)].toUpperCase(),
      attempts: [],
      currentAttempt: "",
      gameStatus: "playing",
      keyboardState: {},
    }));
    setShowStats(false);
    setShowShare(false);
    setFlipRow(null);
  }, []);

  const shareResult = useCallback(() => {
    const shareText = generateShareText(
      gameState.attempts,
      gameState.targetWord
    );

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

  const handleGetLetterState = (
    letter: string,
    index: number,
    attempt: string
  ): LetterState => {
    return getLetterState(letter, index, attempt, gameState.targetWord);
  };

  const handleGetKeyboardClass = (letter: string): string => {
    return getKeyboardClass(letter, gameState.keyboardState);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <GameHeader
          gameStatus={gameState.gameStatus}
          onStatsClick={() => setShowStats(!showStats)}
          onShareClick={shareResult}
        />

        <AnimatePresence>
          <StatsModal
            show={showStats}
            stats={gameState.stats}
            onClose={() => setShowStats(false)}
          />
        </AnimatePresence>

        <AnimatePresence>
          <ShareNotification show={showShare} />
        </AnimatePresence>

        <GameGrid
          attempts={gameState.attempts}
          currentAttempt={gameState.currentAttempt}
          targetWord={gameState.targetWord}
          flipRow={flipRow}
          shake={shake}
          getLetterState={handleGetLetterState}
        />

        <AnimatePresence>
          <GameStatus
            gameStatus={gameState.gameStatus}
            targetWord={gameState.targetWord}
            onPlayAgain={resetGame}
          />
        </AnimatePresence>

        <VirtualKeyboard
          keyboardState={gameState.keyboardState}
          onKeyPress={(key) => {
            if (key === "ENTER") submitAttempt();
            else if (key === "BACKSPACE") removeLetter();
            else addLetter(key);
          }}
          getKeyboardClass={handleGetKeyboardClass}
        />

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
