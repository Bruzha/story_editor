// components/ui/modal/Modal.tsx
import React from 'react';
import Button from '../button/Button';
import './style.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message, onConfirm, onCancel }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h2 className="modalTitle">{title}</h2>
        <p className="modalMessage">{message}</p>
        <div className="modalButtons">
          <Button onClick={onConfirm} name={'Да'} />
          <Button onClick={onCancel} name={'Отмена'} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
