import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckIcon,
  UsersIcon,
  CalendarIcon,
  BrainCircuitIcon } from
'lucide-react';
const features = [
{
  eyebrow: 'Smart Screening',
  title:
  <>
        Automated{' '}
        <span
      className="italic text-[#EFE7DA]"
      style={{
        fontFamily: 'Instrument Serif, serif'
      }}>
      
          candidate
        </span>{' '}
        pipeline
      </>,

  description:
  'Instantly screen resumes, rank candidates by fit, and organize them into a visual pipeline — saving you hours of manual review.',
  checks: [
  'Automated resume parsing & scoring',
  'Smart candidate ranking by role fit',
  'Visual kanban pipeline management'],

  mockType: 'pipeline'
},
{
  eyebrow: 'Zero Friction',
  title:
  <>
        <span
      className="italic text-[#EFE7DA]"
      style={{
        fontFamily: 'Instrument Serif, serif'
      }}>
      
          Intelligent
        </span>{' '}
        interview scheduling
      </>,

  description:
  'No more endless email chains. Our system finds optimal time slots across all participants and auto-books interviews in seconds.',
  checks: [
  'Calendar sync across all platforms',
  'Automatic conflict resolution',
  'One-click rescheduling & reminders'],

  mockType: 'calendar'
},
{
  eyebrow: 'Dynamic Panels',
  title:
  <>
        Smart panel{' '}
        <span
      className="italic text-[#EFE7DA]"
      style={{
        fontFamily: 'Instrument Serif, serif'
      }}>
      
          allocation
        </span>{' '}
        & balancing
      </>,

  description:
  'Automatically distribute candidates across interview panels based on expertise, availability, and workload — ensuring fair and efficient evaluations.',
  checks: [
  'Smart panel member matching',
  'Real-time workload balancing',
  'Expertise-based assignment'],

  mockType: 'allocation'
}];

function PipelineMock() {
  return (
    <div className="bg-[#EFE7DA] rounded-2xl p-6 shadow-2xl">
      <div className="flex gap-4">
        {['Applied', 'Screening', 'Interview', 'Offer'].map((stage, i) =>
        <div key={stage} className="flex-1">
            <div className="text-xs font-semibold text-[#1A1622]/70 mb-3 uppercase tracking-wide">
              {stage}
            </div>
            <div className="space-y-2">
              {[...Array(i === 0 ? 3 : i === 1 ? 2 : 1)].map((_, j) =>
            <motion.div
              key={j}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: i * 0.1 + j * 0.05
              }}
              className="bg-white rounded-lg p-3 shadow-sm border border-[#1A1622]/5">
              
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-primary/20" />
                    <div className="text-xs font-semibold text-[#1A1622]">
                      Candidate {i * 3 + j + 1}
                    </div>
                  </div>
                  <div className="text-[10px] text-[#1A1622]/60">
                    Score: {95 - i * 5 - j * 2}%
                  </div>
                </motion.div>
            )}
            </div>
          </div>
        )}
      </div>
    </div>);

}
function CalendarMock() {
  return (
    <div className="bg-[#EFE7DA] rounded-2xl p-6 shadow-2xl">
      <div className="text-sm font-semibold text-[#1A1622] mb-4">
        Available Slots - This Week
      </div>
      <div className="grid grid-cols-5 gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) =>
        <div key={day}>
            <div className="text-[10px] text-[#1A1622]/60 mb-2 text-center">
              {day}
            </div>
            <div className="space-y-1.5">
              {[...Array(4)].map((_, j) =>
            <motion.div
              key={j}
              initial={{
                opacity: 0,
                scale: 0.9
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              transition={{
                delay: i * 0.05 + j * 0.03
              }}
              className={`text-[10px] py-2 rounded-lg text-center ${i === 2 && j === 1 ? 'bg-primary text-white font-semibold' : 'bg-white border border-[#1A1622]/10 text-[#1A1622]/70'}`}>
              
                  {9 + j * 2}:00
                </motion.div>
            )}
            </div>
          </div>
        )}
      </div>
    </div>);

}
function AllocationMock() {
  return (
    <div className="bg-[#EFE7DA] rounded-2xl p-6 shadow-2xl">
      <div className="text-sm font-semibold text-[#1A1622] mb-4">
        Panel Allocation
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          {[...Array(4)].map((_, i) =>
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: -10
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              delay: i * 0.1
            }}
            className="flex items-center gap-2">
            
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <UsersIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#1A1622]">
                  Panel {String.fromCharCode(65 + i)}
                </div>
                <div className="text-[10px] text-[#1A1622]/60">4 members</div>
              </div>
            </motion.div>
          )}
        </div>
        <svg width="120" height="120" className="opacity-30">
          {[...Array(4)].map((_, i) =>
          <motion.line
            key={i}
            initial={{
              pathLength: 0
            }}
            animate={{
              pathLength: 1
            }}
            transition={{
              delay: 0.3 + i * 0.1,
              duration: 0.5
            }}
            x1="0"
            y1={15 + i * 25}
            x2="120"
            y2="60"
            stroke="#7C3AED"
            strokeWidth="2" />

          )}
        </svg>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) =>
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: 10
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              delay: 0.5 + i * 0.05
            }}
            className="w-7 h-7 rounded-full bg-white border border-[#1A1622]/10" />

          )}
        </div>
      </div>
    </div>);

}
export function FeatureRows() {
  return (
    <section id="features" className="relative py-32 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-32">
        {features.map((feature, index) =>
        <div
          key={index}
          className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
          
            <motion.div
            initial={{
              opacity: 0,
              x: index % 2 === 0 ? -20 : 20
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.6
            }}
            className={index % 2 === 1 ? 'lg:order-2' : ''}>
            
              <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-6">
                <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                  {feature.eyebrow}
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#F5EFE6] mb-6 leading-tight -tracking-tight">
                {feature.title}
              </h2>
              <p className="text-base text-[#F5EFE6]/60 mb-8 leading-relaxed">
                {feature.description}
              </p>
              <ul className="space-y-3">
                {feature.checks.map((check, i) =>
              <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckIcon className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-[#F5EFE6]/80">{check}</span>
                  </li>
              )}
              </ul>
            </motion.div>

            <motion.div
            initial={{
              opacity: 0,
              x: index % 2 === 0 ? 20 : -20
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.6,
              delay: 0.2
            }}
            className={index % 2 === 1 ? 'lg:order-1' : ''}>
            
              {feature.mockType === 'pipeline' && <PipelineMock />}
              {feature.mockType === 'calendar' && <CalendarMock />}
              {feature.mockType === 'allocation' && <AllocationMock />}
            </motion.div>
          </div>
        )}
      </div>
    </section>);

}