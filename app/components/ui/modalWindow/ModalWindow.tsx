import React from 'react';
import './style.scss';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const Modal: React.FC<IProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Подтверждение',
  message,
  confirmText = 'Да',
  cancelText = 'Нет',
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal__body">
          <p className="modal__message">{message}</p>
        </div>

        <div className="modal__footer">
          <button className="modal__button modal__button--confirm" onClick={onConfirm}>
            {confirmText}
          </button>
          <button className="modal__button modal__button--cancel" onClick={onClose}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
