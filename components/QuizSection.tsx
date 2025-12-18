import React, { useState } from 'react';
import { Subject, Question } from '../types';
import { generatePracticeQuestion } from '../services/gemini';
import { CheckCircle2, XCircle, ArrowRight, Loader2, Binary, BrainCircuit, ArrowLeft, Microscope } from 'lucide-react';
import LatexRenderer from './LatexRenderer';

interface QuizSectionProps {
  onCorrectAnswer: (subject: Subject) => void;
  onQuestionAnswered: () => void;
  seenQuestions: string[];
  onQuestionGenerated: (questionText: string) => void;
}

const TOPICS_BY_SUBJECT: Record<Subject, string[]> = {
  [Subject.PHYSICS]: [
    "Units & Measurements", "Kinematics", "Laws of Motion", "Work, Energy & Power", 
    "Rotational Motion", "Gravitation", "Properties of Matter", "Thermodynamics", 
    "Oscillations & Waves", "Electrostatics", "Current Electricity", 
    "Magnetism", "EM Induction & AC", "Optics", "Modern Physics", "Electronic Devices"
  ],
  [Subject.CHEMISTRY]: [
    "Atomic Structure", "Chemical Bonding", "Thermodynamics", "Equilibrium", 
    "Redox & Electrochemistry", "Chemical Kinetics", "Surface Chemistry",
    "S & P Block Elements", "D & F Block Elements", "Coordination Compounds", 
    "General Organic Chemistry", "Hydrocarbons", "Alcohols & Phenols", "Aldehydes & Ketones", "Biomolecules"
  ],
  [Subject.MATHEMATICS]: [
    "Sets & Relations", "Complex Numbers", "Matrices & Determinants", "Permutations & Combinations", 
    "Binomial Theorem", "Sequences & Series", "Limits & Continuity", "Differentiation", 
    "Integral Calculus", "Differential Equations", "Coordinate Geometry", 
    "Vector Algebra", "3D Geometry", "Probability", "Trigonometry", "Mathematical Reasoning"
  ]
};

