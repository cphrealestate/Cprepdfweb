import { motion } from 'motion/react';

interface LogoButtonProps {
  onClick: () => void;
}

export function LogoButton({ onClick }: LogoButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center group"
      aria-label="Copenhagen Real Estate - Tilbage til forsiden"
    >
      {/* Copenhagen Real Estate Logo - Simple Monogram */}
      <svg
        viewBox="0 0 100 100"
        className="w-10 h-10 group-hover:rotate-12 transition-transform"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* C */}
        <path
          d="M 35 25 Q 20 25 20 40 L 20 60 Q 20 75 35 75"
          stroke="#767A57"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        {/* R */}
        <path
          d="M 50 75 L 50 25 L 70 25 Q 80 25 80 35 Q 80 45 70 45 L 50 45 M 65 45 L 80 75"
          stroke="#595959"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}