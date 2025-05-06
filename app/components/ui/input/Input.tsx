'use client';

import React from 'react';
import './style.scss';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconSrc?: string;
}

const Input: React.FC<IProps> = ({ iconSrc, ...props }) => {
  return (
    <div className="input__wrapper">
      {iconSrc && (
        <span className="input__icon">
          <img src={iconSrc} alt="icon" />
        </span>
      )}
      <input className="input" {...props} />
    </div>
  );
};

export default Input;
