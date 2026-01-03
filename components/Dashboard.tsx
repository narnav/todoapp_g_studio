
import React, { useState, useEffect, useCallback } from 'react';
import { Todo, Priority, AuthState } from '../types';
import { todoApi } from '../services/api';
import { decomposeTask, getDailyInsights } from '../services/gemini';
import TodoItem from './TodoItem';
import TodoInput from './TodoInput';
import Stats from './Stats';

interface DashboardProps {
  auth: AuthState;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ auth, onLogout }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<{ tip: string; priorityAdvice: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    const data = await todoApi.getTodos();
    setTodos(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    if (todos.length > 0 && !aiInsight) {
      getDailyInsights(todos).then(insight => setAiInsight(insight));
    }
  }, [todos, aiInsight]);

  const handleAddTodo = async (title: string, priority: Priority, category: string) => {
    const newTodo: Todo = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      priority,
      category,
      completed: false,
      createdAt: Date.now()
    };
    const saved = await todoApi.saveTodo(newTodo);
    setTodos(prev => [saved, ...prev]);
  };

  const handleToggle = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const updated = await todoApi.updateTodo(id, { completed: !todo.completed });
    if (updated) {
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
    }
  };

  const handleDelete = async (id: string) => {
    await todoApi.deleteTodo(id);
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const handleDecompose = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    const subtasks = await decomposeTask(todo.title);
    const updated = await todoApi.updateTodo(id, { subtasks });
    if (updated) {
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
    }
  };

  const categories = ['All', ...Array.from(new Set(todos.map(t => t.category)))];
  const filteredTodos = activeCategory === 'All' 
    ? todos 
    : todos.filter(t => t.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Welcome, {auth.user?.username}
          </h1>
          <p className="text-slate-400">Capture your ideas, organize your life.</p>
        </div>
        <button 
          onClick={onLogout}
          className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors"
        >
          Logout
        </button>
      </header>

      {aiInsight && (
        <div className="mb-8 p-4 bg-indigo-900/20 border border-indigo-500/20 rounded-2xl flex gap-4 items-start animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-indigo-600 text-white p-2 rounded-lg mt-1 shadow-lg shadow-indigo-500/20">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95V11a1 1 0 11-2 0V2a1 1 0 011.103-.953zM8.905 2.735a1 1 0 01.593 1.822l-4 3a1 1 0 01-1.2 0l-4-3a1 1 0 01.593-1.822l4 3 4-3zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
             </svg>
          </div>
          <div>
            <h3 className="font-semibold text-indigo-300">AI Daily Focus</h3>
            <p className="text-indigo-200/80 text-sm leading-relaxed">{aiInsight.tip}</p>
            <p className="text-indigo-400/60 text-xs mt-1 italic">{aiInsight.priorityAdvice}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <TodoInput onAdd={handleAddTodo} />
          
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-slate-500">Loading your focus...</div>
            ) : filteredTodos.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700">
                No tasks found in this category. Time to relax!
              </div>
            ) : (
              filteredTodos.map(todo => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  onToggle={handleToggle} 
                  onDelete={handleDelete}
                  onDecompose={handleDecompose}
                />
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Stats todos={todos} />
          <div className="p-6 bg-slate-800 rounded-2xl shadow-sm border border-slate-700">
             <h3 className="font-semibold mb-4 text-slate-200">Productivity Hacks</h3>
             <ul className="text-sm text-slate-400 space-y-3">
                <li className="flex gap-2">
                   <span className="text-blue-400">•</span>
                   <span>Try the 5-minute rule: If it takes less than 5 mins, do it now.</span>
                </li>
                <li className="flex gap-2">
                   <span className="text-blue-400">•</span>
                   <span>Batch similar tasks together to maintain focus flow.</span>
                </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
