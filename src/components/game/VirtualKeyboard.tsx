"use client";

import { motion } from "framer-motion";
import { LetterState } from "../../types";

interface VirtualKeyboardProps {
  keyboardState: Record<string, LetterState>;
  onKeyPress: (key: string) => void;
  getKeyboardClass: (letter: string) => string;
}

export default function VirtualKeyboard({
  keyboardState,
  onKeyPress,
  getKeyboardClass,
}: VirtualKeyboardProps) {
  const keyboardLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  return (
    <div className="space-y-2">
      {keyboardLayout.map((row, rowIndex) => (
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
              onClick={() => onKeyPress(key)}
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
  );
}
