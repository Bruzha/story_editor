import React, { ChangeEvent, useState } from 'react';
import './style.scss';

interface CheckboxProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, value, onChange }) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setIsChecked(checked);
    onChange(event);
  };

  return (
    <div className="checkbox">
      <label className="checkbox__label">
        <div className="checkbox__wrapper">
          <input
            className="checkbox__input-hidden"
            type="checkbox"
            value={value}
            onChange={handleChange}
            checked={isChecked}
          />
          <span className={`checkbox__custom ${isChecked ? 'checkbox__custom--checked' : ''}`}></span>
        </div>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
