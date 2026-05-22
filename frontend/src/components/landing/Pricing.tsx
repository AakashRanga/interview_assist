import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const plans = [
{
  name: 'Starter',
  price: '$49',
  period: '/month',
  description: 'Perfect for small teams getting started',
  features: [
  'Up to 50 candidates/month',
  'AI resume screening',
  'Basic scheduling automation',
  'Email support',
  '1 active panel'],

  highlighted: false
},
{
  name: 'Growth',
  price: '$149',
  period: '/month',
  description: 'For growing teams scaling their hiring',
  features: [
  'Up to 500 candidates/month',
  'Advanced AI screening & ranking',
  'Full scheduling automation',
  'Priority support',
  'Unlimited panels',
  'Analytics dashboard',
  'Custom workflows'],

  highlighted: true
},
{
  name: 'Enterprise',
  price: 'Custom',
  period: '',
  description: 'For large organizations with complex needs',
  features: [
  'Unlimited candidates',
  'White-label solution',
  'Dedicated account manager',
  'Custom integrations',
  'Advanced security & compliance',
  'SLA guarantee',
  'Training & onboarding'],

  highlighted: false
}];

export function Pricing() {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="relative py-32 px-5 sm:px-8">
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
              Pricing
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
            className="text-4xl lg:text-5xl font-bold text-[#F5EFE6] mb-6 -tracking-tight">
            
            Simple,{' '}
            <span
              className="italic text-[#EFE7DA]"
              style={{
                fontFamily: 'Instrument Serif, serif'
              }}>
              
              transparent
            </span>{' '}
            pricing
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
            className="text-base text-[#F5EFE6]/60 max-w-2xl mx-auto">
            
            Choose the plan that fits your hiring needs. All plans include a
            14-day free trial.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) =>
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
            className={`rounded-2xl p-8 ${plan.highlighted ? 'bg-[#EFE7DA] border-2 border-primary shadow-2xl scale-105' : 'bg-white/5 backdrop-blur-sm border border-white/10'}`}>
            
              {plan.highlighted &&
            <div className="inline-block px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full mb-4">
                  Most Popular
                </div>
            }
              <h3
              className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-[#1A1622]' : 'text-[#F5EFE6]'}`}>
              
                {plan.name}
              </h3>
              <p
              className={`text-sm mb-6 ${plan.highlighted ? 'text-[#1A1622]/70' : 'text-[#F5EFE6]/60'}`}>
              
                {plan.description}
              </p>
              <div className="mb-8">
                <span
                className={`text-5xl font-bold ${plan.highlighted ? 'text-[#1A1622]' : 'text-[#F5EFE6]'}`}>
                
                  {plan.price}
                </span>
                <span
                className={`text-sm ${plan.highlighted ? 'text-[#1A1622]/60' : 'text-[#F5EFE6]/60'}`}>
                
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, j) =>
              <li key={j} className="flex items-start gap-3">
                    <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.highlighted ? 'bg-primary/20' : 'bg-white/10'}`}>
                  
                      <CheckIcon
                    className={`w-3 h-3 ${plan.highlighted ? 'text-primary' : 'text-primary'}`} />
                  
                    </div>
                    <span
                  className={`text-sm ${plan.highlighted ? 'text-[#1A1622]/80' : 'text-[#F5EFE6]/80'}`}>
                  
                      {feature}
                    </span>
                  </li>
              )}
              </ul>
              <motion.button
              whileHover={{
                scale: 1.02
              }}
              whileTap={{
                scale: 0.98
              }}
              onClick={() => navigate('/login')}
              className={`w-full py-3 rounded-full font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors ${plan.highlighted ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90' : 'bg-white/10 text-[#F5EFE6] border border-white/20 hover:bg-white/15'}`}>
              
                Get Started
                <ArrowRightIcon className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}