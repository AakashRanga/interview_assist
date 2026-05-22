import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: ModalProps) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-secondary/20 backdrop-blur-sm z-50" />
        
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            className={`w-full ${sizes[size]} bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-glass-lg overflow-hidden`}>
            
              {title &&
            <div className="flex items-center justify-between p-6 border-b border-white/60">
                  <h3 className="text-xl font-semibold text-secondary">
                    {title}
                  </h3>
                  <button
                onClick={onClose}
                className="p-2 hover:bg-white/50 rounded-xl transition-colors">
                
                    <XIcon className="w-5 h-5 text-secondary" />
                  </button>
                </div>
            }
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}