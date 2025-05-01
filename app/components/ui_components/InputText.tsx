'use client';

import React, { useState } from 'react';

interface MyInputTextProps {
  initialText: string;
  onChange: (value: string) => void;
}

export default function InputText({ initialText, onChange }: MyInputTextProps) {
  const [value, setValue] = useState(initialText);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return <input type="text" value={value} onChange={handleChange} />;
}
