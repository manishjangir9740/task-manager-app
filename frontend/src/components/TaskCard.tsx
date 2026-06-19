import React from 'react';
import { Calendar, Edit3, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Task, Priority, Stage } from '../types';
import { useTasks } from '../context/TaskContext';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const { moveTask } = useTasks();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  // Helper to format due dates nicely
  const formatDueDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Styles for Priority badges
  const getPriorityStyle = (p: Priority) => {
    switch (p) {
      case 'High':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Medium':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Low':
        return 'bg-slate-50 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  // Emojis/Icons for Priority
  const getPriorityIndicator = (p: Priority) => {
    switch (p) {
      case 'High':
        return '⚡';
      case 'Medium':
        return '🔥';
      case 'Low':
        return '📁';
    }
  };

  // Stage index calculation
  const stages: Stage[] = ['To Do', 'In Progress', 'Under Review', 'Completed'];
  const currentIdx = stages.indexOf(task.stage);
  const isFirstStage = currentIdx === 0;
  const isLastStage = currentIdx === stages.length - 1;

  const handlePrevStage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFirstStage) {
      moveTask(task.id, stages[currentIdx - 1]);
    }
  };

  const handleNextStage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLastStage) {
      moveTask(task.id, stages[currentIdx + 1]);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white border border-slate-100 hover:border-indigo-100 p-5 rounded-2xl shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all group relative flex flex-col justify-between min-h-[140px] select-none"
    >
      <div>
        {/* Header containing Priority & Actions */}
        <div className="flex items-center justify-between mb-3.5">
          <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full border uppercase flex items-center gap-1 ${getPriorityStyle(task.priority)}`}>
            <span>{getPriorityIndicator(task.priority)}</span>
            <span>{task.priority}</span>
          </span>

          {/* Card Actions: Edit and Delete */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Edit Task"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1.5 capitalize">
          {task.title}
        </h3>

        {/* Description snippet */}
        {task.description && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer Area with Date & Stage Changers */}
      <div className="mt-4 flex flex-col gap-3">
        {task.due_date && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <Calendar className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span>{formatDueDate(task.due_date)}</span>
          </div>
        )}

        {/* Stage Navigation row */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 select-none">
          <button
            onClick={handlePrevStage}
            disabled={isFirstStage}
            type="button"
            className={`p-1.5 rounded-lg border flex items-center justify-center transition-colors ${
              isFirstStage
                ? 'bg-slate-50 border-slate-100 text-slate-350 cursor-not-allowed'
                : 'bg-white border-slate-200 text-slate-650 hover:bg-indigo-700 hover:text-white cursor-pointer'
            }`}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <span className="text-[10px] font-bold text-slate-400 tracking-wider">
            STAGE
          </span>

          <button
            onClick={handleNextStage}
            disabled={isLastStage}
            type="button"
            className={`p-1.5 rounded-lg border flex items-center justify-center transition-colors ${
              isLastStage
                ? 'bg-slate-50 border-slate-100 text-slate-350 cursor-not-allowed'
                : 'bg-slate-50 border-slate-100 text-slate-350 hover:bg-indigo-700 hover:text-white cursor-pointer shadow-sm shadow-indigo-100'
            }`}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
