'use client';

import './style.scss';
import Maket from '../components/sections/maket/Maket';
import Form from '../components/ui/form/Form';
import Button from '../components/ui/button/Button';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import validationSchema, { ValidationSchemaType } from './validation';
import Input from '../components/ui/input/Input';

interface ProfileProps {
  email: string;
  date: string;
  updateDate: string;
  login: string;
  name: string;
  lastname: string;
}

export default function Profile({ email, date, updateDate, login, name, lastname }: ProfileProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchemaType>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
    defaultValues: {
      login: login,
      name: name,
      lastname: lastname,
    },
  });

  const onSubmit: SubmitHandler<ValidationSchemaType> = async (data: ValidationSchemaType) => {
    console.log(data);
    // Здесь будет логика отправки данных на сервер
  };

  return (
    <Maket typeSidebar="profile" title="ПРОФИЛЬ">
      <div className="profile">
        <div>
          <div className="profile__info">
            <p>
              <span>Имя:</span> Дарья {name}
            </p>
            <p>
              <span>Фамилия:</span> Бружас {lastname}
            </p>
            <p>
              <span>Email:</span> dashabry15@gmail.com{email}
            </p>
            <p>
              <span>Дата создания профиля:</span> 01.05.2025{date}
            </p>
            <p>
              <span>Дата последнего изменения профиля:</span> 07.05.2025{updateDate}
            </p>
          </div>
          <h3>Статистика</h3>
          <div className="profile__line"></div>
          <div className="profile__info">
            <p>
              <span>Количество проектов:</span> 0{updateDate}
            </p>
            <p>
              <span>Количество законченных проектов:</span> 0{updateDate}
            </p>
            <p>
              <span>Количество идей:</span> 0{updateDate}
            </p>
          </div>
        </div>
        <div className="profile__form">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="profile__form-title">Хотите изменить данные?</h3>
            <div className="profile__inputs">
              <div>
                <Input type="text" placeholder="Логин" iconSrc="/icons/password.svg" {...register('login')} />
                {errors.login && <p className="profile__error-message">{errors.login?.message}</p>}
              </div>
              <div>
                <Input type="text" placeholder="Имя" iconSrc="/icons/email.svg" {...register('name')} />
                {errors.name && <p className="profile__error-message">{errors.name?.message}</p>}
              </div>
              <div>
                <Input type="text" placeholder="Фамилия" iconSrc="/icons/password.svg" {...register('lastname')} />
                {errors.lastname && <p className="profile__error-message">{errors.lastname?.message}</p>}
              </div>
            </div>
            <div className="profile__button">
              <Button name="Сохранить" type="submit" />
            </div>
          </Form>
        </div>
      </div>
    </Maket>
  );
}
