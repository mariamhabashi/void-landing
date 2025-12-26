import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // استدعاءات جديدة
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Demo from './components/Demo';
import Pricing from './components/Pricing';
import AuthModal from './components/AuthModal';
import Features from './components/Features'; 
import SmartCards from './components/SmartCards';

const LandingPage = ({ onOpenAuth }) => (
  <>
    <Hero onOpenAuth={onOpenAuth} />
    <Demo />
    <SmartCards />
    <Pricing onPlanSelect={() => onOpenAuth('signup')} />
  </>
);

function App() {
  const [isAuthOpen, setAuthOpen] = useState(false);
  const location = useLocation(); 

  const openAuth = (mode = 'login') => setAuthOpen(true);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-50">
        <Navbar onOpenAuth={openAuth} />
        
        <main>
          <Routes>
            <Route path="/" element={<LandingPage onOpenAuth={openAuth} />} />
            <Route path="/features" element={<Features />} />
          </Routes>
        </main>
        
        {/* Footer يظهر في كل الصفحات */}
        <footer className="bg-slate-900 text-slate-400 py-8 text-center border-t border-slate-800">
          <p>© 2025 VOID Team. Bridging the Silence.</p>
        </footer>

        <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />
      </div>
    </LanguageProvider>
  );
}

export default App;