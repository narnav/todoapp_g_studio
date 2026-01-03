
import { Todo, User, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('zen_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const authApi = {
  login: async (credentials: any): Promise<{ token: string; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }
    return response.json();
  },
  
  register: async (userData: any): Promise<{ token: string; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }
    return response.json();
  }
};

export const todoApi = {
  getTodos: async (): Promise<Todo[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, { headers: getHeaders() });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('zen_token');
          window.location.href = '#/login';
        }
        throw new Error('Network response was not ok');
      }
      return response.json();
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
      if (!response.ok) throw new Error('Failed to save todo');
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
      if (!response.ok) throw new Error('Failed to update todo');
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
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete todo');
    } catch (e) {
      const todos = await todoApi.getTodos();
      const filtered = todos.filter(t => t.id !== id);
      localStorage.setItem('zen_todos', JSON.stringify(filtered));
    }
  }
};
