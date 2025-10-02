"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export default function Toast({
  show,
  message,
  onClose: _onClose,
}: ToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg shadow-lg font-semibold text-lg">
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
