'use client';

import React from 'react';
import './style.scss';

interface IProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void; // Изменяем тип onChange
}

const Select: React.FC<IProps> = ({ options, onChange, ...props }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value; // Получаем значение из события
    if (onChange) {
      onChange(event); // Передаем событие в onChange
    }
    console.log('Выбранное значение:', value);
  };

  return (
    <div className="select__wrapper">
      <select className="select" {...props} onChange={handleChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
