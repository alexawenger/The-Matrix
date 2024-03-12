import React from 'react';
import '../index.css'; // Assuming you create a Modal.css for styling

const DistanceModal = ({ isDistModalOpen, onDistModalClose }) => {
  if (!isDistModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={onDistModalClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Log a Distance Run</h2>
        <p>Here you can add the form or information to log a distance run.</p>
        <button onClick={onDistModalClose}>Close</button>
      </div>
    </div>
  );
};

export default DistanceModal;
