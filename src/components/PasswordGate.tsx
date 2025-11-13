import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Lock, AlertCircle } from 'lucide-react';
import logoImage from '../assets/Symbol-Real-estate.png';

interface PasswordGateProps {
  children: React.ReactNode;
  correctPassword?: string;
}

export function PasswordGate({ children, correctPassword = "2024" }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated
  useEffect(() => {
    const authenticated = sessionStorage.getItem('cph_authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === correctPassword) {
      sessionStorage.setItem('cph_authenticated', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Forkert adgangskode. Prøv igen.');
      setPassword('');

      // Clear error after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] via-[#e8e8dd] to-[#767A57] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#767A57] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If authenticated, show children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Show password gate
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] via-[#e8e8dd] to-[#767A57] flex items-center justify-center px-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white/95 backdrop-blur-sm border-2 border-[#767A57]/30 rounded-2xl shadow-2xl overflow-hidden">
            {/* Logo Section */}
            <div className="pt-12 pb-8 px-8 flex flex-col items-center border-b border-[#767A57]/20">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-24 h-24 mb-6 relative"
              >
                <div className="absolute inset-0 rounded-full border-2 border-[#767A57]/40 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full border border-[#767A57]/20"></div>
                <div className="absolute inset-4 flex items-center justify-center">
                  <ImageWithFallback
                    src={logoImage}
                    alt="Copenhagen Real Estate"
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h1 className="font-['Crimson_Text',serif] text-[32px] text-[#767A57] mb-2 tracking-wider uppercase">
                  Confidential Information
                </h1>
                <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] tracking-wide">
                  Restricted Access • Members Only
                </p>
              </motion.div>
            </div>

            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block font-['Albert_Sans',sans-serif] text-[12px] text-[#767A57] uppercase tracking-widest mb-3"
                  >
                    Access Code
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#f5f5f0] border-2 border-[#767A57]/30 rounded-lg px-4 py-4 font-['Albert_Sans',sans-serif] text-[16px] text-[#767A57] placeholder:text-[#767A57]/30 focus:border-[#767A57] focus:outline-none focus:ring-2 focus:ring-[#767A57]/20 transition-all"
                      autoFocus
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#767A57]/40" />
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-300 rounded-lg"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <p className="font-['Albert_Sans',sans-serif] text-[14px] text-red-600">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#767A57] to-[#8B8F64] hover:from-[#8B8F64] hover:to-[#9FA371] text-white font-['Albert_Sans',sans-serif] text-[16px] font-semibold uppercase tracking-widest py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#767A57]/30 transform hover:scale-[1.02]"
                >
                  Enter
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-[#767A57]/10 text-center">
                <p className="font-['Albert_Sans',sans-serif] text-[12px] text-[#595959] mb-2">
                  Invitation Only
                </p>
                <button
                  className="font-['Albert_Sans',sans-serif] text-[13px] text-[#767A57] hover:text-[#595959] transition-colors underline"
                  onClick={() => alert('Kontakt venligst admin@copenhagenestate.dk for adgang')}
                >
                  Request Access
                </button>
              </div>
            </motion.div>
          </div>

          {/* Bottom Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-8 font-['Albert_Sans',sans-serif] text-[12px] text-[#595959]"
          >
            © 2024 Copenhagen Real Estate Portfolio
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
