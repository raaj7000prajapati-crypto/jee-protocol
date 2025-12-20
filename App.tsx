
import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import QuizSection from './components/QuizSection';
import AIChat from './components/AIChat';
import { Subject, UserProgress } from './types';
import { generateMotivationalQuote } from './services/gemini';

const STORAGE_KEY = 'cheenu-jee-protocol-v1';

const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const defaultState: UserProgress = {
      physicsScore: 0,
      chemistryScore: 0,
      mathScore: 0,
      totalQuestionsSolved: 0,
      dailyQuote: "The logic of IIT is waiting for you, Cheenu.",
      lastQuoteDate: '',
      seenQuestions: [],
      tasks: [],
      notificationsEnabled: false
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultState, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error("Failed to load progress:", e);
    }
    
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    const checkAndFetchQuote = async () => {
      const today = new Date().toISOString().split('T')[0];
      if (progress.lastQuoteDate !== today) {
        try {
          const newQuote = await generateMotivationalQuote();
          setProgress(prev => ({
            ...prev,
            dailyQuote: newQuote,
            lastQuoteDate: today
          }));
        } catch (error) {
          console.error("Failed to update quote");
        }
      }
    };
    checkAndFetchQuote();
  }, [progress.lastQuoteDate]);

  useEffect(() => {
    if (!progress.notificationsEnabled) return;

    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 20 && now.getMinutes() === 0) {
        const incompleteTasks = progress.tasks.filter(t => !t.completed).length;
        if (incompleteTasks > 0) {
            new Notification("JEE Prep Reminder", {
                body: `Hey Cheenu, you have ${incompleteTasks} engineering milestones left!`,
                icon: '/favicon.ico'
            });
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [progress.notificationsEnabled, progress.tasks]);

  const handleCorrectAnswer = (subject: Subject) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      newProgress.totalQuestionsSolved += 1;
      
      if (subject === Subject.PHYSICS) newProgress.physicsScore += 1;
      if (subject === Subject.CHEMISTRY) newProgress.chemistryScore += 1;
      if (subject === Subject.MATHEMATICS) newProgress.mathScore += 1;

      return newProgress;
    });
  };

  const handleQuestionAnswered = () => {};

  const handleQuestionGenerated = (text: string) => {
    setProgress(prev => ({
        ...prev,
        seenQuestions: [...(prev.seenQuestions || []).slice(-50), text]
    }));
  };

  const addTask = (text: string) => {
    setProgress(prev => ({
        ...prev,
        tasks: [...prev.tasks, { id: crypto.randomUUID(), text, completed: false }]
    }));
  };

  const toggleTask = (id: string) => {
    setProgress(prev => {
        const newTasks = prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        return { ...prev, tasks: newTasks };
    });
  };

  const deleteTask = (id: string) => {
    setProgress(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };

  const handleImportProgress = (data: UserProgress) => {
    setProgress(data);
  };

  const toggleNotifications = async () => {
    if (!progress.notificationsEnabled) {
        if (!("Notification" in window)) {
            alert("Notification API not supported.");
            return;
        }
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            setProgress(prev => ({ ...prev, notificationsEnabled: true }));
        }
    } else {
        setProgress(prev => ({ ...prev, notificationsEnabled: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-12 overflow-x-hidden">
      <Hero />
      <main className="max-w-7xl mx-auto px-4 md:px-8">
        <Dashboard 
            progress={progress} 
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onToggleNotifications={toggleNotifications}
            onImportProgress={handleImportProgress}
        />
        <QuizSection 
            onCorrectAnswer={handleCorrectAnswer} 
            onQuestionAnswered={handleQuestionAnswered}
            seenQuestions={progress.seenQuestions || []}
            onQuestionGenerated={handleQuestionGenerated}
        />
      </main>
      <AIChat />
      <footer className="mt-20 text-center border-t border-slate-900 pt-12 pb-12">
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2 items-center">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Mission: Cheenu (JEE 2026)</span>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
            </div>
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">© 2025 JEE Protocol Core. Engineered for Cheenu.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
