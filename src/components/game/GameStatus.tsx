"use client";

import { motion } from "framer-motion";

interface GameStatusProps {
  gameStatus: "playing" | "won" | "lost";
  targetWord: string;
  onPlayAgain: () => void;
}

export default function GameStatus({
  gameStatus,
  targetWord,
  onPlayAgain,
}: GameStatusProps) {
  if (gameStatus === "playing") return null;

  return (
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
          gameStatus === "won" ? "text-green-600" : "text-red-600"
        }`}
      >
        {gameStatus === "won" ? "🎉 You Won!" : "😔 Game Over"}
      </motion.div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        The word was: <span className="font-bold">{targetWord}</span>
      </p>
      <div className="flex gap-2 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayAgain}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Play Again
        </motion.button>
      </div>
    </motion.div>
  );
}
