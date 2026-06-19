import { Request } from 'express';

export interface UserPayload {
  id: number;
  name: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  priority: 'Low' | 'Medium' | 'High';
  stage: 'To Do' | 'In Progress' | 'Under Review' | 'Completed';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}
