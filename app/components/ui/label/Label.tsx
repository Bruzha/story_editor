import React from 'react';
import './style.scss';

interface IProps {
  text: string;
  children: React.ReactNode;
}

export default function Label({ text, children }: IProps) {
  return (
    <label htmlFor={text}>
      {text}
      {children}
    </label>
  );
}
