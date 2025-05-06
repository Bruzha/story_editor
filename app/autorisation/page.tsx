'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import validationSchema from './validation';
import Input from '../components/ui/input/Input';
import Button from '../components/ui/button/Button';
import Form from '../components/ui/form/Form';
import Title from '../components/ui/title/Title';
import Link from '../components/ui/link/Link';
import './style.scss';

interface FormData {
  email: string;
  password: string;
}

export default function Autorisation() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    // Здесь будет логика отправки данных на сервер
  };

  return (
    <div className="autorisation">
      <Form onSubmit={handleSubmit(onSubmit)}>
        {' '}
        <Title text="АВТОРИЗАЦИЯ" />
        <div className="autorisation__inputs">
          <div>
            <Input type="email" placeholder="Email" iconSrc="/icons/email.svg" {...register('email')} />
            {errors.email && <p className="autorisation__error-message">{errors.email.message}</p>}
          </div>

          <div>
            <Input type="password" placeholder="Пароль" iconSrc="/icons/password.svg" {...register('password')} />
            {errors.password && <p className="autorisation__error-message">{errors.password.message}</p>}
          </div>
        </div>
        <div className="autorisation__button">
          <Button name="Вход" type="submit" />
        </div>
        <div className="autorisation__link">
          <Link name="Уже есть аккаунт? Войти" href={'../registration'} className="black-link" />
        </div>
        <div className="autorisation__link">
          <Link name="Забыли пароль?" href={'../reset_password'} className="black-link" />
        </div>
      </Form>
    </div>
  );
}
