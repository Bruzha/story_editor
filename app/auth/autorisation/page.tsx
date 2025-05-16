'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import validationSchema from './validation';
import Input from '../../components/ui/input/Input';
import Button from '../../components/ui/button/Button';
import Form from '../../components/ui/form/Form';
import Title from '../../components/ui/title/Title';
import Link from '../../components/ui/link/Link';
import './style.scss';

interface FormData {
  email: string;
  password: string;
}

interface BackendError {
  message: string;
  path: string;
}

interface LoginResponse {
  message: string;
  errors?: BackendError[];
}

export default function Autorisation() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: LoginResponse = await response.json();

      if (response.ok) {
        console.log('Success:', result);
        // Обработайте успешный вход (например, перенаправление на другую страницу)
        setErrorMessage(null);
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        } else {
          console.error('Неверный формат ответа:', result);
          setErrorMessage('Произошла ошибка при входе');
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setErrorMessage('Произошла ошибка при входе');
    }
  };

  return (
    <div className="autorisation">
      <Form onSubmit={handleSubmit(onSubmit)}>
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
          {errorMessage && <p className="autorisation__error-message autorisation__unit-error">{errorMessage}</p>}
        </div>
        <div className="autorisation__button">
          <Button name="Вход" type="submit" />
        </div>
        <div className="autorisation__link">
          <Link name="Еще нет аккаунта? Зарегистрироваться" href={'./registration'} className="black-link-form">
            <></>
          </Link>
        </div>
        <div className="autorisation__link">
          <Link name="Забыли пароль?" href={'./reset_password'} className="black-link-form">
            <></>
          </Link>
        </div>
      </Form>
    </div>
  );
}
