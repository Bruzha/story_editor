'use client';
import React from 'react';
import Maket from '../maket/Maket';
import Textarea from '../../ui/textarea/Textarea';
import Label from '../../ui/label/Label';
import Button from '../../ui/button/Button';
import Input from '../../ui/input/Input';
import Form from '../../ui/form/Form';
import './style.scss';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

interface IProps {
  typeSidebar: 'profile' | 'project' | 'timeline' | 'help' | 'create_character';
  title: string;
  subtitle: string;
  masItems: {
    id: number;
    title: string;
    placeholder?: string;
  }[];
}

interface FormData {
  [key: string]: string;
  markerColor: string;
}

export default function CreatePageMaket({ typeSidebar, title, subtitle, masItems }: IProps) {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();
  const onSubmit = (data: FormData) => {
    console.log(data);
    // Здесь будет логика отправки данных на сервер
  };

  const handleCancelClick = () => {
    router.back();
  };

  return (
    <Maket typeSidebar={typeSidebar} title={title} subtitle={subtitle}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="create">
          <div className="create__items">
            {masItems.map((item) => (
              <Label key={item.id} text={item.title}>
                <Textarea key={item.id} placeholder={item.placeholder} {...register(item.title)} />
              </Label>
            ))}
            <Label text={'Маркерный цвет'}>
              <Input type="color" defaultValue="#4682B4" {...register('markerColor')} />
            </Label>
          </div>
          <div className="create__button">
            <Button type="submit" name={'Сохранить'} />
            <Button type="button" name={'Отмена'} onClick={handleCancelClick} />
          </div>
        </div>
      </Form>
    </Maket>
  );
}
