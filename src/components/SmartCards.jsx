import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Siren, ShieldAlert, MapPin, Plane, Phone, Activity, Volume2, Fingerprint, Pill, FileText, Globe } from 'lucide-react';

const CARDS_DATA = {
  sos: {
    id: 'sos',
    title: 'طوارئ طبية',
    subtitle: 'Medical Emergency',
    color: 'from-red-600 to-rose-800',
    icon: <Siren size={28} />,
    voiceText: "أنا أصم وعندي حالة طوارئ طبية. أحتاج مساعدة فورية. من فضلك تواصل مع الرقم الموجود.",
    data: { 
      name: "آية معتز", 
      id: "ID: 2980101xxxx",
      blood: "O+ (Positive)", 
      condition: "مريض سكري (Type 1)", 
      meds: "الأنسولين (Insulin)",
      allergy: "حساسية بنسلين / Penicillin Allergy", 
      contactName: "أ/ محمد (أخي)", 
      contactNumber: "010-xxxx-xxxx" 
    }
  },
  police: {
    id: 'police',
    title: 'تفتيش / أمن',
    subtitle: 'Police / Security Check',
    color: 'from-blue-700 to-slate-900',
    icon: <ShieldAlert size={28} />,
    voiceText: "عفواً يا فندم، أنا من ذوي الهمم (أصم). لا أسمع التعليمات. أرجو التواصل كتابة أو الاتصال بالمحامي.",
    data: { 
      name: "آية معتز",
      id: "NID: 2980101xxxxxxx",
      status: "إعاقة سمعية (Deaf)",
      rights: "أحتاج مترجم إشارة قانوني (Legal Interpreter)",
      contactName: "المحامي / أحمد", 
      contactNumber: "012-xxxx-xxxx" 
    }
  },
  lost: {
    id: 'lost',
    title: 'أنا تايه',
    subtitle: 'Lost / Need Help',
    color: 'from-orange-500 to-amber-700',
    icon: <MapPin size={28} />,
    voiceText: "لو سمحت أنا تايه ومش عارف أوصل. ممكن تساعدني أروح العنوان المكتوب ده؟",
    data: { 
      name: "آية معتز",
      address: "15 شارع سوريا، رشدي، الإسكندرية", 
      landmark: "بجوار ديب مول - الدور الثالث", 
      transport: "يفضل طلب أوبر (Uber) للموقع",
      contactName: "المنزل (Home)", 
      contactNumber: "03-54xx-xxx" 
    }
  },
  travel: { // ✨ الكارت الجديد: السفر والمطار
    id: 'travel',
    title: 'سفر / مطار',
    subtitle: 'Airport Assistance',
    color: 'from-teal-600 to-emerald-800',
    icon: <Plane size={28} />,
    voiceText: "أنا مسافر أصم. أرجو توجيهي لبوابة الطائرة أو مكتب الجوازات. شكراً.",
    data: { 
      name: "Aya Moataz",
      passport: "PASS: A12345678",
      flight: "MS 980 (Cairo -> London)",
      seat: "Seat: 14F",
      assistance: "DPNA (Disabled Passenger Needs Assistance)",
      contactName: "Airline Rep", 
      contactNumber: "+20-100-xxxx" 
    }
  }
};

