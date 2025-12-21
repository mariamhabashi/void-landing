import { useLanguage } from '../context/LanguageContext';
import { PlayCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Hero({ onOpenAuth }) {
  const { t, lang } = useLanguage();
  const ArrowIcon = lang === 'ar' ? ArrowRight : ArrowRight;

  return (
    <section className="pt-36 pb-24 px-4 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-100 via-slate-50 to-white overflow-hidden relative">
      
      <div className="absolute top-20 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <motion.div 
          className="md:w-1/2 space-y-8 text-center md:text-start"
          initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          {/* Badge Fix */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 px-4 py-2 rounded-full text-sm font-bold">
            <Sparkles size={16} /> {t.hero.badge}
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-black text-slate-900 leading-tight tracking-tight">
            {t.hero.title.split('..')[0]}.. <br/>
            <span className="bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent">
              {t.hero.title.split('..')[1]}
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl text-slate-600 leading-relaxed max-w-xl mx-auto md:mx-0">
            {t.hero.subtitle}
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={() => onOpenAuth('signup')} 
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl flex items-center justify-center gap-3 group"
            >
              {t.hero.cta_primary} 
              <ArrowIcon size={20} className={`transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}/>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: '#f0fdfa' }}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold transition bg-white hover:border-teal-500 hover:text-teal-600"
            >
              <PlayCircle size={24} /> {t.hero.cta_secondary}
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="md:w-1/2 relative"
          initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div 
            animate={{ y: [-15, 15, -15] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative z-10 rounded-3xl shadow-2xl shadow-teal-900/20 border-8 border-white overflow-hidden bg-white"
          >
            <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center relative overflow-hidden group">
               <img 
                 src="/assets/image1.png" 
                 alt="Deaf communication" 
                 className="object-cover w-full h-full opacity-90 group-hover:scale-110 transition duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent flex items-end p-8">
                  <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg">
                     {/* Mockup Text Fix */}
                     <p className="font-bold text-slate-900">{t.hero.mockup_text}</p>
                     <div className="h-2 w-32 bg-teal-500/30 rounded-full mt-2 animate-pulse"></div>
                  </div>
               </div>
            </div>
          </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-500/5 rounded-full blur-3xl -z-10"></div>
        </motion.div>
      </div>
    </section>
  );
}