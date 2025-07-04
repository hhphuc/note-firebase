import React from 'react';
import { NoteList } from './components/NoteList';
import { AddNote } from './components/AddNote';
import './index.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>Phuc's Notes</h1>
      </header>
      <main>
        <AddNote />
        <NoteList />
      </main>
    </div>
  );
}

export default App;
