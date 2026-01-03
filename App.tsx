
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { AuthState } from './types';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const savedToken = localStorage.getItem('zen_token');
    const savedUser = localStorage.getItem('zen_user');
    return {
      token: savedToken,
      user: savedUser ? JSON.parse(savedUser) : null,
      isAuthenticated: !!savedToken
    };
  });

  const handleLogin = (data: { token: string; user: any }) => {
    localStorage.setItem('zen_token', data.token);
    localStorage.setItem('zen_user', JSON.stringify(data.user));
    setAuth({
      token: data.token,
      user: data.user,
      isAuthenticated: true
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('zen_token');
    localStorage.removeItem('zen_user');
    setAuth({
      token: null,
      user: null,
      isAuthenticated: false
    });
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
        <Routes>
          <Route 
            path="/login" 
            element={!auth.isAuthenticated ? <Auth onLogin={handleLogin} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={auth.isAuthenticated ? <Dashboard auth={auth} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
