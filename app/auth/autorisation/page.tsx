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
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/thunks/authThunks';
import { RootState, AppDispatch } from '@/app/store';

interface FormData {
  email: string;
  password: string;
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
  const dispatch: AppDispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const authError = useSelector((state: RootState) => state.auth.error);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    dispatch(loginUser(data))
      .then((result) => {
        setErrorMessage(null);
        login(result.token);
        router.push('/profile');
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage(error.message || 'Произошла ошибка при входе');
      });
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
          {authError && <p className="autorisation__error-message autorisation__unit-error">{authError}</p>}{' '}
        </div>
        <div className="autorisation__button">
          <Button name="Вход" type="submit" disabled={isLoading} />
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
