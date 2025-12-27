import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useLanguage } from '../context/LanguageContext';
// ضفنا أيقونة SwitchCamera
import { Send, Bot, Video, Keyboard, Loader2, Mic, Square, AlertTriangle, Heart, ChevronDown, List, SwitchCamera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SENTIMENT_CONFIG = {
  neutral: { color: 'teal', bg: 'bg-teal-600', hover: 'hover:bg-teal-700', text: 'text-teal-600', border: 'border-teal-200', ring: 'focus:ring-teal-500', shadow: 'shadow-teal-500/20' },
  danger: { color: 'red', bg: 'bg-red-600', hover: 'hover:bg-red-700', text: 'text-red-600', border: 'border-red-200', ring: 'focus:ring-red-500', shadow: 'shadow-red-500/20' },
  positive: { color: 'rose', bg: 'bg-rose-500', hover: 'hover:bg-rose-600', text: 'text-rose-500', border: 'border-rose-200', ring: 'focus:ring-rose-500', shadow: 'shadow-rose-500/20' }
};

const PREDEFINED_SENTENCES = [
  { id: 'work', ar: "أنا رايح الشغل", en: "I am going to work", mood: 'neutral' },
  { id: 'tired', ar: "أنا تعبان", en: "I am tired", mood: 'danger' },
  { id: 'cured', ar: "أنا خفيت", en: "I recovered", mood: 'positive' },
];

export default function Demo() {
  const { t, lang } = useLanguage();
  
  // States
  const [mode, setMode] = useState('text-to-sign');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMood, setCurrentMood] = useState('neutral');
  const [currentVideoSrc, setCurrentVideoSrc] = useState(null);

  // Voice & Camera States
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // --- تعديل الكاميرا (Default: environment للكاميرا الخلفية) ---
  const [facingMode, setFacingMode] = useState('environment'); 
  const webcamRef = useRef(null);

  const theme = SENTIMENT_CONFIG[currentMood];

  // دالة قلب الكاميرا
  const toggleCameraFacing = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // --- Fake Backend Logic ---
  const fakeProcessVideo = () => {
    setIsProcessing(true);
    setOutputText(''); 
    
    setTimeout(() => {
      setIsProcessing(false);
      const fixedResult = lang === 'ar' ? "أنا رايح الشغل" : "I am going to work";
      setOutputText(fixedResult);
      setCurrentMood('neutral'); 
    }, 2000); 
  };

  const startRecording = useCallback(() => {
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    fakeProcessVideo();
  }, [lang]); 

  const handleCameraToggle = () => {
    if (!isCameraActive) { 
        setIsCameraActive(true); 
        setOutputText(''); 
    } else { 
        isRecording ? stopRecording() : startRecording(); 
    }
  };

  // Speech Recognition (Optional)
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; 
      recognitionRef.current.interimResults = true; 
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = lang === 'ar' ? 'ar-EG' : 'en-US';
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
           finalTranscript += event.results[i][0].transcript;
        }
        setInputText(finalTranscript);
      };
      recognitionRef.current.start();
    }
  };

  const handleTextSubmit = () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
        setIsProcessing(false);
        alert(lang === 'ar' ? "في النسخة التجريبية، تشغيل الفيديو غير متاح بدون سيرفر." : "Video playback disabled in static demo.");
    }, 1000);
  };

  return (
    <section id="demo" className="py-24 bg-slate-50 relative overflow-hidden transition-colors duration-700">
      
       <div className="absolute top-4 right-4 md:top-10 md:right-10 flex items-center gap-2 z-20">
         <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm flex items-center gap-3 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:block">
              {lang === 'ar' ? 'مراقبة الصوت المحيط' : 'Sound Monitor'}
            </span>
            <div className="flex items-end gap-1 h-6">
                <motion.div animate={{ height: [10, 20, 10] }} transition={{ repeat: Infinity, duration: 0.5 }} className={`w-1 rounded-full ${currentMood === 'danger' ? 'bg-red-500' : 'bg-slate-400'}`}></motion.div>
                <motion.div animate={{ height: [14, 24, 10] }} transition={{ repeat: Infinity, duration: 0.4 }} className={`w-1 rounded-full ${currentMood === 'danger' ? 'bg-red-500' : 'bg-slate-400'}`}></motion.div>
                <motion.div animate={{ height: [8, 18, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className={`w-1 rounded-full ${currentMood === 'danger' ? 'bg-red-500' : 'bg-slate-400'}`}></motion.div>
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center mb-12 relative z-10">
        <motion.h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
          {t.demo.title}
        </motion.h2>
      </div>

      <div className="flex justify-center mb-10 relative z-10">
        <div className="bg-white p-1.5 rounded-full shadow-md border border-slate-200 inline-flex">
          <button 
            onClick={() => { setMode('text-to-sign'); setIsCameraActive(false); setIsRecording(false); }}
            className={`px-6 py-3 rounded-full flex items-center gap-2 font-bold transition-all duration-300 ${mode === 'text-to-sign' ? `${theme.bg} text-white shadow-lg` : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Keyboard size={20} /> {t.demo.mode_text_to_sign}
          </button>
          <button 
            onClick={() => { setMode('sign-to-text'); setInputText(''); setCurrentVideoSrc(null); }}
            className={`px-6 py-3 rounded-full flex items-center gap-2 font-bold transition-all duration-300 ${mode === 'sign-to-text' ? `${theme.bg} text-white shadow-lg` : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Video size={20} /> {t.demo.mode_sign_to_text}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div layout className={`bg-white rounded-3xl shadow-2xl overflow-hidden border transition-all duration-500 flex flex-col lg:flex-row min-h-[600px] ${theme.border} ${theme.shadow}`}>
          
          <div className="lg:w-1/2 p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/30">
            <h3 className={`font-bold text-slate-700 flex items-center gap-2 mb-4`}>
              <span className={`w-3 h-3 rounded-full ${mode === 'sign-to-text' && isRecording ? 'bg-red-500 animate-pulse' : theme.bg}`}></span>
              {mode === 'text-to-sign' ? (lang === 'ar' ? 'أدخل النص' : 'Input') : (lang === 'ar' ? 'الكاميرا' : 'Camera')}
            </h3>

            <AnimatePresence mode="wait">
              {mode === 'text-to-sign' ? (
                <motion.div key="text-input" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} className="flex-1 flex flex-col gap-4">
                  
                  <div className="relative group">
                    <List size={18} className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" />
                    <select
                        onChange={(e) => setInputText(e.target.value)}
                        value={inputText}
                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl appearance-none focus:ring-2 cursor-pointer text-slate-700 font-medium transition-all ${theme.border} ${theme.ring}`}
                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    >
                        <option value="">{lang === 'ar' ? '-- اختر جملة جاهزة --' : '-- Quick Select --'}</option>
                        {PREDEFINED_SENTENCES.map((s) => (
                            <option key={s.id} value={lang === 'ar' ? s.ar : s.en}>{lang === 'ar' ? s.ar : s.en}</option>
                        ))}
                    </select>
                    <ChevronDown size={16} className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-3.5 text-slate-400 pointer-events-none`} />
                  </div>

                  <div className={`flex-1 bg-white rounded-2xl p-2 shadow-inner border focus-within:ring-2 transition-all relative flex flex-col ${theme.border} ${theme.ring}`}>
                    <textarea 
                      className="w-full flex-1 bg-transparent border-none focus:ring-0 resize-none text-slate-800 text-lg p-2"
                      placeholder={t.demo.input_placeholder}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                    <div className="flex justify-between items-center p-2 border-t border-slate-100">
                        <button 
                            onClick={toggleListening} 
                            className={`p-3 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500'}`}
                        >
                            {isListening ? <Square size={20} fill="currentColor" /> : <Mic size={20} />}
                        </button>
                    </div>
                  </div>

                  <button 
                    onClick={handleTextSubmit}
                    disabled={isProcessing || !inputText.trim()}
                    className={`w-full py-4 rounded-xl font-bold text-white transition flex justify-center items-center gap-2 shadow-lg disabled:opacity-50 ${theme.bg} ${theme.hover} ${theme.shadow}`}
                  >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Send size={20} className={lang === 'ar' ? 'rotate-180' : ''} />}
                    {isProcessing ? t.demo.output_text_processing : (lang === 'ar' ? 'ترجم إلى لغة الإشارة' : 'Translate to Sign')}
                  </button>
                </motion.div>
              ) : (
                // Camera Mode
                <motion.div key="camera-input" initial={{opacity:0}} animate={{opacity:1}} className="flex-1 flex flex-col">
                  <div className="flex-1 bg-black rounded-2xl overflow-hidden relative min-h-[300px]">
                    {isCameraActive ? (
                      <>
                        <Webcam 
                            ref={webcamRef} 
                            audio={false} 
                            // هنا التعديل: environment يعني خلفية، user يعني أمامية
                            videoConstraints={{ facingMode: facingMode }}
                            // هنا بنشيل الانعكاس لو الكاميرا خلفية
                            className={`w-full h-full object-cover transition-transform duration-500 ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} 
                        />
                        
                        {/* زرار قلب الكاميرا */}
                        <button 
                            onClick={toggleCameraFacing}
                            className="absolute top-4 right-4 z-40 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 backdrop-blur-sm transition"
                            title="Flip Camera"
                        >
                            <SwitchCamera size={20} />
                        </button>

                        {isRecording && <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full animate-pulse z-30 text-xs font-bold">REC</div>}
                        <div className={`absolute top-0 left-0 w-full h-1 shadow-[0_0_15px] animate-[scan_2s_ease-in-out_infinite] z-20 ${currentMood === 'danger' ? 'bg-red-500 shadow-red-500' : 'bg-teal-400 shadow-teal-400'}`}></div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-100"><Video size={64} className="opacity-50 mb-4" /><p>{t.demo.camera_permission}</p></div>
                    )}
                  </div>
                  <button onClick={handleCameraToggle} className={`mt-4 w-full py-4 rounded-xl font-bold text-white transition flex justify-center items-center gap-2 shadow-lg ${!isCameraActive ? `${theme.bg} ${theme.hover}` : isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-800'}`}>
                    {!isCameraActive ? t.demo.camera_btn_start : isRecording ? (lang === 'ar' ? 'إيقاف وإنهاء' : 'Stop & Finish') : (lang === 'ar' ? 'تسجيل' : 'Record')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:w-1/2 bg-slate-900 p-8 flex flex-col relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
             <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 transition-colors duration-700 ${currentMood === 'danger' ? 'bg-red-600' : currentMood === 'positive' ? 'bg-rose-500' : 'bg-teal-500'}`}></div>
             
             <div className="flex justify-between items-center mb-6 relative z-10 font-mono text-sm opacity-80">
                <span className={`flex items-center gap-2 ${currentMood === 'danger' ? 'text-red-400' : 'text-teal-500'}`}><Bot size={16}/> OUTPUT</span>
                <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded text-xs">AI Ready</span>
             </div>

             <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
                {isProcessing ? (
                    <div className="text-center"><Loader2 size={48} className={`animate-spin mb-4 ${currentMood === 'danger' ? 'text-red-500' : 'text-teal-500'}`}/><p className="text-slate-400">Analyzing Sign Language...</p></div>
                ) : mode === 'text-to-sign' ? (
                    <div className="relative group cursor-pointer w-full flex flex-col items-center">
                        <div className={`w-64 h-64 rounded-full flex items-center justify-center border-4 transition-all duration-500 relative ${theme.border}`}>
                            <Bot size={100} className={`transition-all duration-500 ${theme.text}`} />
                        </div>
                        <p className="mt-8 text-slate-500 text-sm">Animation Playback</p>
                    </div>
                ) : (
                    <div className="w-full bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700 min-h-[200px] flex items-center justify-center">
                       <div className="text-center w-full">
                           <h4 className="text-slate-400 text-sm font-bold mb-4 border-b border-slate-700 pb-2">Detected Meaning</h4>
                           <p className="text-3xl md:text-4xl font-black text-white animate-in fade-in zoom-in duration-500">
                               {outputText || "..."}
                           </p>
                       </div>
                    </div>
                )}
             </div>
          </div>

        </motion.div>
      </div>
      <style>{`@keyframes scan { 0% {top:0;opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{top:100%;opacity:0} }`}</style>
    </section>
  );
}
