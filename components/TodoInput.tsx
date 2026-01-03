
import React, { useState } from 'react';
import { Priority } from '../types';

interface TodoInputProps {
  onAdd: (title: string, priority: Priority, category: string) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [category, setCategory] = useState('Personal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, priority, category);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-slate-800 rounded-2xl shadow-sm border border-slate-700">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-300 outline-none cursor-pointer hover:border-slate-600 transition-colors appearance-none"
          >
            <option className="bg-slate-900">Personal</option>
            <option className="bg-slate-900">Work</option>
            <option className="bg-slate-900">Learning</option>
            <option className="bg-slate-900">Health</option>
            <option className="bg-slate-900">Finances</option>
          </select>
          <select 
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-300 outline-none cursor-pointer hover:border-slate-600 transition-colors appearance-none"
          >
            <option className="bg-slate-900" value={Priority.LOW}>Low</option>
            <option className="bg-slate-900" value={Priority.MEDIUM}>Medium</option>
            <option className="bg-slate-900" value={Priority.HIGH}>High</option>
          </select>
          <button 
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
          >
            Add
          </button>
        </div>
      </div>
    </form>
  );
};

export default TodoInput;
