import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useLanguage } from '../context/LanguageContext';
// ضفنا Square للأيقونات المستوردة
import { Send, Bot, Video, Keyboard, Loader2, Mic, Square, AlertTriangle, Heart, ChevronDown, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SENTIMENT_CONFIG = {
  neutral: { color: 'teal', bg: 'bg-teal-600', hover: 'hover:bg-teal-700', text: 'text-teal-600', border: 'border-teal-200', ring: 'focus:ring-teal-500', shadow: 'shadow-teal-500/20' },
  danger: { color: 'red', bg: 'bg-red-600', hover: 'hover:bg-red-700', text: 'text-red-600', border: 'border-red-200', ring: 'focus:ring-red-500', shadow: 'shadow-red-500/20' },
  positive: { color: 'rose', bg: 'bg-rose-500', hover: 'hover:bg-rose-600', text: 'text-rose-500', border: 'border-rose-200', ring: 'focus:ring-rose-500', shadow: 'shadow-rose-500/20' }
};

// 1. القائمة المحدثة
const PREDEFINED_SENTENCES = [
  { id: 'tired', ar: "أنا تعبان", en: "I am tired", mood: 'danger', filename: 'انا تعبان.mp4' },
  { id: 'cured', ar: "أنا خفيت", en: "I recovered", mood: 'positive', filename: 'انا خفيت.mp4' },
  { id: 'work', ar: "أنا رايح الشغل", en: "I am going to work", mood: 'neutral', filename: 'انا رايح الشغل.mp4' },
  { id: 'school', ar: "أنا رايح المدرسة", en: "I am going to school", mood: 'neutral', filename: 'انا رايح المدرسة.mp4' },
  { id: 'hospital', ar: "أنا عايز أروح المستشفى", en: "I want to go to the hospital", mood: 'danger', filename: 'انا عايز اروح المستشفى.mp4' },
  { id: 'eat', ar: "أنا عايز آكل", en: "I want to eat", mood: 'neutral', filename: 'انا عايز اكل.mp4' },
  { id: 'help_me', ar: "أنا عايز مساعدة", en: "I want help", mood: 'danger', filename: 'انا عايز مساعدة.mp4' },
  { id: 'help_you', ar: "أنت عايز مساعدة", en: "Do you want help?", mood: 'neutral', filename: 'انت عايز مساعدة.mp4' },
  { id: 'address', ar: "عنوانك بالتفصيل", en: "Your detailed address", mood: 'neutral', filename: 'عنوانك بالتفصيل.mp4' },
];

// 2. دالة التنظيف
const normalizeArabic = (text) => {
  if (!text) return "";
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[ًٌٍَُِّْ]/g, '')
    .trim();
};

