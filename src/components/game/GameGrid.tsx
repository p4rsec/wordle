"use client";

import { motion } from "framer-motion";
import { LetterState } from "../../types";

interface GameGridProps {
  attempts: string[];
  currentAttempt: string;
  targetWord: string;
  flipRow: number | null;
  shake: boolean;
  getLetterState: (
    letter: string,
    index: number,
    attempt: string
  ) => LetterState;
}

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

export default function GameGrid({
  attempts,
  currentAttempt,
  targetWord,
  flipRow,
  shake,
  getLetterState,
}: GameGridProps) {
  return (
    <div className="mb-8">
      {Array.from({ length: MAX_ATTEMPTS }, (_, rowIndex) => (
        <motion.div
          key={rowIndex}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: rowIndex * 0.1 }}
          className={`flex gap-2 mb-2 justify-center ${
            shake && rowIndex === attempts.length ? "animate-shake" : ""
          }`}
        >
          {Array.from({ length: WORD_LENGTH }, (_, colIndex) => {
            const isCurrentRow = rowIndex === attempts.length;
            const letter = isCurrentRow
              ? currentAttempt[colIndex]
              : attempts[rowIndex]?.[colIndex];
            const state = isCurrentRow
              ? "unused"
              : getLetterState(
                  letter,
                  colIndex,
                  attempts[rowIndex],
                  targetWord
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
                    state === "unused"
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      : ""
                  }
                `}
                initial={false}
                animate={
                  flipRow === rowIndex && !isCurrentRow
                    ? {
                        rotateX: [0, 90, 0],
                        backgroundColor: [
                          "rgb(255, 255, 255)",
                          "rgb(255, 255, 255)",
                          state === "correct"
                            ? "rgb(34, 197, 94)"
                            : state === "present"
                            ? "rgb(234, 179, 8)"
                            : "rgb(107, 114, 128)",
                        ],
                        borderColor: [
                          "rgb(156, 163, 175)",
                          "rgb(156, 163, 175)",
                          state === "correct"
                            ? "rgb(34, 197, 94)"
                            : state === "present"
                            ? "rgb(234, 179, 8)"
                            : "rgb(107, 114, 128)",
                        ],
                        color: [
                          "rgb(17, 24, 39)",
                          "rgb(17, 24, 39)",
                          "rgb(255, 255, 255)",
                        ],
                      }
                    : {
                        backgroundColor:
                          state === "correct"
                            ? "rgb(34, 197, 94)"
                            : state === "present"
                            ? "rgb(234, 179, 8)"
                            : state === "absent"
                            ? "rgb(107, 114, 128)"
                            : "rgb(255, 255, 255)",
                        borderColor:
                          state === "correct"
                            ? "rgb(34, 197, 94)"
                            : state === "present"
                            ? "rgb(234, 179, 8)"
                            : state === "absent"
                            ? "rgb(107, 114, 128)"
                            : "rgb(156, 163, 175)",
                        color:
                          state === "unused"
                            ? "rgb(17, 24, 39)"
                            : "rgb(255, 255, 255)",
                      }
                }
                transition={{
                  duration: 0.6,
                  delay: colIndex * 0.1,
                  times: [0, 0.5, 1],
                }}
              >
                {letter}
              </motion.div>
            );
          })}
        </motion.div>
      ))}
    </div>
  );
}
