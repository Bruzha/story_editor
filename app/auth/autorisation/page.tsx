'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../AuthContext';
import Input from '../../components/ui/input/Input';
import Button from '../../components/ui/button/Button';
import Form from '../../components/ui/form/Form';
import Title from '../../components/ui/title/Title';
import MyLink from '../../components/ui/link/Link';
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
  token?: string;
  userId?: number;
}

const schema = yup
  .object({
    email: yup.string().email('Неверный формат email').required('Обязательное поле'),
    password: yup.string().required('Обязательное поле'),
  })
  .required();

export default function Autorisation() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
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
        setErrorMessage(null);
        if (result.token) {
          login(result.token);
          router.push('/profile');
        } else {
          setErrorMessage('Token not found in response');
        }
      } else {
        if (result.message) {
          setErrorMessage(result.message);
        } else {
          console.error('Неверный формат ответа:', result);
          setErrorMessage('Произошла ошибка при входе');
        }
      }
    } catch (error) {
      console.error('Error:', error);
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
          <MyLink name="Еще нет аккаунта? Зарегистрироваться" href={'./registration'} className="black-link-form">
            <></>
          </MyLink>
        </div>
        <div className="autorisation__link">
          <MyLink name="Забыли пароль?" href={'./reset_password'} className="black-link-form">
            <></>
          </MyLink>
        </div>
      </Form>
    </div>
  );
}
