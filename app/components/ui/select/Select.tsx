'use client';

import React from 'react';
import './style.scss';

interface IProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

const Select: React.FC<IProps> = ({ options, ...props }) => {
  return (
    <div className="select__wrapper">
      <select className="select" {...props}>
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
