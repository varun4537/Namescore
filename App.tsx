import React, { useState, useEffect, useRef } from 'react';
import Background from './components/Background';
import ScoreGauge from './components/ScoreGauge';
import { NameAnalysis, ViewState } from './types';
import { analyzeNameWithGemini } from './services/gemini';
import { FUN_CTAS, LOADING_MESSAGES } from './constants';
import { Sparkles, RefreshCcw, Share2, Info, ArrowRight, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [name, setName] = useState('');
  const [viewState, setViewState] = useState<ViewState>(ViewState.IDLE);
  const [result, setResult] = useState<NameAnalysis | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [ctaText, setCtaText] = useState(FUN_CTAS[0]);
  
  // Confetti trigger
  const triggerConfetti = () => {
    if (window.confetti) {
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#f97316', '#06b6d4', '#84cc16']; // Orange, Cyan, Lime

      (function frame() {
        window.confetti({
          particleCount: 4,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
          colors: colors,
          shapes: ['circle']
        });
        window.confetti({
          particleCount: 4,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
          colors: colors,
          shapes: ['circle']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  };

  useEffect(() => {
    // Rotate CTA on mount
    setCtaText(FUN_CTAS[Math.floor(Math.random() * FUN_CTAS.length)]);
  }, []);

  const handleRate = async () => {
    if (!name.trim()) return;
    
    setViewState(ViewState.ANALYZING);
    
    // Cycle loading messages
    const interval = setInterval(() => {
      setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    }, 1200);

    try {
      const analysis = await analyzeNameWithGemini(name);
      setResult(analysis);
      setViewState(ViewState.RESULT);
      clearInterval(interval);
      
      // Trigger confetti if score is good
      if (analysis.score > 60) {
        setTimeout(triggerConfetti, 300);
      }
    } catch (e) {
      console.error(e);
      setViewState(ViewState.IDLE);
      alert("The Name Gods are sleeping. Try again.");
    }
  };

  const handleReset = () => {
    setName('');
    setResult(null);
    setViewState(ViewState.IDLE);
    setCtaText(FUN_CTAS[Math.floor(Math.random() * FUN_CTAS.length)]);
  };

  const handleShare = async () => {
    if (!result) return;
    const shareText = `My name "${name}" has a vibe score of ${result.score}/100! verdict: ${result.verdict}. Rate yours at Name Score!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Name Score',
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Copied to clipboard!");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim().length > 0) {
      handleRate();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative text-slate-900 font-grotesk">
      <Background />

      {/* Header */}
      <header className="p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] rotate-3">
            <Zap size={24} className="text-white fill-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-800">Name Score</span>
        </div>
        {viewState === ViewState.RESULT && (
           <button onClick={handleReset} className="p-3 bg-white rounded-full hover:scale-110 transition-all border border-slate-200 shadow-md">
             <RefreshCcw size={20} className="text-cyan-600" />
           </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto z-10">
        
        {/* IDLE STATE */}
        {viewState === ViewState.IDLE && (
          <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-black leading-[0.9] tracking-tighter">
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
                  CHECK YOUR NAME VIBE
                </span>
              </h1>
              <p className="text-xl text-slate-600 font-medium">
                Scientific? <span className="text-rose-500 font-bold line-through decoration-4 decoration-rose-500/50">No.</span> <br/>
                Accurate? <span className="text-cyan-600 font-bold">100%.</span>
              </p>
            </div>

            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white border-2 border-slate-200 focus-within:border-cyan-500 rounded-2xl p-2 transition-colors shadow-lg">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter name..."
                    className="w-full bg-transparent text-center text-4xl font-bold text-slate-900 placeholder-slate-300 py-6 outline-none font-grotesk tracking-wide"
                    maxLength={20}
                  />
                </div>
            </div>

            <button
              onClick={handleRate}
              disabled={!name.trim()}
              className={`
                group relative w-full py-5 rounded-2xl font-black text-2xl uppercase tracking-wider transition-all duration-200 shadow-xl
                ${name.trim() 
                  ? 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02] hover:shadow-xl cursor-pointer rotate-1' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
              `}
            >
              <div className="flex items-center justify-center gap-3">
                {ctaText}
                {name.trim() && <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform text-orange-400" />}
              </div>
            </button>
          </div>
        )}

        {/* LOADING STATE */}
        {viewState === ViewState.ANALYZING && (
          <div className="text-center space-y-8 animate-in fade-in duration-500">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 border-[6px] border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-t-cyan-500 border-r-orange-500 border-b-lime-500 border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-5xl animate-bounce">🔮</div>
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent animate-pulse">{loadingMsg}</h2>
          </div>
        )}

        {/* RESULT STATE */}
        {viewState === ViewState.RESULT && result && (
          <div className="w-full flex flex-col gap-6 animate-in zoom-in-95 duration-500">
            
            {/* Score Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
              {/* Decorative glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full pointer-events-none opacity-20
                  ${result.score > 80 ? 'bg-orange-400' : result.score > 50 ? 'bg-cyan-400' : 'bg-rose-400'}
              `} />

              <div className="flex flex-col items-center gap-6 relative z-10">
                <ScoreGauge score={result.score} />
                
                <div className="text-center space-y-3">
                  <div className={`
                    inline-block px-4 py-2 rounded-lg text-sm font-black uppercase tracking-widest mb-2 border-2 transform -rotate-2
                    ${result.rarityLevel === 'Mythical' ? 'bg-orange-100 text-orange-700 border-orange-400' : 
                      result.rarityLevel === 'Legendary' ? 'bg-cyan-100 text-cyan-700 border-cyan-400' :
                      result.rarityLevel === 'Rare' ? 'bg-lime-100 text-lime-700 border-lime-400' :
                      'bg-slate-100 text-slate-500 border-slate-300'}
                  `}>
                    {result.rarityLevel} Tier
                  </div>
                  
                  <h2 className="text-4xl font-black font-grotesk leading-none text-slate-900 tracking-tight">
                    {result.verdict}
                  </h2>
                  <p className="text-lg text-slate-600 font-medium leading-relaxed">
                    {result.description}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {result.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleShare}
                className="w-full bg-cyan-500 text-white font-black text-lg py-4 rounded-xl hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-200"
              >
                <Share2 size={22} />
                SHARE THIS VIBE
              </button>
              <button 
                onClick={handleReset}
                className="w-full bg-transparent text-slate-500 font-bold py-4 rounded-xl hover:text-slate-800 transition-colors uppercase tracking-widest text-sm"
              >
                Try Another Name
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="p-6 text-center z-10">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-2">
          Powered by Gemini 2.5 <Sparkles size={10} className="text-orange-400" />
        </p>
      </footer>
    </div>
  );
};

export default App;