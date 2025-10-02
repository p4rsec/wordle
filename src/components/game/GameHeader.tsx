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
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        WORDLE
      </h1>
      <div className="flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStatsClick}
          className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          Stats
        </motion.button>
        {gameStatus !== "playing" && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlayAgainClick}
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Play Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShareClick}
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Share
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}
