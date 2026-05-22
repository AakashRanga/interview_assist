import React from 'react';
import { motion } from 'framer-motion';
const companies = [
'Acme Corp',
'TechStart',
'InnovateLabs',
'BuildFast',
'ScaleUp',
'DataDrive',
'CloudNine',
'NextGen',
'FutureWorks',
'SmartHire'];

export function TrustedBy() {
  return (
    <section className="relative py-16 px-5 sm:px-8 overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-xs text-[#F5EFE6]/50 uppercase tracking-widest mb-8">
          Trusted by forward-thinking companies
        </p>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#1e2345] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#1e2345] to-transparent z-10" />

          <motion.div
            animate={{
              x: ['0%', '-50%']
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="flex gap-16">
            
            {[...companies, ...companies].map((company, i) =>
            <div
              key={i}
              className="text-white/50 text-lg font-semibold whitespace-nowrap">
              
                {company}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>);

}