'use client';

import React, { ChangeEvent } from 'react';
import './style.scss';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string; // Добавляем value как пропс (необязательный, чтобы соответствовать React.TextareaHTMLAttributes)
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void; // Добавляем onChange как пропс
}

const Textarea: React.FC<TextareaProps> = ({ value, onChange, ...props }) => {
  // const [text, setText] = useState<string>(value || ''); // Используем пропс value как начальное значение, если он передан

  // const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
  //   setText(event.target.value);
  // };

  return (
    <div className="textarea__wrapper">
      <textarea
        className="textarea"
        value={value} // Используем пропс value для управляемого компонента
        onChange={onChange} // Используем пропс onChange
        {...props}
      />
    </div>
  );
};

export default Textarea;
