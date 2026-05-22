import React from 'react';
import { motion } from 'framer-motion';
import {
  FileTextIcon,
  BrainCircuitIcon,
  CalendarIcon,
  CheckCircleIcon } from
'lucide-react';
const steps = [
{
  number: '01',
  icon: FileTextIcon,
  title: 'Upload Job Description',
  description: 'Post your role and requirements in seconds'
},
{
  number: '02',
  icon: BrainCircuitIcon,
  title: 'Smart Resume Screening',
  description: 'Candidates are ranked by fit automatically'
},
{
  number: '03',
  icon: CalendarIcon,
  title: 'Auto-Schedule Interviews',
  description: 'System finds optimal slots and books meetings'
},
{
  number: '04',
  icon: CheckCircleIcon,
  title: 'Panel Reviews & Decision',
  description: 'Collaborative evaluation and final selection'
}];

export function Workflow() {
  return (
    <section className="relative py-32 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-6">
            
            <span className="text-xs text-primary font-semibold uppercase tracking-wider">
              How It Works
            </span>
          </motion.div>
          <motion.h2
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: 0.1
            }}
            className="text-4xl lg:text-5xl font-bold text-[#F5EFE6] -tracking-tight">
            
            Four steps to{' '}
            <span
              className="italic text-[#EFE7DA]"
              style={{
                fontFamily: 'Instrument Serif, serif'
              }}>
              
              smarter
            </span>{' '}
            hiring
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting lines */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {steps.map((step, i) =>
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: i * 0.15
            }}
            className="relative">
            
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative backdrop-blur-sm">
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/30">
                    {step.number}
                  </div>
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-[#F5EFE6] mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-[#F5EFE6]/60 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}