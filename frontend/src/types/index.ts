export interface User {
  id: number;
  name: string;
  email: string;
}

export type Priority = 'Low' | 'Medium' | 'High';

export type Stage = 'To Do' | 'In Progress' | 'Under Review' | 'Completed';

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  priority: Priority;
  stage: Stage;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
}
