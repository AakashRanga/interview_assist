import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from 'lucide-react';
const testimonials = [
{
  quote:
  'Inteviu cut our time-to-hire by 60%. The AI screening is incredibly accurate and the scheduling automation is a game-changer.',
  author: 'Sarah Chen',
  role: 'Head of Talent',
  company: 'TechStart Inc',
  avatar: 10
},
{
  quote:
  'Managing 50+ interviews a week used to be chaos. Now everything runs smoothly with zero manual coordination. Absolute lifesaver.',
  author: 'Michael Rodriguez',
  role: 'Recruitment Lead',
  company: 'ScaleUp Labs',
  avatar: 15
},
{
  quote:
  'The panel allocation feature ensures fair distribution and our interviewers love how organized everything is. Best investment we made.',
  author: 'Emily Watson',
  role: 'VP People Ops',
  company: 'InnovateCo',
  avatar: 20
}];

export function Testimonials() {
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
              Testimonials
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
            
            Loved by{' '}
            <span
              className="italic text-[#EFE7DA]"
              style={{
                fontFamily: 'Instrument Serif, serif'
              }}>
              
              recruiters
            </span>{' '}
            worldwide
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) =>
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
              delay: i * 0.1
            }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) =>
              <StarIcon
                key={j}
                className="w-4 h-4 fill-primary text-primary" />

              )}
              </div>
              <p className="text-[#F5EFE6]/80 text-sm leading-relaxed mb-8">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.avatar}`}
                alt={testimonial.author}
                className="w-12 h-12 rounded-full bg-white/10" />
              
                <div>
                  <div className="text-sm font-semibold text-[#F5EFE6]">
                    {testimonial.author}
                  </div>
                  <div className="text-xs text-[#F5EFE6]/60">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}