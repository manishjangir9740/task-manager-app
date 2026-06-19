import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { DeleteModal } from '../components/DeleteModal';
import type { Task, Priority, Stage } from '../types';
import {
  ClipboardList,
  Clock,
  BarChart3,
  CheckCircle2,
  Search,
  ChevronDown
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    tasks,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    createTask,
    updateTask,
    moveTask,
    deleteTask
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | undefined>(undefined);

  // Calculate metrics based on state
  const totalCount = tasks.length;
  const activePendingCount = tasks.filter(t => t.stage === 'To Do' || t.stage === 'In Progress').length;
  const inReviewCount = tasks.filter(t => t.stage === 'Under Review').length;
  const completedCount = tasks.filter(t => t.stage === 'Completed').length;

  // Group tasks by stages
  const getTasksByStage = (stage: Stage) => {
    return tasks.filter((task) => task.stage === stage);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, stage: Stage) => {
    e.preventDefault();
    const taskIdStr = e.dataTransfer.getData('text/plain');
    if (!taskIdStr) return;

    const taskId = parseInt(taskIdStr);
    if (isNaN(taskId)) return;

    try {
      await moveTask(taskId, stage);
    } catch (err) {
      alert('Failed to update stage. Please try again.');
    }
  };

  // Trigger Create/Edit Modal opening
  const handleOpenCreateModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Trigger task saving (Insert or Update)
  const handleSaveTask = async (taskData: {
    title: string;
    description: string;
    priority: Priority;
    stage: Stage;
    due_date: string;
  }) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      await createTask(taskData);
    }
  };

  // Trigger Delete Modal opening
  const handleOpenDeleteModal = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  // Confirm task deletion
  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete.id);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-16 select-none">
      
      {/* Welcome & Create Task Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
            Welcome back, <span className="text-indigo-600 capitalize">{user?.name || 'Manish'}</span>!
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Here is a quick snapshot of your active tasks workspace.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl cursor-pointer shadow-md shadow-indigo-150/40 transition-all duration-200 active:scale-[0.98] outline-none shrink-0"
        >
          <span>+ Create Task</span>
        </button>
      </div>

      {/* Stats Counter Panels (4 columns matching UI Design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Tasks */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
              Total Tasks
            </span>
            <span className="text-3xl font-extrabold text-slate-900 leading-tight">
              {totalCount}
            </span>
          </div>
          <div className="bg-indigo-50 border border-indigo-100/50 text-indigo-600 p-3 rounded-2xl">
            <ClipboardList className="h-6 w-6" />
          </div>
        </div>

        {/* Active Pending */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
              Active Pending
            </span>
            <span className="text-3xl font-extrabold text-amber-500 leading-tight">
              {activePendingCount}
            </span>
          </div>
          <div className="bg-amber-50 border border-amber-100/50 text-amber-500 p-3 rounded-2xl">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* In Review */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
              In Review
            </span>
            <span className="text-3xl font-extrabold text-purple-600 leading-tight">
              {inReviewCount}
            </span>
          </div>
          <div className="bg-purple-50 border border-purple-100/50 text-purple-650 p-3 rounded-2xl">
            <BarChart3 className="h-6 w-6" />
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
              Completed
            </span>
            <span className="text-3xl font-extrabold text-emerald-600 leading-tight">
              {completedCount}
            </span>
          </div>
          <div className="bg-emerald-50 border border-emerald-100/50 text-emerald-500 p-3 rounded-2xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white border border-slate-100 px-6 py-4 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f8fafc] border border-slate-200 focus:border-indigo-500 rounded-full py-3 pl-12 pr-4 outline-none text-slate-800 text-sm placeholder:text-slate-350 transition-colors"
          />
          <Search className="h-4.5 w-4.5 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase whitespace-nowrap">
            Priority Filter:
          </span>
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-2xl py-2.5 pl-4 pr-10 outline-none text-slate-700 text-xs font-semibold cursor-pointer appearance-none transition-colors"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Kanban Board Columns (4 Columns matching layout design) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        
        {/* TO DO Stage */}
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'To Do')}
          className="flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">To Do</span>
            </div>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full px-2 py-0.5">
              {getTasksByStage('To Do').length}
            </span>
          </div>
          {/* List Area */}
          <div className="bg-slate-50/50 border border-dashed border-slate-200/60 p-4 rounded-3xl min-h-[400px] flex flex-col gap-4">
            {getTasksByStage('To Do').length === 0 ? (
              <div className="flex-1 flex items-center justify-center border border-dashed border-slate-200/50 rounded-2xl p-8 text-center text-slate-350 text-[10px] font-bold tracking-wider uppercase">
                No Tasks
              </div>
            ) : (
              getTasksByStage('To Do').map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleOpenEditModal} onDelete={handleOpenDeleteModal} />
              ))
            )}
          </div>
        </div>

        {/* IN PROGRESS Stage */}
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'In Progress')}
          className="flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">In Progress</span>
            </div>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full px-2 py-0.5">
              {getTasksByStage('In Progress').length}
            </span>
          </div>
          {/* List Area */}
          <div className="bg-slate-50/50 border border-dashed border-slate-200/60 p-4 rounded-3xl min-h-[400px] flex flex-col gap-4">
            {getTasksByStage('In Progress').length === 0 ? (
              <div className="flex-1 flex items-center justify-center border border-dashed border-slate-200/50 rounded-2xl p-8 text-center text-slate-350 text-[10px] font-bold tracking-wider uppercase">
                No Tasks
              </div>
            ) : (
              getTasksByStage('In Progress').map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleOpenEditModal} onDelete={handleOpenDeleteModal} />
              ))
            )}
          </div>
        </div>

        {/* UNDER REVIEW Stage */}
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'Under Review')}
          className="flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">Under Review</span>
            </div>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full px-2 py-0.5">
              {getTasksByStage('Under Review').length}
            </span>
          </div>
          {/* List Area */}
          <div className="bg-slate-50/50 border border-dashed border-slate-200/60 p-4 rounded-3xl min-h-[400px] flex flex-col gap-4">
            {getTasksByStage('Under Review').length === 0 ? (
              <div className="flex-1 flex items-center justify-center border border-dashed border-slate-200/50 rounded-2xl p-8 text-center text-slate-350 text-[10px] font-bold tracking-wider uppercase">
                No Tasks
              </div>
            ) : (
              getTasksByStage('Under Review').map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleOpenEditModal} onDelete={handleOpenDeleteModal} />
              ))
            )}
          </div>
        </div>

        {/* COMPLETED Stage */}
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'Completed')}
          className="flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-900 tracking-wider uppercase">Completed</span>
            </div>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full px-2 py-0.5">
              {getTasksByStage('Completed').length}
            </span>
          </div>
          {/* List Area */}
          <div className="bg-slate-50/50 border border-dashed border-slate-200/60 p-4 rounded-3xl min-h-[400px] flex flex-col gap-4">
            {getTasksByStage('Completed').length === 0 ? (
              <div className="flex-1 flex items-center justify-center border border-dashed border-slate-200/50 rounded-2xl p-8 text-center text-slate-350 text-[10px] font-bold tracking-wider uppercase">
                No Tasks
              </div>
            ) : (
              getTasksByStage('Completed').map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleOpenEditModal} onDelete={handleOpenDeleteModal} />
              ))
            )}
          </div>
        </div>

      </div>

      {/* Task Creation & Editing Modal dialog */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />

      {/* Delete Confirmation Modal dialog */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        task={taskToDelete}
      />

    </div>
  );
};
