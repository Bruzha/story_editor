'use client';

import React, { useState } from 'react';

interface IProps {
  initialText: string;
  onChange: (value: string) => void;
}

export default function InputText({ initialText, onChange }: IProps) {
  const [value, setValue] = useState(initialText);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return <input type="text" value={value} onChange={handleChange} />;
}
