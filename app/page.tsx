'use client';
import Button from './components/ui/button/Button';
import InputText from './components/ui/input/Input';
import Card from './components/ui/card/Card';
import Sidebar from './components/sections/sidebar/Sidebar';
import { useState } from 'react';
import './style.scss';

export default function Home() {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (newValue: string) => {
    setInputText(newValue);
  };

  return (
    <div className="page__body">
      <Sidebar type="профиль" />
      <div>
        <Button name="button1" />
        <p>Input value: {inputText}</p>
        <Card
          id={1}
          src="путь"
          alt="Аватарка персонажа 1"
          data={[
            'Эдгар Энгл Уайт-Верм',
            'Англичанин, пытающийся отреставрировать родительский особняк после пожара и получить опеку над Бриттаном.',
            'протагонист',
            'мужской',
            '32 года',
            'человек, англичанин',
          ]}
          markColor="red"
        />
        <Card
          id={2}
          src="путь"
          alt="Аватарка персонажа 2"
          data={[
            'Гвиллим Камбрия Ап Драйг Гох',
            'Школьный друг Эдгара, снимающий у него часть особняка. Работал учителем Бриттана на дому пока в семье последнего не произошла трагедия. Сподвиг Эдгара взять опеку над осиротевшим мальчиком.',
            'друг протагониста',
            'мужской',
            '34 года',
            'человек, валлиец',
          ]}
          markColor="#0db545"
        />
      </div>
    </div>
  );
}
