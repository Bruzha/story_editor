import React, { ReactNode, FormEventHandler } from 'react';
import './style.scss';

interface IProps {
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export default function Form({ children, onSubmit }: IProps) {
  return (
    <form className="form" onSubmit={onSubmit}>
      {children}
    </form>
  );
}
