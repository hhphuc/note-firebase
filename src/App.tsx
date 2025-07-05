import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { NoteList } from './components/NoteList';
import { AddNote } from './components/AddNote';
import './index.css';

const AppContent: React.FC = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="app">
      <div className="header-container">
        <h1>Notes</h1>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>
      <NoteList userId={currentUser.uid} />
      <AddNote userId={currentUser.uid} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
