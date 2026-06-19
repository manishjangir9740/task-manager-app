import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Task } from '../types';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  task?: Task;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, task }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !task) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Failed to delete task:', error);
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
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative z-10 mx-4 overflow-hidden border border-slate-100 flex flex-col items-center text-center">
        
        {/* Warning Icon Container */}
        <div className="bg-rose-50 border border-rose-100/40 text-rose-500 rounded-2xl p-4 flex items-center justify-center mb-5">
          <AlertTriangle className="h-7 w-7 text-rose-500" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold text-slate-900 mb-3 select-none">
          Delete Task?
        </h3>

        {/* Warning description */}
        <p className="text-xs text-slate-450 leading-relaxed max-w-sm mb-8 select-none">
          Are you sure you want to delete "<span className="font-bold text-slate-800">{task.title}</span>"? This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3.5 w-full select-none">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 px-6 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-655 text-sm font-semibold rounded-2xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-3 px-6 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-2xl transition-colors cursor-pointer disabled:opacity-50 shadow-sm shadow-rose-100 active:scale-[0.98]"
          >
            {loading ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>

      </div>
    </div>
  );
};
