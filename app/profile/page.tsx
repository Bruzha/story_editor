'use client';

import './style.scss';
import Sidebar from '../components/sections/sidebar/Sidebar';
import Form from '../components/ui/form/Form';
import Title from '../components/ui/title/Title';
import Button from '../components/ui/button/Button';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import validationSchema from './validation';
import Input from '../components/ui/input/Input';

interface FormData {
  login: string;
  name: string;
  lastname: string;
}

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
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    // Здесь будет логика отправки данных на сервер
  };

  return (
    <div className="profile">
      <div className="profile__sidebar">
        <Sidebar type="profile" />
      </div>
      <div className="profile__window">
        <Title text="ПРОФИЛЬ" />
        <h3>Ruzhastik {login}</h3>
        <div className="profile__line"></div>
        <div className="profile__data-container">
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
                  {errors.login && <p className="profile__error-message">{errors.login.message}</p>}
                </div>
                <div>
                  <Input type="text" placeholder="Имя" iconSrc="/icons/email.svg" {...register('name')} />
                  {errors.name && <p className="profile__error-message">{errors.name.message}</p>}
                </div>
                <div>
                  <Input type="text" placeholder="Фамилия" iconSrc="/icons/password.svg" {...register('lastname')} />
                  {errors.lastname && <p className="profile__error-message">{errors.lastname.message}</p>}
                </div>
              </div>
              <div className="profile__button">
                <Button name="Сохранить" type="submit" />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
