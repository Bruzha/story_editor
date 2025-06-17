'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../../components/ui/input/Input';
import Button from '../../components/ui/button/Button';
import Form from '../../components/ui/form/Form';
import Title from '../../components/ui/title/Title';
import Link from '../../components/ui/link/Link';
import './style.scss';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { checkEmail, resetPassword } from '../../store/thunks/resetPassword';
import { RootState, AppDispatch } from '@/app/store';

interface EmailForm {
  email: string;
}

interface PasswordForm {
  password: string;
  confirmPassword: string;
}

const emailValidationSchema = yup.object({
  email: yup.string().email('Неверный формат email').required('Email обязателен'),
});

const passwordValidationSchema = yup.object({
  password: yup
    .string()
    .required('Пароль обязателен')
    .min(8, 'Пароль должен содержать не менее 8 символов')
    .matches(
      /^(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])/,
      'Пароль должен содержать минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ'
    ),
  confirmPassword: yup
    .string()
    .required('Подтверждение пароля обязательно')
    .oneOf([yup.ref('password')], 'Пароли должны совпадать'),
});

export default function ResetPassword() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [email, setEmail] = useState('');
  const [, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailForm>({
    resolver: yupResolver(emailValidationSchema),
    mode: 'onBlur',
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordForm>({
    resolver: yupResolver(passwordValidationSchema),
    mode: 'onBlur',
  });

  const onSubmitEmail: SubmitHandler<EmailForm> = async (data: EmailForm) => {
    dispatch(checkEmail(data.email))
      .then(() => {
        setEmail(data.email);
        setShowPasswordForm(true);
        setSuccessMessage(null);
        setErrorMessage(null);
      })
      .catch((error) => {
        console.error('Error checking email:', error);
        setErrorMessage(error.message || 'Пользователь с таким email не найден');
        setSuccessMessage(null);
        setShowPasswordForm(false);
      });
  };

  const onSubmitPassword: SubmitHandler<PasswordForm> = async (data: PasswordForm) => {
    dispatch(resetPassword(email, data))
      .then((result) => {
        setSuccessMessage(result.message);
        setErrorMessage(null);
        router.push('/auth/autorisation');
      })
      .catch((error) => {
        console.error('Error resetting password:', error);
        setErrorMessage(error.message || 'Не удалось сбросить пароль');
        setSuccessMessage(null);
      });
  };

  return (
    <div className="reset">
      <Title text="СБРОС ПАРОЛЯ" />
      {!showPasswordForm ? (
        <Form onSubmit={handleSubmitEmail(onSubmitEmail)}>
          <div className="reset__inputs">
            <div>
              <Input key={1} type="email" placeholder="Email" iconSrc="/icons/email.svg" {...registerEmail('email')} />
              {emailErrors.email && <p className="reset__error-message">{emailErrors.email.message}</p>}
              {errorMessage && <p className="reset__error-message reset__unit-error">{errorMessage}</p>}
            </div>
          </div>
          <div className="reset__button">
            <Button name="Проверить email" type="submit" disabled={isLoading} />
          </div>
          <div className="reset__link">
            <Link name="Вернуться на страницу авторизации?" href={'./autorisation'} className="black-link-form">
              <></>
            </Link>
          </div>
        </Form>
      ) : (
        <Form onSubmit={handleSubmitPassword(onSubmitPassword)}>
          <div className="reset__inputs">
            <div>
              <Input
                key={2}
                type="password"
                placeholder="Пароль"
                iconSrc="/icons/password.svg"
                {...registerPassword('password')}
              />
              {passwordErrors.password && <p className="reset__error-message">{passwordErrors.password.message}</p>}
            </div>
            <div>
              <Input
                key={3}
                type="password"
                placeholder="Подтвердите пароль"
                iconSrc="/icons/password.svg"
                {...registerPassword('confirmPassword')}
              />
              {passwordErrors.confirmPassword && (
                <p className="reset__error-message">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>
            {errorMessage && <p className="reset__error-message reset__unit-error">{errorMessage}</p>}
          </div>
          <div className="reset__button">
            <Button name="Сменить пароль" type="submit" disabled={isLoading} />
          </div>
          <div className="reset__link">
            <Link name="Вернуться на страницу авторизации?" href={'./autorisation'} className="black-link-form">
              <></>
            </Link>
          </div>
        </Form>
      )}
    </div>
  );
}
