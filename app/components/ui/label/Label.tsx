'use client';

import React from 'react';
import './style.scss';

interface IProps {
  text: string;
  children: React.ReactNode;
  id?: string;
}

export default function Label({ text, children, id }: IProps) {
  return (
    <label id={id} htmlFor={text}>
      {text}
      {children}
    </label>
  );
}
