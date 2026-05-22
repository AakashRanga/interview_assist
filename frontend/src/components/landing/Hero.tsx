import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRightIcon,
  SparklesIcon,
  FileTextIcon,
  CalendarIcon,
  ClockIcon } from
'lucide-react';
const applicants = [
{
  name: 'Eleanor Pena',
  role: 'OLIO Inc',
  avatar: 0
},
{
  name: 'Dianne Russell',
  role: 'Idea peel',
  avatar: 1
},
{
  name: 'Kathryn Murphy',
  role: 'octapatech',
  avatar: 2
}];

const shortlisted = [
{
  name: 'Kristin Watson',
  role: 'Frontend · Ideapeel',
  avatar: 5
},
{
  name: 'Cody Fisher',
  role: 'Backend · Template peel',
  avatar: 6
},
{
  name: 'Albert Flores',
  role: 'Full Stack · Octapatech',
  avatar: 7
}];

export function Hero() {
  const navigate = useNavigate();
  return (
    <section
      id="home"
      className="relative pt-40 pb-32 px-5 sm:px-8 overflow-hidden">
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.1
            }}
            className="lg:col-span-6">
            
            <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              transition={{
                delay: 0.2
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md">
              
              <SparklesIcon className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-white/80 tracking-wide">
                Modern Recruitment Platform
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.05] -tracking-tight">
              Hiring made{' '}
              <span
                className="italic text-white"
                style={{
                  fontFamily: 'Instrument Serif, serif'
                }}>
                
                simple
              </span>{' '}
              with{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">
                  smart scheduling
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 blur-lg" />
              </span>
            </h1>

            <p className="text-lg text-white/60 mb-10 leading-relaxed max-w-xl">
              Streamline your interview process with intelligent scheduling and
              dynamic panel allocation. Virtusa makes recruitment faster, fairer
              and more efficient.
            </p>

            <div className="mb-16" />

            <div className="grid sm:grid-cols-2 gap-6">
              {[
              {
                icon: FileTextIcon,
                title: 'One-Click Resume Review',
                desc: 'Smart candidate shortlisting'
              },
              {
                icon: CalendarIcon,
                title: 'Auto Interview Scheduling',
                desc: 'No back-and-forth, ever'
              }].
              map((f, i) =>
              <div key={i} className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">
                      {f.title}
                    </div>
                    <div className="text-xs text-white/60">{f.desc}</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right - Floating cards */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.3
            }}
            className="lg:col-span-6 relative h-[550px] flex items-center justify-center">
            
            {/* Applications card */}
            <motion.div
              animate={{
                y: [0, -10, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute left-0 sm:left-8 top-12 w-[280px] sm:w-[320px] bg-white rounded-2xl shadow-2xl p-6 z-10">
              
              <div className="text-sm font-semibold text-[#1A1622] mb-4">
                Job Application{' '}
                <span className="text-[#1A1622]/50 font-normal">(150+)</span>
              </div>
              <div className="space-y-3">
                {applicants.map((a, i) =>
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
                    delay: 0.4 + i * 0.1
                  }}
                  className="flex items-center gap-3">
                  
                    <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${a.avatar}`}
                    alt={a.name}
                    className="w-11 h-11 rounded-full bg-white flex-shrink-0" />
                  
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#1A1622] truncate">
                        {a.name}
                      </div>
                      <div className="text-xs text-[#1A1622]/60 truncate">
                        {a.role}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Center sparkle badge */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: {
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear'
                },
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }}
              className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/40">
              
              <SparklesIcon className="w-6 h-6 text-white" />
            </motion.div>

            {/* Shortlisted card */}
            <motion.div
              animate={{
                y: [0, 10, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.5
              }}
              className="absolute right-0 sm:right-8 bottom-16 w-[280px] sm:w-[320px] bg-white rounded-2xl shadow-2xl p-6 z-10">
              
              <div className="text-sm font-semibold text-[#1A1622] mb-4">
                Shortlisted{' '}
                <span className="text-[#1A1622]/50 font-normal">(08)</span>
              </div>
              <div className="space-y-3">
                {shortlisted.map((s, i) =>
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
                    delay: 0.6 + i * 0.1
                  }}
                  className="flex items-center gap-3">
                  
                    <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.avatar}`}
                    alt={s.name}
                    className="w-11 h-11 rounded-full bg-white flex-shrink-0" />
                  
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#1A1622] truncate">
                        {s.name}
                      </div>
                      <div className="text-xs text-[#1A1622]/60 truncate">
                        {s.role}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Interview Today pill */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                x: [0, 5, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5
              }}
              className="absolute top-8 right-4 sm:right-12 bg-white rounded-full px-4 py-2.5 shadow-xl z-10 flex items-center gap-2">
              
              <ClockIcon className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-[#1A1622]">
                Interview Today
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>);

}