export default function Demo() {
  const { t, lang } = useLanguage();
  
  // States
  const [mode, setMode] = useState('text-to-sign');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMood, setCurrentMood] = useState('neutral');
  
  const [currentVideoSrc, setCurrentVideoSrc] = useState(null);

  // Voice & Camera
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const theme = SENTIMENT_CONFIG[currentMood];

  // تحليل المشاعر
  useEffect(() => {
    const text = inputText.toLowerCase();
    if (text.match(/hospital|help|die|pain|emergency|hurt|مستشفى|نجدة|موت|ألم|تعبان|خطر|إسعاف/i)) {
      setCurrentMood('danger');
    } else if (text.match(/love|good|happy|thanks|great|أحبك|تمام|شكرا|سعيد|ممتاز|الحمد لله|خفيت/i)) {
      setCurrentMood('positive');
    } else {
      setCurrentMood('neutral');
    }
  }, [inputText]);

  // إعداد الصوت (Start/Stop Logic)
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // استمرار التسجيل
      recognitionRef.current.interimResults = true; // نتائج لحظية
    } else {
      console.warn("Speech Recognition API not supported.");
    }
  }, []);

  // دالة التحكم في المايك
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("المتصفح لا يدعم هذه الخاصية. يرجى استخدام Google Chrome.");
      return;
    }

    if (isListening) {
      // إيقاف التسجيل
      recognitionRef.current.stop();
      setIsListening(false);
      console.log("Microphone stopped manually.");
    } else {
      // بدء التسجيل
      recognitionRef.current.lang = lang === 'ar' ? 'ar-EG' : 'en-US';
      
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      
      recognitionRef.current.onerror = (event) => {
        console.error("Speech Error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
           finalTranscript += event.results[i][0].transcript;
        }
        setInputText(finalTranscript);
      };

      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting speech recognition:", e);
      }
    }
  };

  // Backend API
  const sendVideoToBackend = async (videoBlob) => {
    setIsProcessing(true);
    setOutputText('');
    const formData = new FormData();
    formData.append('file', videoBlob, 'sign_video.webm');

    try {
      const response = await fetch('http://localhost:8000/predict', { method: 'POST', body: formData });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setOutputText(data.result || (lang === 'ar' ? "لم يتم التعرف" : "Unknown"));
    } catch (error) {
      console.error(error);
      setOutputText(lang === 'ar' ? "خطأ في الاتصال بالخادم" : "Server Connection Error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Camera Recording
  const startRecording = useCallback(() => {
    setIsRecording(true);
    chunksRef.current = [];
    if (webcamRef.current && webcamRef.current.video.srcObject) {
      const mimeType = MediaRecorder.isTypeSupported("video/webm; codecs=vp8") ? "video/webm; codecs=vp8" : "video/webm";
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.video.srcObject, { mimeType: mimeType });
      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorderRef.current.onstop = () => {
        sendVideoToBackend(new Blob(chunksRef.current, { type: "video/webm" }));
      };
      mediaRecorderRef.current.start();
    }
  }, [webcamRef]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
  }, []);

  const handleCameraToggle = () => {
    if (!isCameraActive) { setIsCameraActive(true); setOutputText(''); }
    else { isRecording ? stopRecording() : startRecording(); }
  };

  // Search Logic (Normalized)
  const handleTextSubmit = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setCurrentVideoSrc(null); 

    const normalizedInput = normalizeArabic(inputText);
    const lowerInput = inputText.toLowerCase().trim();

    const foundSentence = PREDEFINED_SENTENCES.find(s => {
        const normalizedStoredAr = normalizeArabic(s.ar);
        const lowerStoredEn = s.en ? s.en.toLowerCase() : "";
        if (normalizedStoredAr.includes(normalizedInput) || normalizedInput.includes(normalizedStoredAr)) return true;
        if (lowerStoredEn.includes(lowerInput) || lowerInput.includes(lowerStoredEn)) return true;
        return false;
    });

    setTimeout(() => {
      if (foundSentence && foundSentence.filename) {
        const videoUrl = `http://localhost:8000/animations/${foundSentence.filename}`;
        setCurrentVideoSrc(videoUrl);
      } else {
        setCurrentVideoSrc(null);
        alert(lang === 'ar' ? "لا يوجد فيديو لهذه الجملة حالياً" : "No video found");
      }
      setIsProcessing(false);
    }, 800);
  };

  return (
    <section id="demo" className="py-24 bg-slate-50 relative overflow-hidden transition-colors duration-700">
      
      {/* Sound Monitor */}
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
            {currentMood === 'danger' && <AlertTriangle size={16} className="text-red-500 animate-pulse" />}
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center mb-12 relative z-10">
        <motion.h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
          {t.demo.title}
        </motion.h2>
      </div>

      {/* Tabs */}
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

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div layout className={`bg-white rounded-3xl shadow-2xl overflow-hidden border transition-all duration-500 flex flex-col lg:flex-row min-h-[600px] ${theme.border} ${theme.shadow}`}>
          
          {/* Inputs */}
          <div className="lg:w-1/2 p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/30">
            <h3 className={`font-bold text-slate-700 flex items-center gap-2 mb-4`}>
              <span className={`w-3 h-3 rounded-full ${mode === 'sign-to-text' && isRecording ? 'bg-red-500 animate-pulse' : theme.bg}`}></span>
              {mode === 'text-to-sign' ? (lang === 'ar' ? 'أدخل النص' : 'Input') : (lang === 'ar' ? 'الكاميرا' : 'Camera')}
            </h3>

            <AnimatePresence mode="wait">
              {mode === 'text-to-sign' ? (
                <motion.div key="text-input" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} className="flex-1 flex flex-col gap-4">
                  
                  {/* Dropdown */}
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

                  {/* Textarea */}
                  <div className={`flex-1 bg-white rounded-2xl p-2 shadow-inner border focus-within:ring-2 transition-all relative flex flex-col ${theme.border} ${theme.ring}`}>
                    <textarea 
                      className="w-full flex-1 bg-transparent border-none focus:ring-0 resize-none text-slate-800 text-lg p-2"
                      placeholder={t.demo.input_placeholder}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                    <div className="flex justify-between items-center p-2 border-t border-slate-100">
                         <div className="flex gap-2 text-sm font-medium transition-colors duration-500">
                            {currentMood === 'danger' && <span className="text-red-500 flex items-center gap-1"><AlertTriangle size={14}/> حالة طوارئ</span>}
                            {currentMood === 'positive' && <span className="text-rose-500 flex items-center gap-1"><Heart size={14}/> إيجابي</span>}
                        </div>
                        
                        {/* 🔥 الزرار الجديد (مايك / إيقاف) */}
                        <button 
                            onClick={toggleListening} 
                            className={`p-3 rounded-full transition-all duration-300 ${
                                isListening 
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 animate-pulse' 
                                : 'bg-slate-100 text-slate-500 hover:text-teal-600 hover:bg-slate-200'
                            }`}
                            title={isListening ? (lang === 'ar' ? "إيقاف التسجيل" : "Stop Recording") : (lang === 'ar' ? "بدء التسجيل" : "Start Recording")}
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
                        <Webcam ref={webcamRef} audio={false} className="w-full h-full object-cover transform scale-x-[-1]" />
                        {isRecording && <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full animate-pulse z-30 text-xs font-bold">REC</div>}
                        <div className={`absolute top-0 left-0 w-full h-1 shadow-[0_0_15px] animate-[scan_2s_ease-in-out_infinite] z-20 ${currentMood === 'danger' ? 'bg-red-500 shadow-red-500' : 'bg-teal-400 shadow-teal-400'}`}></div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-100"><Video size={64} className="opacity-50 mb-4" /><p>{t.demo.camera_permission}</p></div>
                    )}
                  </div>
                  <button onClick={handleCameraToggle} className={`mt-4 w-full py-4 rounded-xl font-bold text-white transition flex justify-center items-center gap-2 shadow-lg ${!isCameraActive ? `${theme.bg} ${theme.hover}` : isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-800'}`}>
                    {!isCameraActive ? t.demo.camera_btn_start : isRecording ? (lang === 'ar' ? 'إيقاف' : 'Stop') : (lang === 'ar' ? 'تسجيل' : 'Record')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Output */}
          <div className="lg:w-1/2 bg-slate-900 p-8 flex flex-col relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
             <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 transition-colors duration-700 ${currentMood === 'danger' ? 'bg-red-600' : currentMood === 'positive' ? 'bg-rose-500' : 'bg-teal-500'}`}></div>
             
             <div className="flex justify-between items-center mb-6 relative z-10 font-mono text-sm opacity-80">
                <span className={`flex items-center gap-2 ${currentMood === 'danger' ? 'text-red-400' : 'text-teal-500'}`}><Bot size={16}/> OUTPUT</span>
                <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded text-xs">AI Ready</span>
             </div>

             <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
                {isProcessing ? (
                    <div className="text-center"><Loader2 size={48} className={`animate-spin mb-4 ${currentMood === 'danger' ? 'text-red-500' : 'text-teal-500'}`}/><p className="text-slate-400">Processing...</p></div>
                ) : mode === 'text-to-sign' ? (
                    currentVideoSrc ? (
                         <div className="w-full h-full flex items-center justify-center">
                            <video 
                                key={currentVideoSrc} 
                                src={currentVideoSrc} 
                                autoPlay 
                                controls 
                                className="w-full h-auto rounded-xl border-2 border-slate-700 shadow-2xl"
                            />
                         </div>
                    ) : (
                        <div className="relative group cursor-pointer w-full flex flex-col items-center">
                          <div className={`w-64 h-64 rounded-full flex items-center justify-center border-4 transition-all duration-500 relative ${currentMood === 'danger' ? 'border-red-900 shadow-red-900/50' : 'border-slate-700 shadow-teal-900/20'}`}>
                              <Bot size={100} className={`transition-all duration-500 ${currentMood === 'danger' ? 'text-red-500' : currentMood === 'positive' ? 'text-rose-400' : 'text-teal-500/50'}`} />
                          </div>
                          <p className="mt-8 text-slate-500 text-sm">{t.demo.avatar_placeholder_subtitle}</p>
                        </div>
                    )
                ) : (
                    <div className="w-full bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700 min-h-[200px]">
                       <h4 className="text-slate-400 text-sm font-bold mb-4 border-b border-slate-700 pb-2">Translation</h4>
                       <p className="text-2xl font-medium text-white">{outputText || "..."}</p>
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
