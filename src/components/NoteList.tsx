import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, deleteDoc, doc, where, updateDoc } from '@firebase/firestore';
import { db } from '../utils/firebase';
import { NoteModal } from './NoteModal';
import { Note } from '../types/Note';

interface NoteListProps {
  userId: string;
}

export const NoteList: React.FC<NoteListProps> = ({ userId }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', userId)
      // Temporarily removed orderBy until index is ready
      // orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notesList = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            content: doc.data().content,
            timestamp: doc.data().timestamp,
            userId: doc.data().userId,
          }))
          .filter((note) => note.userId === userId)
          // Sort in memory instead
          .sort((a, b) => b.timestamp - a.timestamp);
        
        setNotes(notesList);
      },
      (error) => {
        console.error('Error in snapshot listener:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch notes');
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const handleDelete = async (noteId: string) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await deleteDoc(noteRef);
    } catch (error) {
      console.error('Error deleting note:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete note');
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setEditContent(note.content);
  };

  const handleSave = async () => {
    if (!selectedNote || !editContent.trim()) return;

    try {
      const noteRef = doc(db, 'notes', selectedNote.id);
      await updateDoc(noteRef, {
        content: editContent.trim(),
        timestamp: Date.now(),
      });
      setSelectedNote(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating note:', error);
      setError(error instanceof Error ? error.message : 'Failed to update note');
    }
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="note-list">
      {notes.length === 0 ? (
        <p className="empty-notes">No notes yet. Add one!</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id} className="note-item" onClick={() => handleNoteClick(note)}>
              <div className="note-content">
                <pre className="note-preview">{note.content}</pre>
                <small>
                  {new Date(note.timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </small>
              </div>
              <button
                className="icon-button delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(note.id);
                }}
                title="Delete"
              >
                <span className="material-icons">delete</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {selectedNote && (
        <NoteModal
          content={editContent}
          onContentChange={setEditContent}
          onSave={handleSave}
          onClose={() => {
            setSelectedNote(null);
            setEditContent('');
          }}
        />
      )}
    </div>
  );
}; 