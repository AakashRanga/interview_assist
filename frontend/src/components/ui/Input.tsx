import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-[10px] font-medium text-secondary/70 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      }
      <input
        className={`w-full px-3.5 py-2.5 bg-white/70 backdrop-blur-xl border border-white/60 rounded-xl text-xs text-secondary placeholder:text-neutral/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all ${className}`}
        {...props} />
      
      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
    </div>);

}