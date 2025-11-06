import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/cdb9893bb0a895cc5f8c245820867dd1cfc47d3b.png';

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
      className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow p-3 group"
    >
      <ImageWithFallback
        src={logoImage}
        alt="Copenhagen Real Estate - Tilbage til forsiden"
        className="w-full h-full object-contain group-hover:rotate-12 transition-transform"
      />
    </motion.button>
  );
}