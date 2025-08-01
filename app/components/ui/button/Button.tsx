'use client';
import './style.scss';

interface IProps {
  name: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({ name, type = 'button', onClick, disabled, className }: IProps) {
  return (
    <button className={`button ${className || ''}`} type={type} onClick={onClick} disabled={disabled}>
      {name}
    </button>
  );
}
