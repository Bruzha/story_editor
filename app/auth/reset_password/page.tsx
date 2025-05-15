'use client';
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../../components/ui/input/Input';
import Button from '../../components/ui/button/Button';
import Form from '../../components/ui/form/Form';
import Title from '../../components/ui/title/Title';
import Link from '../../components/ui/link/Link';
import './style.scss';

interface BaseSchemaType {
  email: string;
}

interface PasswordSchemaType {
  password?: string;
  confirmPassword?: string;
}

//Первая схема валидации с email
const baseValidationSchema: yup.ObjectSchema<BaseSchemaType> = yup.object({
  email: yup.string().required('Email обязателен').email('Неверный формат email'),
});

//Вторая схема валидации с паролями
const passwordValidationSchema: yup.ObjectSchema<PasswordSchemaType> = yup.object({
  password: yup
    .string()
    .required('Пароль обязателен')
    .min(8, 'Пароль должен содержать не менее 8 символов')
    .matches(
      /^(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ])(?=.*\d)(?=.*[!@#$%^&*])/,
      'Пароль должен содержать минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ'
    ),
  confirmPassword: yup
    .string()
    .required('Подтверждение пароля обязательно')
    .oneOf([yup.ref('password')], 'Пароли должны совпадать'),
});

interface FormData {
  email: string;
  password?: string;
  confirmPassword?: string;
}

export default function ResetPassword() {
  const [showSecondForm, setShowSecondForm] = useState(false);
  const [validationSchema, setValidationSchema] = useState<yup.AnyObjectSchema>(baseValidationSchema);

  useEffect(() => {
    if (showSecondForm) {
      setValidationSchema(
        yup.object().shape({
          ...baseValidationSchema.fields,
          ...passwordValidationSchema.fields,
        }) as yup.AnyObjectSchema
      );
    } else {
      setValidationSchema(baseValidationSchema);
    }
  }, [showSecondForm]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (!showSecondForm) {
      console.log('First form data:', data);
      setShowSecondForm(true);
    } else {
      console.log('Second form data:', data);
      // Здесь будет логика отправки данных на сервер для сброса пароля
    }
  };

  return (
    <div className="reset">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Title text="СБРОС ПАРОЛЯ" />
        {/* Первая форма */}
        {!showSecondForm && (
          <div className="reset__first-form">
            <div className="reset__inputs">
              <div>
                <Input type="email" placeholder="Email" iconSrc="/icons/email.svg" {...register('email')} />
                {errors.email && <p className="reset__error-message">{errors.email.message}</p>}
              </div>
            </div>
            <div className="reset__button">
              <Button name="Новый пароль" type="submit" />
            </div>
            <div className="reset__link">
              <Link name="Вернуться на страницу авторизации?" href={'./autorisation'} className="black-link-form">
                <></>
              </Link>
            </div>
          </div>
        )}
        {/* Вторая форма */}
        {showSecondForm && (
          <div className="reset__second-form">
            <div className="reset__inputs">
              <div>
                <Input type="password" placeholder="Пароль" iconSrc="/icons/password.svg" {...register('password')} />
                {errors.password && <p className="reset__error-message">{errors.password?.message}</p>}
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Подтвердите пароль"
                  iconSrc="/icons/password.svg"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && <p className="reset__error-message">{errors.confirmPassword?.message}</p>}
              </div>
            </div>
            <div className="reset__button">
              <Button name="Подтвердить" type="submit" />
            </div>
            <div className="reset__link">
              <Link name="Вернуться на страницу авторизации?" href={'./autorisation'} className="black-link-form">
                <></>
              </Link>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
}
