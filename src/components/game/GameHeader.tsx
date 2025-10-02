"use client";

import { motion } from "framer-motion";

interface GameHeaderProps {
  gameStatus: "playing" | "won" | "lost";
  onStatsClick: () => void;
  onShareClick: () => void;
  onPlayAgainClick: () => void;
}

export default function GameHeader({
  gameStatus,
  onStatsClick,
  onShareClick,
  onPlayAgainClick,
}: GameHeaderProps) {
  return (
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
          onClick={onStatsClick}
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors"
        >
          Stats
        </motion.button>
        {gameStatus !== "playing" && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlayAgainClick}
              className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg transition-colors"
            >
              Play Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShareClick}
              className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors"
            >
              Share
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}
