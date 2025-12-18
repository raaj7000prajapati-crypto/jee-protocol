import React, { useState } from 'react';
import { Plus, Trash2, CheckSquare, Square, Bell, BellOff, ListTodo, Activity } from 'lucide-react';
import { Task } from '../types';

interface ToDoListProps {
  tasks: Task[]; 
  onAddTask: (text: string) => void; 
  onToggleTask: (id: string) => void; 
  onDeleteTask: (id: string) => void;
  notificationsEnabled: boolean; 
  onToggleNotifications: () => void;
}

const ToDoList: React.FC<ToDoListProps> = ({ tasks, onAddTask, onToggleTask, onDeleteTask, notificationsEnabled, onToggleNotifications }) => {
  const [newTask, setNewTask] = useState('');
  const handleAdd = () => { if (newTask.trim()) { onAddTask(newTask); setNewTask(''); } };

  return (
    <div className="glass-card rounded-[2.5rem] p-6 md:p-8 h-full flex flex-col min-h-[350px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-200 flex items-center gap-3 text-[10px] uppercase tracking-widest">
          <ListTodo className="text-blue-500" size={16} /> Cheenu's Protocol
        </h3>
        <button onClick={onToggleNotifications} className={`p-2 rounded-xl transition-all ${notificationsEnabled ? 'text-blue-400' : 'text-slate-600 hover:text-slate-400'}`}>
          {notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <input 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()} 
          placeholder="New milestone..." 
          className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 px-4 py-3 rounded-2xl text-[13px] focus:outline-none focus:border-blue-500/30 placeholder:text-slate-700" 
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20">
          <Plus size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar max-h-[300px] md:max-h-none pr-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-30">
            <Activity size={32} className="mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Protocol Empty</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${task.completed ? 'opacity-40 bg-slate-950/20' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}>
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <button onClick={() => onToggleTask(task.id)} className={`transition-all ${task.completed ? 'text-blue-500' : 'text-slate-600 hover:text-blue-400'}`}>
                  {task.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>
                <span className={`text-[13px] font-medium truncate ${task.completed ? 'line-through' : 'text-slate-100'}`}>{task.text}</span>
              </div>
              <button onClick={() => onDeleteTask(task.id)} className="text-slate-700 hover:text-rose-500 transition-colors ml-2"><Trash2 size={16} /></button>
            </div>
          ))
        )}
      </div>
      
      {tasks.length > 0 && (
        <div className="mt-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest text-center">
          {tasks.filter(t => t.completed).length} of {tasks.length} mastered
        </div>
      )}
    </div>
  );
};

export default ToDoList;