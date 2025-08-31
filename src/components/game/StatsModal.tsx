"use client";

import { motion } from "framer-motion";

import { GameStats } from "../../types";

interface StatsModalProps {
  show: boolean;
  stats: GameStats;
  onClose: () => void;
}

export default function StatsModal({ show, stats, onClose }: StatsModalProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
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
              {stats.gamesPlayed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Played
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.gamesPlayed > 0
                ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
                : 0}
              %
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Win Rate
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Current Streak
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.maxStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Max Streak
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
