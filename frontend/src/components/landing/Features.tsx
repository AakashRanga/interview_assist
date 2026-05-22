import React from 'react';
import { motion } from 'framer-motion';
import {
  BotIcon,
  CalendarClockIcon,
  UsersIcon,
  BarChart3Icon,
  BellIcon,
  ShieldCheckIcon } from
'lucide-react';
const features = [
{
  icon: BotIcon,
  title: 'AI-powered scheduling',
  description:
  'Intelligent algorithms find the best slots and match panels automatically.'
},
{
  icon: CalendarClockIcon,
  title: 'Calendar sync',
  description:
  'Two-way Google & Outlook calendar sync with conflict detection.'
},
{
  icon: UsersIcon,
  title: 'Dynamic panels',
  description: 'Create unlimited panels and balance load across categories.'
},
{
  icon: BarChart3Icon,
  title: 'Real-time analytics',
  description: 'Pipeline funnel, time-to-hire and panel performance metrics.'
},
{
  icon: BellIcon,
  title: 'Smart notifications',
  description: 'Reminders for candidates and panels keep everyone in sync.'
},
{
  icon: ShieldCheckIcon,
  title: 'Enterprise security',
  description: 'SOC 2 compliance, SSO and granular role-based permissions.'
}];

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{
            opacity: 0,
            y: 16
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          className="text-center mb-12">
          
          <div className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-2">
            Features
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-3 tracking-tight">
            Everything you need to scale hiring
          </h2>
          <p className="text-sm text-secondary/70 max-w-xl mx-auto">
            A complete platform built for modern recruitment teams
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {features.map((feature, index) =>
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              y: 16
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: index * 0.05
            }}
            whileHover={{
              y: -3
            }}>
            
              <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl shadow-glass p-5 h-full">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-secondary mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-xs text-secondary/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}