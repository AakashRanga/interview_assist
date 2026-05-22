import React from 'react';
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}
export function Badge({
  children,
  variant = 'primary',
  size = 'sm'
}: BadgeProps) {
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-green-500/10 text-green-600 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-600 border-red-500/20',
    info: 'bg-cyan/10 text-cyan border-cyan/20',
    neutral: 'bg-neutral/10 text-neutral border-neutral/20'
  };
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${variants[variant]} ${sizes[size]}`}>
      
      {children}
    </span>);

}