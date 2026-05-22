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
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-secondary/20 backdrop-blur-sm z-50" />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
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
            className={`w-full ${sizes[size]} bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl sm:rounded-3xl shadow-glass-lg overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col`}>

              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="flex-shrink-0">

                {title &&
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/60">
                    <h3 className="text-lg sm:text-xl font-semibold text-secondary">
                      {title}
                    </h3>
                    <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 hover:bg-white/50 rounded-lg sm:rounded-xl transition-colors">

                      <XIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                    </button>
                  </div>
  }
              </motion.div>

              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}