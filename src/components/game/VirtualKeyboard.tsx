"use client";

import { motion } from "framer-motion";
import { LetterState } from "../../types";

interface VirtualKeyboardProps {
  keyboardState: Record<string, LetterState>;
  onKeyPress: (key: string) => void;
  getKeyboardClass: (letter: string) => string;
}

export default function VirtualKeyboard({
  keyboardState: _keyboardState,
  onKeyPress,
  getKeyboardClass,
}: VirtualKeyboardProps) {
  const keyboardLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  return (
    <div className="space-y-2 px-1">
      {keyboardLayout.map((row, rowIndex) => (
        <motion.div
          key={rowIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + rowIndex * 0.1 }}
          className="flex gap-1.5 justify-center"
        >
          {row.map((key) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onKeyPress(key)}
              className={`
                py-2.5 sm:py-3 rounded-md font-medium text-xs sm:text-sm transition-all duration-200
                ${
                  key === "ENTER" || key === "BACKSPACE"
                    ? "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white flex-[2] min-w-[4rem] sm:min-w-[4.5rem]"
                    : "flex-1 max-w-[2.5rem] sm:max-w-[2.75rem]"
                }
                ${getKeyboardClass(key)}
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