const QuizSection: React.FC<QuizSectionProps> = ({ 
  onCorrectAnswer, onQuestionAnswered, seenQuestions, onQuestionGenerated 
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const subjects = [
    { id: Subject.PHYSICS, icon: BrainCircuit, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { id: Subject.CHEMISTRY, icon: Microscope, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    { id: Subject.MATHEMATICS, icon: Binary, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  ];

  const handleSubjectSelect = (sub: Subject) => {
    setSelectedSubject(sub);
    setSelectedTopic(null);
    setCurrentQuestion(null);
  };

  const loadQuestion = async (sub: Subject, topic?: string) => {
    setLoading(true);
    setCurrentQuestion(null);
    setSelectedOption(null);
    setShowExplanation(false);
    
    let attempts = 0;
    let uniqueQuestionFound = false;
    let finalQuestion: Question | null = null;

    while (!uniqueQuestionFound && attempts < 3) {
        const question = await generatePracticeQuestion(sub, topic || selectedTopic || undefined, seenQuestions.slice(-20));
        if (question) {
            const isDuplicate = seenQuestions.some(q => q.toLowerCase().trim() === question.text.toLowerCase().trim());
            if (!isDuplicate) {
                finalQuestion = question;
                uniqueQuestionFound = true;
            }
        }
        attempts++;
    }
    
    if (finalQuestion) {
        setCurrentQuestion(finalQuestion);
        onQuestionGenerated(finalQuestion.text);
    }
    setLoading(false);
  };

  return (
    <div id="practice-section" className="max-w-4xl mx-auto px-4 mb-24 transition-all duration-500">
      <div className="flex items-center gap-6 mb-12">
        <h2 className="text-xl font-bold text-slate-100 tracking-wider">Concept Solves</h2>
        <div className="h-px bg-slate-800 flex-1"></div>
      </div>

      {!selectedSubject ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => handleSubjectSelect(sub.id)}
              className="p-8 md:p-10 glass-card rounded-[2rem] transition-all hover:-translate-y-2 flex flex-col items-center gap-6 group hover:bg-slate-900/40"
            >
              <div className={`p-5 rounded-2xl transition-transform group-hover:scale-110 ${sub.color}`}>
                <sub.icon size={36} />
              </div>
              <span className="font-bold text-slate-200 tracking-widest text-xs md:text-sm uppercase">{sub.id}</span>
            </button>
          ))}
        </div>
      ) : !selectedTopic ? (
        <div className="animate-fade-in">
           <button onClick={() => setSelectedSubject(null)} className="mb-8 flex items-center text-slate-500 hover:text-blue-400 text-[10px] font-bold uppercase tracking-widest transition">
             <ArrowLeft size={14} className="mr-2" /> Change Subject
           </button>
           <h3 className="text-lg font-bold text-white mb-6 pl-4 border-l-2 border-blue-500">Syllabus: {selectedSubject}</h3>
           <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4">
             {TOPICS_BY_SUBJECT[selectedSubject].map((topic) => (
               <button
                 key={topic}
                 onClick={() => { setSelectedTopic(topic); loadQuestion(selectedSubject, topic); }}
                 className="p-5 glass-card rounded-2xl hover:border-blue-500/40 text-left transition-all group hover:bg-slate-900/50"
               >
                 <span className="font-semibold text-slate-300 text-sm group-hover:text-white line-clamp-1">{topic}</span>
               </button>
             ))}
           </div>
        </div>
      ) : (
        <div className="glass-card rounded-[2.5rem] overflow-hidden animate-fade-in shadow-2xl">
          <div className="bg-slate-900/50 px-6 py-5 border-b border-slate-800/50 flex justify-between items-center flex-wrap gap-4">
             <div className="flex items-center gap-3">
                <button onClick={() => setSelectedTopic(null)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 transition-colors">
                  <ArrowLeft size={18} />
                </button>
                <div className="flex flex-col">
                    <span className="text-[9px] text-blue-500 font-bold uppercase tracking-widest leading-none mb-1">{selectedSubject}</span>
                    <span className="font-bold text-white text-sm max-w-[150px] xs:max-w-[200px] truncate">{selectedTopic}</span>
                </div>
             </div>
          </div>

          <div className="p-6 md:p-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-blue-500 mb-6" size={48} />
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Computing JEE Logic...</p>
              </div>
            ) : currentQuestion ? (
              <div className="animate-fade-in">
                <div className="text-lg md:text-2xl font-semibold text-slate-100 leading-snug mb-8 md:mb-10">
                  <LatexRenderer text={currentQuestion.text} />
                </div>
                <div className="grid gap-3 md:gap-4 mb-8 md:mb-10">
                  {currentQuestion.options.map((option, idx) => {
                    const isCorrect = idx === currentQuestion.correctAnswerIndex;
                    const isSelected = selectedOption === idx;
                    const showResult = selectedOption !== null;

                    let btnClass = "w-full text-left p-4 md:p-5 rounded-2xl border transition-all text-sm md:text-base font-medium flex items-center justify-between ";
                    
                    if (!showResult) {
                      btnClass += "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-blue-500/50 hover:bg-slate-800";
                    } else if (isCorrect) {
                      btnClass += "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                    } else if (isSelected && !isCorrect) {
                      btnClass += "border-rose-500/50 bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]";
                    } else {
                      btnClass += "border-slate-900 opacity-20 bg-slate-950 text-slate-700";
                    }

                    return (
                      <button 
                        key={idx} 
                        onClick={() => { 
                          if (selectedOption !== null) return;
                          setSelectedOption(idx); 
                          setShowExplanation(true); 
                          onQuestionAnswered(); 
                          if (isCorrect) onCorrectAnswer(currentQuestion.subject); 
                        }} 
                        disabled={showResult} 
                        className={btnClass}
                      >
                        <span className="flex-1 pr-4">
                          <LatexRenderer text={option} />
                        </span>
                        {showResult && isCorrect && <CheckCircle2 className="text-emerald-500 flex-shrink-0 animate-bounce-in" size={24} />}
                        {showResult && isSelected && !isCorrect && <XCircle className="text-rose-500 flex-shrink-0 animate-bounce-in" size={24} />}
                      </button>
                    );
                  })}
                </div>
                {showExplanation && (
                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 mb-10 animate-slide-up">
                    <div className="text-blue-200/80 text-sm md:text-base italic font-medium leading-relaxed">
                      <LatexRenderer text={currentQuestion.explanation} />
                    </div>
                  </div>
                )}
                {selectedOption !== null && (
                  <div className="flex justify-end">
                    <button 
                      onClick={() => loadQuestion(selectedSubject)} 
                      className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/30 active:scale-95"
                    >
                      Next Solve <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-500 mb-6 italic">Protocol failed to initialize.</p>
                <button onClick={() => loadQuestion(selectedSubject)} className="px-6 py-3 bg-blue-600 rounded-xl text-white font-bold text-[10px] uppercase">Force Resync</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizSection;