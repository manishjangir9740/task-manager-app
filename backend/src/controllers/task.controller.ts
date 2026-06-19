import { Response } from 'express';
import pool from '../config/db';
import { AuthenticatedRequest, Task } from '../types';

/**
 * Get all tasks for the authenticated user, with optional search and priority filtering
 */
export async function getTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = req.user.id;
    const { search, priority } = req.query;

    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params: any[] = [userId];

    if (search && typeof search === 'string' && search.trim() !== '') {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      const searchWildcard = `%${search}%`;
      params.push(searchWildcard, searchWildcard);
    }

    if (priority && typeof priority === 'string' && ['Low', 'Medium', 'High'].includes(priority)) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    // Order by created_at DESC to display newest items first
    query += ' ORDER BY created_at DESC';

    const [tasks] = await pool.query(query, params);
    res.status(200).json(tasks);
  } catch (error: any) {
    console.error('Error in getTasks:', error);
    res.status(500).json({ message: 'Failed to fetch tasks.', error: error.message });
  }
}

/**
 * Create a new task
 */
export async function createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = req.user.id;
    const { title, description, priority, stage, due_date } = req.body;

    if (!title || title.trim() === '') {
      res.status(400).json({ message: 'Task title is required.' });
      return;
    }

    // Validate enum values
    const taskPriority = ['Low', 'Medium', 'High'].includes(priority) ? priority : 'Medium';
    const taskStage = ['To Do', 'In Progress', 'Under Review', 'Completed'].includes(stage) ? stage : 'To Do';
    
    // Parse due date
    const taskDueDate = due_date && due_date.trim() !== '' ? due_date : null;

    const [result]: any = await pool.query(
      'INSERT INTO tasks (user_id, title, description, priority, stage, due_date) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, title.trim(), description ? description.trim() : null, taskPriority, taskStage, taskDueDate]
    );

    const insertedId = result.insertId;

    // Fetch the newly created task to return
    const [insertedTasks]: any = await pool.query(
      'SELECT * FROM tasks WHERE id = ?',
      [insertedId]
    );

    res.status(201).json(insertedTasks[0]);
  } catch (error: any) {
    console.error('Error in createTask:', error);
    res.status(500).json({ message: 'Failed to create task.', error: error.message });
  }
}

/**
 * Update an existing task
 */
export async function updateTask(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = req.user.id;
    const taskId = parseInt(req.params.id);

    if (isNaN(taskId)) {
      res.status(400).json({ message: 'Invalid task ID.' });
      return;
    }

    // Check if task exists and belongs to the user
    const [existingTasks]: any = await pool.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, userId]
    );

    if (existingTasks.length === 0) {
      res.status(404).json({ message: 'Task not found or access denied.' });
      return;
    }

    const currentTask = existingTasks[0];
    const { title, description, priority, stage, due_date } = req.body;

    // Build update parameters dynamically based on what was passed
    const updatedFields: Record<string, any> = {};

    if (title !== undefined) {
      if (title.trim() === '') {
        res.status(400).json({ message: 'Task title cannot be empty.' });
        return;
      }
      updatedFields.title = title.trim();
    }

    if (description !== undefined) {
      updatedFields.description = description ? description.trim() : null;
    }

    if (priority !== undefined) {
      if (!['Low', 'Medium', 'High'].includes(priority)) {
        res.status(400).json({ message: 'Invalid priority level.' });
        return;
      }
      updatedFields.priority = priority;
    }

    if (stage !== undefined) {
      if (!['To Do', 'In Progress', 'Under Review', 'Completed'].includes(stage)) {
        res.status(400).json({ message: 'Invalid board stage.' });
        return;
      }
      updatedFields.stage = stage;
    }

    if (due_date !== undefined) {
      updatedFields.due_date = due_date && due_date.trim() !== '' ? due_date : null;
    }

    // If no fields to update, return current task
    if (Object.keys(updatedFields).length === 0) {
      res.status(200).json(currentTask);
      return;
    }

    // Construct SQL set query
    const setClause = Object.keys(updatedFields)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = Object.values(updatedFields);
    values.push(taskId, userId);

    await pool.query(
      `UPDATE tasks SET ${setClause} WHERE id = ? AND user_id = ?`,
      values
    );

    // Fetch and return the updated task
    const [updatedTasks]: any = await pool.query(
      'SELECT * FROM tasks WHERE id = ?',
      [taskId]
    );

    res.status(200).json(updatedTasks[0]);
  } catch (error: any) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ message: 'Failed to update task.', error: error.message });
  }
}

/**
 * Delete a task
 */
export async function deleteTask(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = req.user.id;
    const taskId = parseInt(req.params.id);

    if (isNaN(taskId)) {
      res.status(400).json({ message: 'Invalid task ID.' });
      return;
    }

    const [result]: any = await pool.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, userId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Task not found or access denied.' });
      return;
    }

    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error: any) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ message: 'Failed to delete task.', error: error.message });
  }
}
