'use client';

import React, { useRef } from 'react';
import './style.scss';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconSrc?: string;
  isFileType?: boolean;
}

const Input: React.FC<IProps> = ({ iconSrc, readOnly, isFileType, ...props }) => {
  const inputClassName = `input ${iconSrc ? 'input--with-icon' : ''}`;
  const wrapperClassName = `input__wrapper ${readOnly ? 'input__wrapper--readonly' : ''}`;
  let titleText = '';
  if (readOnly) {
    titleText = 'Данное поле нельзя редактировать';
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLabelClick = () => {
    fileInputRef.current?.click();
  };

  if (isFileType) {
    return (
      <div className="input__fileType">
        <label className="button" onClick={handleLabelClick}>
          Загрузить файл
        </label>
        <input
          type="file"
          style={{ display: 'none' }}
          ref={fileInputRef}
          accept="image/*" // Ограничение по типу файла
          {...props}
        />
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      {iconSrc && (
        <span className="input__icon">
          <img src={iconSrc} alt="icon" />
        </span>
      )}
      <input className={inputClassName} title={titleText} readOnly={readOnly} {...props} />
    </div>
  );
};

export default Input;
