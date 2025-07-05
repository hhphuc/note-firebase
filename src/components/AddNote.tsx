import React, { useState } from 'react';
import { collection, addDoc } from '@firebase/firestore';
import { db } from '../utils/firebase';
import { NoteModal } from './NoteModal';

interface AddNoteProps {
  userId: string;
}

export const AddNote: React.FC<AddNoteProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');

  const handleSave = async () => {
    if (!content.trim()) return;

    try {
      await addDoc(collection(db, 'notes'), {
        content: content.trim(),
        userId,
        timestamp: Date.now(),
      });
      setContent('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  return (
    <>
      <button
        className="add-note-button"
        onClick={() => setIsOpen(true)}
        title="Add Note"
      >
        <span className="material-icons">add</span>
      </button>

      {isOpen && (
        <NoteModal
          content={content}
          onContentChange={setContent}
          onSave={handleSave}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}; 