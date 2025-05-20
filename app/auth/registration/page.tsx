'use client';
import React from 'react';
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
}

export default function Registration() {
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
        body: JSON.stringify(data),
      });

      const result: RegistrationResponse = await response.json(); // Явное указание типа
      if (response.ok) {
        console.log('Success:', result);
        // Обработайте успешную регистрацию
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
          console.error('Неверный формат ответа:', result); // Логируем, если формат ответа не соответствует ожиданиям
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

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
          <Link name="Уже есть аккаунт? Войти" href={'./autorisation'} className="black-link-form">
            <></>
          </Link>
        </div>
      </Form>
    </div>
  );
}
