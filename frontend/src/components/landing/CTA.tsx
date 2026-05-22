import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function CTA() {
  const navigate = useNavigate();
  return (
    <section className="relative py-32 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
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
          className="relative rounded-3xl overflow-hidden">
          
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-cyan/80" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

          <div className="relative px-8 sm:px-12 py-16 sm:py-20 text-center">
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
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight -tracking-tight">
              
              Ready to hire{' '}
              <span
                className="italic"
                style={{
                  fontFamily: 'Instrument Serif, serif'
                }}>
                
                smarter
              </span>
              ?
            </motion.h2>
            <motion.p
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
                delay: 0.2
              }}
              className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
              
              Join hundreds of companies using Inteviu to streamline their
              recruitment process. Start your 14-day free trial today.
            </motion.p>
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
              transition={{
                delay: 0.3
              }}
              className="flex flex-wrap gap-4 justify-center">
              
              <motion.button
                whileHover={{
                  scale: 1.03
                }}
                whileTap={{
                  scale: 0.97
                }}
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary text-base font-semibold rounded-full shadow-xl hover:bg-white/95 transition-colors">
                
                Start Free Trial
                <ArrowRightIcon className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.03
                }}
                whileTap={{
                  scale: 0.97
                }}
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-base font-semibold rounded-full hover:bg-white/15 transition-colors">
                
                Schedule Demo
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>);

}