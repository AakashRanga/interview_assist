import React from 'react';
import { motion } from 'framer-motion';
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}
export function GlassCard({
  children,
  className = '',
  hover = false
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={
      hover ?
      {
        scale: 1.02
      } :
      {}
      }
      className={`bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl shadow-glass ${className}`}>
      
      {children}
    </motion.div>);

}