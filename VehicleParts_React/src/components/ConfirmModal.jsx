import React from 'react';
import { modalStyles } from '../styles/ConfirmModal.styles';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <div style={modalStyles.accentBar} />
        <h3 style={modalStyles.title}>{title}</h3>
        <p style={modalStyles.message}>{message}</p>
        <div style={modalStyles.actions}>
          <button 
            onClick={onCancel} 
            style={modalStyles.cancelBtn}
            className="modal-cancel-hover"
          >
            DISMISS
          </button>
          <button 
            onClick={onConfirm} 
            style={modalStyles.confirmBtn}
            className="modal-confirm-hover"
          >
            CONFIRM DELETE
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal-confirm-hover:hover {
          background-color: #c0392b !important;
          box-shadow: 0 0 15px rgba(231, 76, 60, 0.3);
        }
        .modal-cancel-hover:hover {
          border-color: #555 !important;
          color: #999 !important;
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal;