import { motion } from 'motion/react';
import SymbolRealEstate from '../assets/Symbol-Real-estate.png';

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
      {/* Copenhagen Real Estate Logo */}
      <img
        src={SymbolRealEstate}
        alt="Copenhagen Real Estate"
        className="w-10 h-10 group-hover:scale-110 transition-transform"
      />
    </motion.button>
  );
}