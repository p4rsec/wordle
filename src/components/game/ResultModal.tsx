"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

interface ResultModalProps {
  show: boolean;
  gameStatus: "won" | "lost" | "playing";
  targetWord: string;
  attempts: string[];
  onPlayAgain: () => void;
  onClose: () => void;
}

export default function ResultModal({
  show,
  gameStatus,
  targetWord,
  attempts,
  onPlayAgain,
  onClose,
}: ResultModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  useEffect(() => {
    if (show && gameStatus === "won") {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [show, gameStatus]);

  if (!show) return null;

  const isWon = gameStatus === "won";
  const isLost = gameStatus === "lost";

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.3}
          run={showConfetti}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              {/* Header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                {isWon ? (
                  <div className="text-6xl mb-4">🎉</div>
                ) : isLost ? (
                  <div className="text-6xl mb-4">😔</div>
                ) : null}

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {isWon
                    ? "Congratulations!"
                    : isLost
                    ? "Better luck next time!"
                    : ""}
                </h2>

                <p className="text-gray-600 dark:text-gray-300">
                  {isWon
                    ? `You solved it in ${attempts.length} ${
                        attempts.length === 1 ? "guess" : "guesses"
                      }!`
                    : isLost
                    ? `The word was: ${targetWord}`
                    : ""}
                </p>
              </motion.div>

              {/* Game Statistics */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Attempts
                    </div>
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                      {attempts.length}
                    </div>
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      isWon
                        ? "bg-green-100 dark:bg-green-900"
                        : "bg-red-100 dark:bg-red-900"
                    }`}
                  >
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Status
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        isWon
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {isWon ? "Won" : "Lost"}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-3 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onPlayAgain}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Play Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Close
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
