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

interface EmailForm {
  email: string;
}

interface PasswordForm {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordResponse {
  message: string;
  errors?: { [key: string]: string };
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
    try {
      const response = await fetch('http://localhost:3001/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });
      const result: ResetPasswordResponse = await response.json();
      if (response.ok) {
        console.log('Email check success:', result);
        setEmail(data.email);
        setShowPasswordForm(true);
        setSuccessMessage(null);
        setErrorMessage(null);
      } else {
        console.error('Email check error:', result);
        setErrorMessage(result.message || 'Пользователь с таким email не найден');
        setSuccessMessage(null);
        setShowPasswordForm(false);
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setErrorMessage('Произошла ошибка при проверке email');
      setSuccessMessage(null);
      setShowPasswordForm(false);
    }
  };

  const onSubmitPassword: SubmitHandler<PasswordForm> = async (data: PasswordForm) => {
    try {
      const response = await fetch('http://localhost:3001/auth/reset-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result: ResetPasswordResponse = await response.json();

      if (response.ok) {
        console.log('Password reset success:', result);
        setSuccessMessage(result.message);
        setErrorMessage(null);
        router.push('/auth/autorisation');
      } else {
        console.error('Password reset error:', result);
        setErrorMessage(result.message || 'Не удалось сбросить пароль');
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setErrorMessage('Произошла ошибка при сбросе пароля');
      setSuccessMessage(null);
    }
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
            <Button name="Проверить email" type="submit" />
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
            <Button name="Сменить пароль" type="submit" />
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
