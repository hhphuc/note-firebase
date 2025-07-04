import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Note } from '../types/Note';
import { NoteModal } from './NoteModal';

export const NoteList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    // Create a query for notes, ordered by updatedAt
    const q = query(collection(db, 'notes'), orderBy('updatedAt', 'desc'));

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesList: Note[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('data :>> ', data);
        notesList.push({
          id: doc.id,
          content: data.content,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      });
      setNotes(notesList);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleDelete = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'notes', noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  const handleSave = async () => {
    if (!editingId || !editContent.trim()) return;

    try {
      await updateDoc(doc(db, 'notes', editingId), {
        content: editContent.trim(),
        updatedAt: serverTimestamp()
      });
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Failed to update note');
    }
  };

  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleClose = () => {
    setEditingId(null);
    setEditContent('');
  };

  const getNoteParts = (content: string) => {
    const lines = content.split('\n');
    const title = lines[0] || 'Untitled';
    const body = lines.slice(1).join('\n').trim();
    return { title, body };
  };

  return (
    <div className="note-list">
      {notes.length === 0 ? (
        <p className="empty-notes">No notes yet. Create your first note!</p>
      ) : (
        <ul>
          {notes.map((note) => {
            const { title, body } = getNoteParts(note.content);
            
            if (editingId === note.id) {
              return (
                <NoteModal
                  key={note.id}
                  content={editContent}
                  onContentChange={setEditContent}
                  onSave={handleSave}
                  onClose={handleClose}
                />
              );
            }

            return (
              <li key={note.id} onClick={() => startEditing(note)} className="note-item">
                <div className="note-header">
                  <h3>{title}</h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                    className="icon-button delete-button"
                    title="Delete"
                  >
                    <span className="material-icons">delete_outline</span>
                  </button>
                </div>
                {body && (
                  <pre className="note-preview">
                    {body}
                  </pre>
                )}
                <small>
                  Last updated: {note.updatedAt?.toLocaleDateString()}
                </small>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}; 