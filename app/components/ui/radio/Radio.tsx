import React from 'react';
import { useFormContext } from 'react-hook-form';
import './style.scss';

interface RadioProps {
  value: string;
  label: string;
  key?: string;
}

const Radio: React.FC<RadioProps> = ({ key, value, label }) => {
  const { register } = useFormContext();

  return (
    <div className="radio">
      <label className="radio__label" key={key}>
        <div className="radio__wrapper">
          <input className="radio__input-hidden" type="radio" value={value} {...register('filter')} />
          <span className="radio__custom"></span>
        </div>
        {label}
      </label>
    </div>
  );
};

export default Radio;
