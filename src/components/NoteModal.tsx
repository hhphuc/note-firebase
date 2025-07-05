import React from 'react';

interface NoteModalProps {
  content: string;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  content,
  onContentChange,
  onSave,
  onClose,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="add-note-modal">
      <div className="add-note-content">
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Type your note..."
            required
            autoFocus
          />
          <div className="modal-buttons">
            <button 
              type="button" 
              onClick={onClose}
              className="icon-button"
              title="Cancel"
            >
              <span className="material-icons">close</span>
            </button>
            <button 
              type="submit" 
              className="icon-button"
              title="Save"
            >
              <span className="material-icons">check</span>
            </button>
          </div>
        </form>
      </div>
      <div 
        className="modal-backdrop"
        onClick={onClose}
      />
    </div>
  );
}; 