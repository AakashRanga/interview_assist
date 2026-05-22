import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
const faqs = [
{
  question: 'How does the AI screening work?',
  answer:
  'Our AI analyzes resumes against your job requirements, scoring candidates on skills, experience, and cultural fit. It uses natural language processing to understand context and ranks candidates automatically.'
},
{
  question: 'Can I integrate with my existing ATS?',
  answer:
  'Yes! Inteviu integrates seamlessly with popular ATS platforms like Greenhouse, Lever, and Workday. We also offer a REST API for custom integrations.'
},
{
  question: 'How does automatic scheduling handle conflicts?',
  answer:
  'The system syncs with all participants calendars, identifies available time slots, and automatically resolves conflicts. If no common slot exists, it suggests the best alternatives.'
},
{
  question: 'Is my candidate data secure?',
  answer:
  'Absolutely. We use bank-level encryption (AES-256), are SOC 2 Type II certified, and fully GDPR compliant. Your data is stored in secure, geo-redundant data centers.'
},
{
  question: 'Can I customize the interview workflow?',
  answer:
  'Yes! You can create custom workflows, define panel structures, set evaluation criteria, and configure automated actions at each stage of your hiring process.'
},
{
  question: 'What kind of support do you offer?',
  answer:
  'All plans include email support. Growth plans get priority support with faster response times. Enterprise customers receive a dedicated account manager and 24/7 phone support.'
}];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="relative py-32 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto">
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
              FAQ
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
            
            Frequently asked{' '}
            <span
              className="italic text-[#EFE7DA]"
              style={{
                fontFamily: 'Instrument Serif, serif'
              }}>
              
              questions
            </span>
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) =>
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
              delay: i * 0.05
            }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            
              <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors">
              
                <span className="text-base font-semibold text-[#F5EFE6] pr-4">
                  {faq.question}
                </span>
                <motion.div
                animate={{
                  rotate: openIndex === i ? 180 : 0
                }}
                transition={{
                  duration: 0.2
                }}>
                
                  <ChevronDownIcon className="w-5 h-5 text-[#F5EFE6]/60 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i &&
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0
                }}
                animate={{
                  height: 'auto',
                  opacity: 1
                }}
                exit={{
                  height: 0,
                  opacity: 0
                }}
                transition={{
                  duration: 0.2
                }}
                className="overflow-hidden">
                
                    <div className="px-6 pb-5 text-sm text-[#F5EFE6]/70 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
              }
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}