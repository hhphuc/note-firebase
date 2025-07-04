import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { NoteModal } from './NoteModal';

export const AddNote: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Please enter some content');
      return;
    }

    try {
      await addDoc(collection(db, 'notes'), {
        content: content.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Clear form and collapse
      setContent('');
      setIsExpanded(false);
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    }
  };

  const handleClose = () => {
    setContent('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button 
        className="add-note-button"
        onClick={() => setIsExpanded(true)}
      >
        <span className="material-icons">add</span>
      </button>
    );
  }

  return (
    <NoteModal
      content={content}
      onContentChange={setContent}
      onSave={handleSave}
      onClose={handleClose}
    />
  );
}; 