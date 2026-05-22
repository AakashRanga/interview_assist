import React from 'react';
import { motion } from 'framer-motion';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-glass',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-glass',
    outline:
    'bg-white/70 backdrop-blur-xl border border-white/60 text-secondary hover:bg-white/90',
    ghost: 'bg-transparent text-secondary hover:bg-white/50'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-xs rounded-xl',
    lg: 'px-6 py-3 text-sm rounded-2xl'
  };
  return (
    <motion.button
      whileHover={{
        scale: 1.02
      }}
      whileTap={{
        scale: 0.98
      }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}>
      
      {children}
    </motion.button>);

}