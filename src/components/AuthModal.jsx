import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, CheckCircle2, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants for steps transition
const stepVariants = {
  hidden: (direction) => ({ opacity: 0, x: direction > 0 ? 50 : -50 }),
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: (direction) => ({ opacity: 0, x: direction < 0 ? 50 : -50, transition: { duration: 0.2 } })
};

export default function AuthModal({ isOpen, onClose, initialPlan }) {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); // 1 for forward, -1 for backward
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (initialPlan) {
      setSelectedPlan(initialPlan);
      setStep(2);
    } else {
      setStep(1);
      setSelectedPlan(null);
    }
  }, [initialPlan, isOpen]);

  const changeStep = (newStep) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  // Reusable Input Component with focus style
  const InputField = ({ type, placeholder, icon: Icon }) => (
    <div className="relative group">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition" size={20} />}
      <input 
        type={type} placeholder={placeholder} 
        className={`w-full p-4 ${Icon ? (lang === 'ar' ? 'pr-12' : 'pl-12') : ''} bg-slate-50 rounded-xl border-2 border-slate-100 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium text-slate-700 placeholder-slate-400`}
      />
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-8"
          >
            {/* Close Button */}
            <button onClick={onClose} className="absolute top-5 right-5 z-10 bg-slate-100 text-slate-500 p-2 rounded-full hover:bg-slate-200 hover:text-slate-700 transition">
              <X size={20} />
            </button>

            {/* Progress Bar */}
            {selectedPlan && (
              <div className="bg-slate-50 p-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4 relative">
                  {/* Progress Line */}
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
                  <motion.div 
                    className="absolute top-1/2 left-0 h-1 bg-teal-500 -translate-y-1/2 z-0 transition-all duration-500"
                    style={{ width: step === 2 ? '50%' : '100%' }}
                  ></motion.div>

                  {/* Steps Icons */}
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors ${step >= 2 ? 'bg-teal-500' : 'bg-slate-200 text-slate-500'}`}>
                    {step > 2 ? <CheckCircle2 size={20}/> : '1'}
                  </div>
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step === 3 ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    2
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 text-center">
                  {step === 1 ? t.auth.step1_title : step === 2 ? t.auth.step2_title : t.auth.step3_title}
                </h3>
              </div>
            )}

            <div className="p-8">
              <AnimatePresence mode="wait" custom={direction}>
                {/* Step 1: Login (If no plan selected) */}
                {step === 1 && (
                  <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" custom={direction} className="space-y-5">
                     <h3 className="text-2xl font-black text-slate-900 mb-6">{t.nav.login}</h3>
                     <InputField type="email" placeholder={t.auth.email_label} />
                     <InputField type="password" placeholder={t.auth.pass_label} />
                     <motion.button whileTap={{ scale: 0.98 }} className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-500/20">
                       {t.nav.login}
                     </motion.button>
                     <div className="text-center text-slate-500 font-medium text-sm mt-4">
                       ليس لديك حساب؟ اختر خطة أولاً من صفحة الأسعار
                     </div>
                  </motion.div>
                )}

                {/* Step 2: Sign Up Details */}
                {step === 2 && (
                  <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" custom={direction} className="space-y-5">
                    <InputField type="text" placeholder={t.auth.name_label} />
                    <InputField type="email" placeholder={t.auth.email_label} />
                    <InputField type="password" placeholder={t.auth.pass_label} />
                    
                    <div className="flex gap-4 mt-8">
                      <button onClick={() => changeStep(1)} className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-200 transition">{t.auth.back}</button>
                      <motion.button whileTap={{ scale: 0.98 }} onClick={() => changeStep(3)} className="flex-[2] bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-500/20">{t.auth.next}</motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Payment & Promo */}
                {step === 3 && (
                  <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" custom={direction} className="space-y-6">
                    {/* Plan Summary Card */}
                    <div className="bg-gradient-to-br from-slate-50 to-teal-50/50 p-5 rounded-2xl border border-teal-100 flex justify-between items-center">
                       <div>
                          <p className="text-sm text-slate-500 font-bold mb-1">الخطة المختارة</p>
                          <p className="text-xl font-black text-teal-800">{selectedPlan?.name}</p>
                       </div>
                       <p className="text-2xl font-black text-slate-900">{selectedPlan?.price}</p>
                    </div>

                    {/* Promo Code */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t.auth.promo_label}</label>
                      <div className="flex gap-2">
                         <input type="text" placeholder="EX: VOID20" className="flex-1 p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus:border-teal-500 outline-none font-bold uppercase tracking-wider" />
                         <button className="bg-slate-800 text-white px-6 rounded-xl font-bold hover:bg-slate-900 transition">تطبيق</button>
                      </div>
                    </div>

                    {/* Fake Payment Info */}
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">بيانات البطاقة (محاكاة)</label>
                       <InputField type="text" placeholder="**** **** **** 4242" icon={CreditCard} />
                    </div>

                    <div className="flex gap-4 mt-8">
                      <button onClick={() => changeStep(2)} className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-200 transition">{t.auth.back}</button>
                      <motion.button whileTap={{ scale: 0.98 }} className="flex-[2] bg-gradient-to-r from-teal-600 to-teal-500 text-white py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-teal-500/30 transition">{t.auth.submit}</motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}