'use client';

import React, { ChangeEvent } from 'react';
import './style.scss';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea: React.FC<TextareaProps> = ({ value, onChange, ...props }) => {
  return (
    <div className="textarea__wrapper">
      <textarea className="textarea" value={value} onChange={onChange} {...props} />
    </div>
  );
};

export default Textarea;
