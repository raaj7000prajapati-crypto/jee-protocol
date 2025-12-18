import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { UserProgress, Subject } from '../types';
import { Target, Quote, Activity, Zap, Cpu, Download, Database } from 'lucide-react';
import ToDoList from './ToDoList';

interface DashboardProps {
  progress: UserProgress;
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onToggleNotifications: () => void;
  onImportProgress: (data: UserProgress) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  progress, 
  onAddTask, 
  onToggleTask, 
  onDeleteTask,
  onToggleNotifications
}) => {
  const chartValues = [
    { name: Subject.PHYSICS, value: progress.physicsScore, color: '#60a5fa' },
    { name: Subject.CHEMISTRY, value: progress.chemistryScore, color: '#38bdf8' },
    { name: Subject.MATHEMATICS, value: progress.mathematicsScore, color: '#a78bfa' },
  ];

  const hasData = chartValues.some(d => d.value > 0);
  const chartData = hasData 
    ? chartValues 
    : [{ name: 'Awaiting Solves', value: 1, color: '#1e293b' }];

  const handleExportFile = () => {
    const dataStr = JSON.stringify(progress, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `cheenu_jee_protocol_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div id="stats-section" className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-16 px-0 w-full overflow-hidden">
      {/* Personalized Quote Card */}
      <div className="lg:col-span-3 glass-card heartbeat-glow p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden w-full">
        <div className="hidden md:flex p-5 bg-blue-500/10 text-blue-400 rounded-3xl shrink-0">
            <Quote size={32} className="fill-current opacity-50" />
        </div>
        <div className="relative z-10 flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
               <Database size={12} className="text-blue-500 animate-pulse" />
               <h3 className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.3em]">Local Protocol: ACTIVE</h3>
            </div>
            <p className="text-slate-100 text-lg md:text-2xl font-semibold leading-snug italic">
              "{progress.dailyQuote || "The logic you build today creates the world of tomorrow."}"
            </p>
        </div>
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <Zap size={200} className="fill-blue-500" />
        </div>
      </div>

      {/* Main Stats Area */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Solved Questions Count */}
        <div className="glass-card p-6 md:p-10 rounded-[2.5rem] border-blue-500/20 bg-gradient-to-br from-slate-900/80 to-slate-950 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Target size={120} />
            </div>
            <div className="relative z-10">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block">IIT Mastery</span>
              <div className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">{progress.totalQuestionsSolved}</div>
              <p className="text-slate-400 text-sm font-medium">High-yield JEE problems cracked</p>
              
              <button 
                onClick={handleExportFile}
                className="mt-8 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors"
              >
                <Download size={14} /> Local Backup (.json)
              </button>
            </div>
        </div>

        {/* Chart Card */}
        <div className="glass-card p-6 md:p-8 rounded-[2.5rem] flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-slate-400 font-bold mb-4 text-[10px] uppercase tracking-widest self-start">Analytical Vitals</h3>
          <div className="w-full h-[180px] md:h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={hasData ? 8 : 0}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2">
              <Activity size={14} className="text-blue-500/50 mb-1" />
              <span className="text-3xl font-bold text-white leading-none">
                {progress.physicsScore + progress.chemistryScore + progress.mathematicsScore}
              </span>
            </div>
          </div>
          <div className="w-full mt-6 flex gap-4 justify-around">
              {chartValues.map((subject) => (
                  <div key={subject.name} className="flex flex-col items-center">
                      <span className="text-[8px] text-slate-500 font-bold uppercase mb-1">{subject.name}</span>
                      <div className="w-8 md:w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full transition-all duration-1000" style={{ backgroundColor: subject.color, width: '100%' }}></div>
                      </div>
                  </div>
              ))}
          </div>
        </div>
      </div>
      
      {/* Right Col: To-Do */}
      <div className="h-full lg:col-span-1">
        <ToDoList 
            tasks={progress.tasks || []} 
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            notificationsEnabled={progress.notificationsEnabled || false}
            onToggleNotifications={onToggleNotifications}
        />
      </div>
      
       {/* Support Message */}
       <div className="bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/20 glass-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] lg:col-span-3 flex items-center justify-between border-blue-500/10 gap-4">
         <div className="flex-1">
            <h3 className="font-extrabold text-xl md:text-2xl mb-2 text-white italic flex items-center gap-3">
              Future IITian: Cheenu <Cpu size={24} className="text-blue-400" />
            </h3>
            <p className="text-slate-400 text-[11px] md:text-sm max-w-2xl font-medium leading-relaxed">
                "Logic is your strength, Cheenu. Your progress is kept safe in your browser storage automatically. Every milestone you complete tonight will be waiting for you tomorrow morning. I'm ALOO, and I've locked your data in."
            </p>
         </div>
         <div className="hidden sm:flex p-5 bg-white/5 rounded-full shrink-0">
            <Zap className="text-blue-400 fill-blue-400/20 w-6 h-6" />
         </div>
       </div>
    </div>
  );
};

export default Dashboard;