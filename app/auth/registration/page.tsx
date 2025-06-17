'use client';

import React, { useState } from 'react';
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
import { useAuth } from '../../AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/thunks/registerUser';
import { RootState, AppDispatch } from '@/app/store';

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
  const dispatch: AppDispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

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
    dispatch(registerUser(data))
      .then((result) => {
        setErrorMessage(null);
        login(result.token);
        router.push('/profile');
      })
      .catch((error: RegistrationResponse) => {
        if (error.errors && Array.isArray(error.errors)) {
          error.errors.forEach((apiError) => {
            if (apiError.path === 'login') {
              setError('login', { type: 'manual', message: 'Пользователь с таким логином уже зарегистрирован' });
            } else if (apiError.path === 'email') {
              setError('email', { type: 'manual', message: 'Пользователь с таким email уже зарегистрирован' });
            }
          });
        } else {
          console.error('Ошибка:', error);
          setErrorMessage(error.message || 'Произошла ошибка при регистрации');
        }
      });
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
          <Button name="Регистрация" type="submit" disabled={isLoading} />
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
