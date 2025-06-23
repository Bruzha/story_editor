// components/ui/modal/Modal.tsx
import React from 'react';
import Button from '../button/Button';
import './style.scss';
import '../form/style.scss';
import Title from '../title/Title';

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
    <div className="mod" onClick={onClose}>
      <div className="mod__content form" onClick={(e) => e.stopPropagation()}>
        <Title text={title}></Title>
        <p className="mod__message">{message}</p>
        <div className="mod__buttons">
          <Button onClick={onConfirm} name={'Да'} />
          <Button onClick={onCancel} name={'Отмена'} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
