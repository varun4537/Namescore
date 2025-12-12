import React, { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Animate score count up
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);
      
      setDisplayScore(Math.floor(ease * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const getColor = (s: number) => {
    // Using slightly darker/more saturated shades for better visibility on light bg
    if (s >= 80) return 'text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]'; // Orange
    if (s >= 50) return 'text-cyan-600 drop-shadow-[0_0_10px_rgba(8,145,178,0.4)]';   // Cyan
    return 'text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]';   // Rose
  };

  const circumference = 2 * Math.PI * 45; // radius 45
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Background Circle */}
      <svg className="absolute w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45"
          fill="none"
          stroke="rgba(0,0,0,0.1)" 
          strokeWidth="10"
        />
        {/* Progress Circle */}
        <circle
          cx="50%"
          cy="50%"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${getColor(displayScore)} transition-all duration-75`}
        />
      </svg>
      
      <div className="flex flex-col items-center z-10">
        <span className={`text-5xl font-black tracking-tighter ${getColor(displayScore)}`}>
          {displayScore}
        </span>
        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Score</span>
      </div>
    </div>
  );
};

export default ScoreGauge;