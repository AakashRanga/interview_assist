import React from 'react';
import { motion } from 'framer-motion';
const stats = [
{
  number: '10k+',
  label: 'Candidates Screened'
},
{
  number: '95%',
  label: 'Faster Scheduling'
},
{
  number: '500+',
  label: 'Panels Allocated'
},
{
  number: '4.9★',
  label: 'Recruiter Rating'
}];

export function Stats() {
  return (
    <section className="relative py-24 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {stats.map((stat, i) =>
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
            className="text-center">
            
              <div className="text-5xl lg:text-6xl font-bold text-[#F5EFE6] mb-3 -tracking-tight">
                {stat.number}
              </div>
              <div className="text-sm text-[#F5EFE6]/60">{stat.label}</div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}