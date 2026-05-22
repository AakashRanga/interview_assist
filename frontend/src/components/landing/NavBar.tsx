import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { VirtusaLogo } from '../ui/VirtusaLogo';
export function NavBar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <motion.nav
      initial={{
        y: -16,
        opacity: 0
      }}
      animate={{
        y: 0,
        opacity: 1
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? 'bg-[#1e2345]/95 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
      
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - left */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5">
            
            <VirtusaLogo className="w-8 h-8" />
            <span className="text-2xl font-bold text-[#02f576] tracking-tight lowercase">
              virtusa
            </span>
          </button>

          {/* Sign Up - right */}
          <motion.button
            whileHover={{
              scale: 1.03
            }}
            whileTap={{
              scale: 0.97
            }}
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 bg-[#02f576] text-[#1e2345] text-sm font-bold rounded-full shadow-lg shadow-[#02f576]/25 hover:bg-[#02f576]/90 transition-colors">
            
            Sign Up
          </motion.button>
        </div>
      </div>
    </motion.nav>);

}