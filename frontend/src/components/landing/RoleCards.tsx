import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserIcon, UsersIcon, ShieldIcon, ArrowRightIcon } from 'lucide-react';
const roles = [
{
  icon: UserIcon,
  title: 'For Candidates',
  description:
  'Apply, track interviews and manage your profile in one place.',
  features: ['Profile builder', 'Auto-scheduling', 'Live status tracking']
},
{
  icon: UsersIcon,
  title: 'For Panel Members',
  description:
  'Review candidates, run interviews and submit feedback effortlessly.',
  features: ['Candidate review', 'Schedule management', 'Feedback forms']
},
{
  icon: ShieldIcon,
  title: 'For Admins',
  description:
  'Orchestrate panels, pipelines and analytics across the organisation.',
  features: ['Full control', 'Pipeline analytics', 'Panel management']
}];

export function RoleCards() {
  const navigate = useNavigate();
  return (
    <section id="roles" className="py-16 sm:py-20 px-4 sm:px-6">
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
            Built for every role
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-3 tracking-tight">
            Purpose-built experiences for everyone
          </h2>
          <p className="text-sm text-secondary/70 max-w-xl mx-auto">
            Tailored workflows for candidates, panels and admins
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          {roles.map((role, index) =>
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
              delay: index * 0.08
            }}
            whileHover={{
              y: -3
            }}>
            
              <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl shadow-glass p-6 h-full flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <role.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-secondary mb-2">
                  {role.title}
                </h3>
                <p className="text-xs text-secondary/70 mb-4 leading-relaxed">
                  {role.description}
                </p>
                <ul className="space-y-1.5 mb-5 flex-grow">
                  {role.features.map((feature, i) =>
                <li
                  key={i}
                  className="flex items-center text-xs text-secondary/70">
                  
                      <div className="w-1 h-1 rounded-full bg-primary mr-2" />
                      {feature}
                    </li>
                )}
                </ul>
                <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center gap-1 text-xs font-medium text-primary hover:gap-2 transition-all">
                
                  Explore
                  <ArrowRightIcon className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}