export default function SmartCards() {
  const [activeTab, setActiveTab] = useState('sos');
  const activeCard = CARDS_DATA[activeTab];

  const playVoiceMessage = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-EG'; // ممكن نخليها en-US لكارت السفر لو حبيتي
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-800 mb-4">
             بطاقات <span className="text-teal-600">الحياة</span> الذكية
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            بياناتك كاملة وجاهزة في جيبك. VOID بيتكلم بالنيابة عنك في كل المواقف الحرجة.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* 1. Tabs Selection (القائمة الجانبية) */}
          <div className="w-full lg:w-1/3 grid grid-cols-2 lg:flex lg:flex-col gap-3">
            {Object.values(CARDS_DATA).map((card) => (
              <button
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className={`p-4 rounded-2xl flex flex-col lg:flex-row items-center lg:items-center gap-3 transition-all duration-300 border text-center lg:text-right
                  ${activeTab === card.id 
                    ? `bg-white border-teal-500 shadow-xl scale-105 z-10 ring-1 ring-teal-500` 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-teal-200 hover:bg-teal-50'
                  }`}
              >
                <div className={`p-3 rounded-xl text-white bg-gradient-to-br ${card.color} shadow-sm`}>
                  {card.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-sm lg:text-lg ${activeTab === card.id ? 'text-slate-800' : 'text-slate-500'}`}>
                    {card.title}
                  </h3>
                  <p className="text-[10px] uppercase tracking-wider opacity-60 hidden lg:block">{card.subtitle}</p>
                </div>
              </button>
            ))}
          </div>

          {/* 2. The Smart Card Display (الكارت نفسه) */}
          <div className="w-full lg:w-2/3 perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ rotateX: 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: -90, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={`relative w-full min-h-[400px] rounded-[2rem] overflow-hidden shadow-2xl bg-gradient-to-br ${activeCard.color} text-white p-6 md:p-8 flex flex-col shadow-slate-400/50`}
              >
                
                {/* Background Pattern & Noise */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-black/20 rounded-full blur-3xl"></div>

                {/* --- Card Header --- */}
                <div className="flex justify-between items-start relative z-10 mb-6 border-b border-white/10 pb-4">
                  <div className="flex flex-col">
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight">{activeCard.title}</h3>
                    <p className="text-white/70 text-sm font-mono uppercase tracking-widest">{activeCard.subtitle}</p>
                  </div>
                  
                  {/* زر التحدث (أهم ميزة) */}
                  <button 
                    onClick={() => playVoiceMessage(activeCard.voiceText)}
                    className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-full font-bold shadow-lg hover:bg-slate-100 active:scale-95 transition-all animate-pulse"
                  >
                    <Volume2 size={20} className="text-red-600" />
                    <span className="text-sm">انطق الرسالة</span>
                  </button>
                </div>

                {/* --- Card Body (The Data Grid) --- */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 flex-1">
                  
                  {/* Left Column: Primary Info */}
                  <div className="space-y-4">
                    <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                        <p className="text-xs text-white/60 mb-1">الاسم / Name</p>
                        <p className="text-xl font-bold">{activeCard.data.name}</p>
                        <p className="text-xs font-mono text-white/50">{activeCard.data.id || activeCard.data.passport}</p>
                    </div>

                    {/* Conditional Data based on Card Type */}
                    {activeTab === 'sos' && (
                        <>
                           <div className="flex gap-3">
                                <div className="bg-red-900/40 p-3 rounded-xl border border-red-400/30 flex-1">
                                    <p className="text-xs text-red-100 mb-1">فصيلة الدم</p>
                                    <p className="text-2xl font-black">{activeCard.data.blood}</p>
                                </div>
                                <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex-[2]">
                                    <p className="text-xs text-white/70 mb-1">الحالة المزمنة</p>
                                    <p className="font-bold text-sm">{activeCard.data.condition}</p>
                                </div>
                           </div>
                           <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                                <p className="text-xs text-white/70 flex items-center gap-1 mb-1"><Pill size={12}/> أدوية / حساسية</p>
                                <p className="font-bold text-sm text-yellow-300">{activeCard.data.meds}</p>
                                <p className="font-bold text-sm text-red-200">{activeCard.data.allergy}</p>
                           </div>
                        </>
                    )}

                    {activeTab === 'police' && (
                        <div className="bg-white/10 p-4 rounded-xl border border-white/10 h-full">
                             <p className="text-xs text-white/60 mb-2 flex items-center gap-1"><FileText size={12}/> الحقوق القانونية</p>
                             <p className="text-sm font-bold leading-relaxed">{activeCard.data.rights}</p>
                             <div className="mt-3 pt-3 border-t border-white/10">
                                <p className="text-xs opacity-50">الحالة:</p>
                                <p className="font-bold">{activeCard.data.status}</p>
                             </div>
                        </div>
                    )}

                     {activeTab === 'travel' && (
                        <div className="bg-emerald-900/30 p-3 rounded-xl border border-emerald-400/30">
                             <p className="text-xs text-emerald-100 mb-1 flex items-center gap-1"><Globe size={12}/> تفاصيل الرحلة</p>
                             <p className="font-bold text-lg">{activeCard.data.flight}</p>
                             <p className="font-mono text-sm opacity-80">{activeCard.data.seat} | {activeCard.data.assistance}</p>
                        </div>
                    )}

                    {activeTab === 'lost' && (
                        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                             <p className="text-xs text-white/60 mb-1 flex items-center gap-1"><MapPin size={12}/> العنوان المطلوب</p>
                             <p className="text-lg font-bold leading-snug mb-2">{activeCard.data.address}</p>
                             <p className="text-xs bg-black/20 inline-block px-2 py-1 rounded">{activeCard.data.landmark}</p>
                        </div>
                    )}
                  </div>

                  {/* Right Column: Contact & Actions */}
                  <div className="flex flex-col h-full border-t md:border-t-0 md:border-r border-white/10 pt-4 md:pt-0 md:pr-6">
                    
                    <div className="mb-auto">
                        <p className="text-xs text-white/60 mb-2 font-bold uppercase tracking-widest">
                            {activeTab === 'police' ? 'Legal Contact' : activeTab === 'travel' ? 'Airline Help' : 'Emergency Contact'}
                        </p>
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <div className="bg-white text-slate-900 p-3 rounded-full shadow-lg">
                                <Phone size={24} />
                            </div>
                            <div>
                                <p className="text-lg font-bold">{activeCard.data.contactName}</p>
                                <p className="font-mono text-white/80 text-sm tracking-wide" dir="ltr">{activeCard.data.contactNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* The "Message" Box at bottom */}
                    <div className="mt-4 bg-black/20 p-4 rounded-2xl border border-white/5 text-center backdrop-blur-sm">
                        <p className="text-sm font-medium leading-relaxed opacity-90">
                           "{activeCard.voiceText}"
                        </p>
                    </div>

                    {/* Footer ID Stamp */}
                    <div className="mt-4 flex justify-center opacity-40">
                        <Fingerprint size={32} />
                    </div>

                  </div>

                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}