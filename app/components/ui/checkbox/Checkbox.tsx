import React, { ChangeEvent, useState } from 'react'; // Добавлено useState
import { UseFormRegisterReturn, useFormContext } from 'react-hook-form'; // Добавлен useFormContext
import './style.scss';

interface CheckboxProps {
  label: string;
  value: string;
  register: UseFormRegisterReturn;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, value, register }) => {
  const { getValues, setValue } = useFormContext(); // Получаем getValues и setValue
  const [isChecked, setIsChecked] = useState<boolean>(false); //  Добавлено: состояние для чекбокса

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    const fieldName = register.name;
    const currentValue = getValues(fieldName) || []; // Получаем текущие значения
    const newValue = checked ? [...currentValue, value] : currentValue.filter((item: string) => item !== value);
    setValue(fieldName, newValue); // Устанавливаем новое значение в форму
    setIsChecked(checked); // Обновляем локальное состояние
  };

  return (
    <div className="checkbox">
      <label className="checkbox__label">
        <div className="checkbox__wrapper">
          <input
            className="checkbox__input-hidden"
            type="checkbox"
            {...register}
            value={value}
            onChange={handleChange}
            checked={isChecked} // Связываем состояние input с isChecked
          />
          <span className={`checkbox__custom ${isChecked ? 'checkbox__custom--checked' : ''}`}></span>
        </div>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
