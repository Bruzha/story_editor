'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import validationSchema from './validation';
import Input from '../../components/ui/input/Input';
import Button from '../../components/ui/button/Button';
import Form from '../../components/ui/form/Form';
import Title from '../../components/ui/title/Title';
import MyLink from '../../components/ui/link/Link';
import './style.scss';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import { useAuth } from '../../AuthContext';

interface FormData {
  login: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface BackendError {
  message: string;
  path: string;
}

interface RegistrationResponse {
  message: string;
  errors?: BackendError[];
  token?: string;
  userId?: number;
}

export default function Registration() {
  const [, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();
  const [cookieSet, setCookieSet] = useState(false); // Track if cookie is set

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: data.login,
          email: data.email,
          password: data.password,
        }),
      });

      const result: RegistrationResponse = await response.json();

      if (response.ok) {
        console.log('Success:', result);
        setErrorMessage(null);
        if (result.token) {
          setCookie(null, 'jwt', result.token, {
            maxAge: 30 * 24 * 60 * 60, // 30 дней
            path: '/',
          });
          setCookieSet(true); // Set cookieSet to true after setting the cookie
        }

        login(); // Вызов функции входа из контекста
      } else {
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((error) => {
            if (error.path === 'login') {
              setError('login', { type: 'manual', message: 'Аккаунт с таким логином уже есть' });
            } else if (error.path === 'email') {
              setError('email', { type: 'manual', message: 'Аккаунт с таким email уже есть' });
            }
          });
        } else {
          console.error('Неверный формат ответа:', result);
          setErrorMessage('Произошла ошибка при регистрации');
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setErrorMessage('Произошла ошибка при регистрации');
    }
  };

  useEffect(() => {
    if (cookieSet) {
      router.push('/profile'); // Redirect only when cookie is set
    }
  }, [cookieSet, router]);

  return (
    <div className="registration">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Title text="РЕГИСТРАЦИЯ" />
        <div className="registration__inputs">
          <div>
            <Input type="text" placeholder="Логин" iconSrc="/icons/name.svg" {...register('login')} />
            {errors.login && <p className="registration__error-message">{errors.login.message}</p>}
          </div>

          <div>
            <Input type="email" placeholder="Email" iconSrc="/icons/email.svg" {...register('email')} />
            {errors.email && <p className="registration__error-message">{errors.email.message}</p>}
          </div>

          <div>
            <Input type="password" placeholder="Пароль" iconSrc="/icons/password.svg" {...register('password')} />
            {errors.password && <p className="registration__error-message">{errors.password.message}</p>}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Подтвердите пароль"
              iconSrc="/icons/password.svg"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="registration__error-message">{errors.confirmPassword.message}</p>}
          </div>
        </div>
        <div className="registration__button">
          <Button name="Регистрация" type="submit" />
        </div>
        <div className="registration__link">
          <MyLink name="Уже есть аккаунт? Войти" href={'./autorisation'} className="black-link-form">
            <></>
          </MyLink>
        </div>
      </Form>
    </div>
  );
}
