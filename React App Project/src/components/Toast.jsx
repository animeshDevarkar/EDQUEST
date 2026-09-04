import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toastMessage, toastType = 'info', onClose }) => {
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toastMessage, onClose]);

  if (!toastMessage) return null;

  const getIcon = () => {
    switch (toastType) {
      case 'success': return <CheckCircle2 size={18} />;
      case 'danger': return <AlertCircle size={18} />;
      default: return <Info size={18} />;
    }
  };

  return (
    <div className={`toast-container toast-${toastType}`} role="status" aria-live="polite">
      <div className="toast-icon">{getIcon()}</div>
      <span className="toast-message">{toastMessage}</span>
      <button className="toast-close-btn" onClick={onClose} aria-label="Dismiss toast">
        <X size={14} />
      </button>
    </div>
  );
};
