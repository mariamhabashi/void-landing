import { useLanguage } from '../context/LanguageContext';
import { Check, X, WifiOff, Globe, MessageCircle, ShieldCheck, Gamepad2, Puzzle, Trophy, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; 

export default function Features() {
  const { t, lang } = useLanguage();
  const page = t.featuresPage; 

  // Icons mapping for cards
  const icons = [Globe, MessageCircle, WifiOff, ShieldCheck];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      
      {/* 1. Header Section */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-16">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 mb-8 transition font-bold">
           <ArrowLeft size={20} className={lang === 'ar' ? 'rotate-180' : ''}/> {page.back}
        </Link>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-slate-900 mb-6"
        >
          {page.title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 max-w-2xl mx-auto"
        >
          {page.subtitle}
        </motion.p>
      </div>

      {/* 2. Features Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {page.cards.map((card, index) => {
            const Icon = icons[index];
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl hover:border-teal-100 transition-all"
              >
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{card.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 3. Comparison Section (VS Competitors) */}
      <div className="bg-slate-900 py-20 text-white overflow-hidden relative">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">{page.comparison.title}</h2>
          </div>

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="bg-slate-800/50 backdrop-blur-md rounded-3xl border border-slate-700 overflow-hidden"
          >
            <div className="grid grid-cols-3 bg-slate-800 p-6 text-center font-bold text-lg border-b border-slate-700">
              <div className="text-slate-400 text-start px-4">الميزة / Feature</div>
              <div className="text-red-400 opacity-75">{page.comparison.others}</div>
              <div className="text-teal-400 text-xl">{page.comparison.us}</div>
            </div>

            {page.comparison.rows.map((row, i) => (
              <div key={i} className="grid grid-cols-3 p-6 border-b border-slate-700/50 hover:bg-slate-700/30 transition items-center">
                <div className="text-start px-4 font-medium text-slate-200">{row.feature}</div>
                
                {/* Competitors Column */}
                <div className="text-center text-slate-400 text-sm flex flex-col items-center gap-1">
                  {row.us.includes("Online") ? <WifiOff size={20} className="text-red-400 mb-1"/> : <X size={20} className="text-red-400 mb-1" />}
                  {row.others}
                </div>

                {/* VOID Column */}
                <div className="text-center font-bold text-white flex flex-col items-center gap-1 bg-teal-500/10 py-2 rounded-lg border border-teal-500/20 mx-2">
                   <Check size={20} className="text-teal-400 mb-1" />
                   {row.us}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 4. Kids / Gamification Section (Coming Soon) */}
      <div className="max-w-6xl mx-auto px-4 py-24">
         <motion.div 
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-1 shadow-2xl"
         >
            <div className="bg-white rounded-[22px] p-8 md:p-12 overflow-hidden relative">
               
               {/* Floating Background Icons */}
               <Gamepad2 className="absolute top-10 right-10 text-purple-100 rotate-12" size={120} />
               <Puzzle className="absolute bottom-10 left-10 text-pink-100 -rotate-12" size={120} />

               <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                  <div className="md:w-1/2 space-y-6">
                     <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-purple-200">
                        {page.kids.badge}
                     </span>
                     <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                        {page.kids.title}
                     </h2>
                     <p className="text-slate-600 text-lg">
                        {page.kids.desc}
                     </p>
                     
                     <div className="flex flex-wrap gap-3">
                        {page.kids.features.map((f, i) => (
                           <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-sm font-bold text-slate-700">
                              <Trophy size={14} className="text-yellow-500" /> {f}
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="md:w-1/2 flex justify-center">
                     {/* Gamification Image - Updated Source */}
                     <div className="relative w-80 h-80">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-2xl animate-pulse opacity-20 blur-xl"></div>
                        <img 
                           src="/assets/image.png" 
                           alt="Gamification" 
                           className="relative z-10 w-full h-full object-cover rounded-2xl hover:scale-105 transition duration-500 shadow-lg"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </motion.div>
      </div>

    </div>
  );
}