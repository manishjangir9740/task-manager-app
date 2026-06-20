import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import type { Task, Priority, Stage } from '../types';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  searchQuery: string;
  priorityFilter: string;
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (filter: string) => void;
  fetchTasks: () => Promise<void>;
  createTask: (taskData: {
    title: string;
    description?: string;
    priority?: Priority;
    stage?: Stage;
    due_date?: string;
  }) => Promise<Task>;
  updateTask: (id: number, taskData: Partial<Task>) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  moveTask: (id: number, newStage: Stage) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  // Fetch tasks helper
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchQuery.trim() !== '') {
        params.search = searchQuery;
      }
      if (priorityFilter !== 'All') {
        params.priority = priorityFilter;
      }

      const response = await api.get('tasks', { params });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, searchQuery, priorityFilter]);

  // Trigger task refetch when authenticated or search/filter queries change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create task action
  const createTask = async (taskData: {
    title: string;
    description?: string;
    priority?: Priority;
    stage?: Stage;
    due_date?: string;
  }) => {
    try {
      const response = await api.post('tasks', taskData);
      const newTask = response.data;
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create task';
      throw new Error(message);
    }
  };

  // Update task action
  const updateTask = async (id: number, taskData: Partial<Task>) => {
    try {
      const response = await api.put(`tasks/${id}`, taskData);
      const updatedTask = response.data;
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      return updatedTask;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update task';
      throw new Error(message);
    }
  };

  // Delete task action
  const deleteTask = async (id: number) => {
    try {
      await api.delete(`tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete task';
      throw new Error(message);
    }
  };

  // Move task (with Optimistic UI updates)
  const moveTask = async (id: number, newStage: Stage) => {
    const originalTasks = [...tasks];
    
    // Optimistically update frontend local state
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, stage: newStage } : t))
    );

    try {
      await api.put(`tasks/${id}`, { stage: newStage });
    } catch (error) {
      console.error('Failed to move task. Reverting state...', error);
      // Revert if API request fails
      setTasks(originalTasks);
      throw new Error('Failed to update stage on the server.');
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        searchQuery,
        priorityFilter,
        setSearchQuery,
        setPriorityFilter,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        moveTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
