import React from 'react';
import { Sparkles, Activity, Cpu, ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative pt-6 pb-10 md:pt-16 md:pb-24 overflow-hidden px-4">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-slate-900/50 border border-blue-400/20 backdrop-blur-md px-4 py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-6 md:mb-8 text-blue-300">
          <Activity size={12} className="animate-pulse" />
          <span>JEE 2026 Evolution</span>
          <span className="w-1 h-1 rounded-full bg-slate-700 hidden xs:block"></span>
          <span className="text-blue-400 hidden xs:block italic">Engineered for Cheenu</span>
        </div>
        
        <h1 className="text-[2.5rem] leading-[1.1] md:text-6xl lg:text-8xl font-extrabold tracking-tight mb-6 md:mb-8 text-white">
          The Roadmap to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
            IIT Engineering
          </span>
        </h1>
        
        <p className="text-slate-400 text-sm md:text-xl max-w-3xl font-medium mb-8 md:mb-12 leading-relaxed px-2">
          Master the mathematical and physical laws of the universe, Cheenu. Every calculus problem and complex logic solved brings you closer to the IIT gates.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[280px] sm:max-w-none justify-center items-center">
          <button 
            onClick={() => document.getElementById('practice-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-blue-900/40 hover:bg-blue-500 transition-all active:scale-95 overflow-hidden flex items-center justify-center gap-2"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Solves <Sparkles size={16} />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
          
          <button 
             onClick={() => document.getElementById('stats-section')?.scrollIntoView({ behavior: 'smooth' })}
             className="w-full sm:w-auto px-8 py-4 bg-slate-900/50 text-slate-300 font-bold uppercase tracking-widest text-[10px] rounded-2xl border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition flex items-center justify-center gap-2"
          >
            <Cpu size={16} className="text-blue-400" />
            System Check
            <ChevronRight size={14} className="opacity-50" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;