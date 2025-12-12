import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#ecfeff]" />
      
      {/* Animated Blobs - Bright Orange, Blue, Green (No Purple) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDuration: '6s' }} />
      <div className="absolute top-[10%] right-[-10%] w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDuration: '8s', animationDelay: '2s' }} />
      <div className="absolute -bottom-20 left-10 w-[500px] h-[500px] bg-lime-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-float" style={{ animationDuration: '10s', animationDelay: '1s' }} />
      <div className="absolute bottom-[-10%] right-20 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" style={{ animationDuration: '7s', animationDelay: '4s' }} />
      
      {/* Noise overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    </div>
  );
};

export default Background;