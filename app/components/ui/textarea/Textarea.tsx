'use client';

import React from 'react';
import './style.scss';

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ ...props }) => {
  return (
    <div className="textarea__wrapper">
      <textarea className="textarea" {...props} />
    </div>
  );
};

export default Textarea;
