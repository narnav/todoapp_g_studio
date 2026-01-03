
import { Todo, User, ApiResponse } from '../types';

// In a real app, this would be your Flask backend URL
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Note: This service includes logic to fallback to LocalStorage if the Flask 
 * server isn't running, ensuring a functional experience in the demo environment.
 */

const getHeaders = () => {
  const token = localStorage.getItem('zen_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const todoApi = {
  getTodos: async (): Promise<Todo[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, { headers: getHeaders() });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data;
    } catch (e) {
      console.warn('Backend not available, using local storage fallback');
      const local = localStorage.getItem('zen_todos');
      return local ? JSON.parse(local) : [];
    }
  },

  saveTodo: async (todo: Todo): Promise<Todo> => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(todo)
      });
      return await response.json();
    } catch (e) {
      const todos = await todoApi.getTodos();
      const updated = [...todos, todo];
      localStorage.setItem('zen_todos', JSON.stringify(updated));
      return todo;
    }
  },

  updateTodo: async (id: string, updates: Partial<Todo>): Promise<Todo | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      return await response.json();
    } catch (e) {
      const todos = await todoApi.getTodos();
      const updated = todos.map(t => t.id === id ? { ...t, ...updates } : t);
      localStorage.setItem('zen_todos', JSON.stringify(updated));
      return updated.find(t => t.id === id) || null;
    }
  },

  deleteTodo: async (id: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
    } catch (e) {
      const todos = await todoApi.getTodos();
      const filtered = todos.filter(t => t.id !== id);
      localStorage.setItem('zen_todos', JSON.stringify(filtered));
    }
  }
};
