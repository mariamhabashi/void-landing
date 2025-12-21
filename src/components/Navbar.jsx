import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // استيراد Link للتنقل

export default function Navbar({ onOpenAuth }) {
  const { t, lang, toggleLang } = useLanguage();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full bg-white/70 backdrop-blur-xl z-50 border-b border-slate-200/50 shadow-sm supports-[backdrop-filter]:bg-white/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo - Click to go Home */}
          <Link to="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-black bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent cursor-pointer tracking-tighter"
            >
              {t.nav.logo}
            </motion.div>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 font-medium">
            {/* رابط صفحة المميزات الجديدة */}
            <Link to="/features" className="relative group text-slate-600 transition duration-300 hover:text-teal-600">
              {t.nav.features}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* روابط الأقسام في الصفحة الرئيسية (بنستخدم /# عشان يشتغلوا لو احنا في صفحة تانية) */}
            <a href="/#demo" className="relative group text-slate-600 transition duration-300 hover:text-teal-600">
              {t.nav.demo}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></span>
            </a>

            <a href="/#pricing" className="relative group text-slate-600 transition duration-300 hover:text-teal-600">
              {t.nav.pricing}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button onClick={toggleLang} className="flex items-center gap-2 text-slate-700 hover:text-teal-600 transition bg-slate-100/50 px-3 py-2 rounded-full">
              <Globe size={18} />
              <span className="uppercase text-sm font-bold">{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>
            
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => onOpenAuth('login')} className="text-slate-700 hover:text-teal-600 font-semibold px-4 py-2 transition">
                {t.nav.login}
              </button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onOpenAuth('signup')} 
                className="bg-gradient-to-r from-teal-500 to-teal-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition"
              >
                {t.nav.signup}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}