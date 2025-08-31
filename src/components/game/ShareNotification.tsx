"use client";

import { motion } from "framer-motion";

interface ShareNotificationProps {
  show: boolean;
}

export default function ShareNotification({ show }: ShareNotificationProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg z-50"
    >
      Result copied to clipboard!
    </motion.div>
  );
}
