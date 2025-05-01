'use client';
import Button from './components/ui_components/Button';
import InputText from './components/ui_components/InputText';
import CardCharacter from './components/ui_components/CardCharacter';
import Header from './components/layout_components/Header';
import Footer from './components/layout_components/Footer';
import Sidebar from './components/layout_components/Sidebar';
import { useState } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (newValue: string) => {
    setInputText(newValue);
  };

  return (
    <>
      <Header />
      <Sidebar type="профиль" />
      <Button name="button1" />
      <InputText initialText={inputText} onChange={handleInputChange} />
      <p>Input value: {inputText}</p>
      <CardCharacter src="путь" alt="Персонаж 1" name="Персонаж 1" />
      <Footer />
    </>
  );
}
