import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Pricing({ onPlanSelect }) {
  const { t, lang } = useLanguage();
  const [billing, setBilling] = useState('yearly'); 

  return (
    <section id="pricing" className="py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header section */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-8"
          >
            {t.pricing.title}
          </motion.h2>
          
          {/* =======================================================
              ✨ NEW IMPROVED TOGGLE (High Contrast & Clear) ✨
             ======================================================= */}
          <div className="flex justify-center">
            <div className="bg-slate-100 p-1.5 rounded-full inline-flex relative shadow-inner border border-slate-200">
              
              {/* Monthly Button */}
              <button 
                onClick={() => setBilling('monthly')}
                className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-colors duration-300 flex items-center gap-2
                  ${billing === 'monthly' ? 'text-white' : 'text-slate-500 hover:text-slate-900'}
                `}
              >
                {/* Background Animation for Monthly */}
                {billing === 'monthly' && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-0 bg-teal-600 rounded-full shadow-lg shadow-teal-600/30 -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {t.pricing.monthly}
              </button>

              {/* Yearly Button */}
              <button 
                onClick={() => setBilling('yearly')}
                className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-colors duration-300 flex items-center gap-2
                  ${billing === 'yearly' ? 'text-white' : 'text-slate-500 hover:text-slate-900'}
                `}
              >
                {/* Background Animation for Yearly */}
                {billing === 'yearly' && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-0 bg-teal-600 rounded-full shadow-lg shadow-teal-600/30 -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {t.pricing.yearly}

                {/* Discount Badge */}
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                  className={`absolute -top-3 ${lang === 'ar' ? '-left-2' : '-right-2'} bg-red-500 text-white text-[10px] px-2 py-1 rounded-full shadow-md whitespace-nowrap z-20`}
                >
                   -20%
                </motion.span>
              </button>
            </div>
          </div>
          {/* ======================================================= */}
        </div>

        {/* Pricing Cards Grid (Same as before but cleaner logic) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 xl:gap-8 items-start">
          {t.pricing.plans.map((plan, index) => {
            const isPro = plan.id === 'pro';
            const isB2B = plan.id === 'b2b';

            return (
              <motion.div 
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className={`relative bg-white rounded-3xl flex flex-col transition-all duration-300 group h-full
                  ${isPro 
                    ? 'border-2 border-teal-500 shadow-2xl shadow-teal-500/20 z-10 scale-105 lg:-mt-4 lg:mb-4 py-8 px-6' 
                    : 'border border-slate-200 shadow-xl hover:shadow-2xl hover:shadow-slate-200/50 p-6'
                  }
                `}
              >
                {isPro && (
                  <div className="absolute -top-5 inset-x-0 flex justify-center">
                    <span className="bg-gradient-to-r from-teal-500 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <Sparkles size={14} /> الباقة الموصى بها
                    </span>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className={`text-xl font-black ${isPro ? 'text-teal-700' : 'text-slate-900'}`}>{plan.name}</h3>
                  <div className="mt-4 flex items-baseline flex-wrap gap-1">
                    <span className={`text-4xl font-black ${isPro ? 'text-slate-900' : 'text-slate-800'}`}>
                      {isB2B ? plan.price : (billing === 'yearly' && plan.price !== 'مجاناً' && plan.price !== 'Free' ? plan.price.replace('49', '39').replace('19', '15') : plan.price)}
                    </span>
                    {!isB2B && plan.id !== 'free' && (
                      <span className="text-slate-500 font-medium text-sm">/{billing === 'monthly' ? (lang === 'ar' ? 'شهر' : 'mo') : (lang === 'ar' ? 'سنة' : 'yr')}</span>
                    )}
                  </div>
                  {billing === 'yearly' && !isB2B && plan.id !== 'free' && (
                    <p className="text-xs text-teal-600 font-bold mt-2 bg-teal-50 inline-block px-2 py-1 rounded-md">
                       {lang === 'ar' ? 'تدفع سنوياً (تم تطبيق الخصم)' : 'Billed yearly (Discount applied)'}
                    </p>
                  )}
                </div>

                <ul className="flex-1 space-y-4 mb-10">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 font-medium text-sm leading-relaxed">
                      <div className={`mt-0.5 p-0.5 rounded-full shrink-0 ${isPro ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-500'}`}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onPlanSelect(plan)}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300
                    ${isPro 
                      ? 'bg-gradient-to-r from-teal-500 to-teal-700 text-white hover:shadow-lg hover:shadow-teal-500/30' 
                      : isB2B 
                        ? 'bg-slate-800 text-white hover:bg-slate-900'
                        : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border-2 border-slate-200 hover:border-teal-500 hover:text-teal-600'}
                  `}
                >
                  {isB2B ? (lang === 'ar' ? 'تواصل معنا' : 'Contact Sales') : t.auth.next}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}