
import React, { useState } from 'react';
import { Todo, Priority } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDecompose: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onDecompose }) => {
  const [isDecomposing, setIsDecomposing] = useState(false);

  const priorityColors = {
    [Priority.LOW]: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    [Priority.MEDIUM]: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    [Priority.HIGH]: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
  };

  const handleDecomposeClick = async () => {
    setIsDecomposing(true);
    await onDecompose(todo.id);
    setIsDecomposing(false);
  };

  return (
    <div className={`group p-4 rounded-2xl border transition-all duration-200 ${
      todo.completed 
        ? 'bg-slate-900/50 border-slate-800/50 opacity-50' 
        : 'bg-slate-800 border-slate-700 shadow-sm hover:border-blue-500/50'
    }`}>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onToggle(todo.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            todo.completed 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'border-slate-600 hover:border-blue-500 bg-slate-950'
          }`}
        >
          {todo.completed && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${priorityColors[todo.priority]}`}>
              {todo.priority}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{todo.category}</span>
          </div>
          <p className={`font-medium truncate ${todo.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
            {todo.title}
          </p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!todo.subtasks && !todo.completed && (
            <button 
              onClick={handleDecomposeClick}
              disabled={isDecomposing}
              className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-all"
              title="AI Break Down"
            >
              {isDecomposing ? (
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                  <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
                </svg>
              )}
            </button>
          )}
          <button 
            onClick={() => onDelete(todo.id)}
            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {todo.subtasks && todo.subtasks.length > 0 && (
        <div className="mt-4 ml-10 pl-4 border-l-2 border-slate-700 space-y-2">
          {todo.subtasks.map((sub, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
               <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
               {sub}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoItem;
