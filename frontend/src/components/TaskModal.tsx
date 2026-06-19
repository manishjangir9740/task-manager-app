import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import type { Task, Priority, Stage } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    title: string;
    description: string;
    priority: Priority;
    stage: Stage;
    due_date: string;
  }) => Promise<void>;
  task?: Task; // If provided, we are editing
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [stage, setStage] = useState<Stage>('To Do');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Set form values if editing
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setStage(task.stage);
      
      if (task.due_date) {
        // Format ISO date (YYYY-MM-DDThh:mm:ss.000Z) to YYYY-MM-DD for date inputs
        const formattedDate = task.due_date.split('T')[0];
        setDueDate(formattedDate);
      } else {
        setDueDate('');
      }
    } else {
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setStage('To Do');
      setDueDate('');
    }
    setError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (title.trim() === '') {
      setError('Task title is required.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        title,
        description,
        priority,
        stage,
        due_date: dueDate,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with Blur */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Dialog Card */}
      <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl relative z-10 mx-4 overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl border border-indigo-100">
              <Plus className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {task ? 'Edit Existing Task' : 'Create New Task'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Close</span>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Form Scroll Area */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-2xl flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Task Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Configure JWT validation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-slate-200 focus:border-indigo-500 rounded-2xl p-4 text-slate-800 text-sm placeholder:text-slate-300 outline-none transition-colors"
            />
          </div>

          {/* Description input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Task Description
            </label>
            <textarea
              placeholder="Detail the actions needed..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-slate-200 focus:border-indigo-500 rounded-2xl p-4 text-slate-800 text-sm placeholder:text-slate-300 outline-none transition-colors resize-none"
            />
          </div>

          {/* Dropdowns row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Priority select */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                Priority Level
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-2xl p-3.5 text-slate-700 text-sm outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="Low">📁 Low</option>
                  <option value="Medium">⚡ Medium</option>
                  <option value="High">🔥 High</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                  {/* Custom select chevron */}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Board Stage select */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                Board Stage
              </label>
              <div className="relative">
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as Stage)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-2xl p-3.5 text-slate-700 text-sm outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* Due date input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border border-slate-200 focus:border-indigo-500 rounded-2xl p-4 text-slate-800 text-sm outline-none transition-colors cursor-pointer"
            />
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-semibold rounded-2xl cursor-pointer disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-2xl cursor-pointer shadow-md shadow-indigo-100 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {loading ? 'Saving...' : task ? 'Update Task' : 'Save Task'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
