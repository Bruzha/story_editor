'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import Maket from '../components/sections/maket/Maket';
import Form from '../components/ui/form/Form';
import Button from '../components/ui/button/Button';
import Input from '../components/ui/input/Input';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import validationSchema, { ValidationSchemaType } from './validation';
import './style.scss';

interface ProfileData {
  email: string;
  date: string;
  updateDate: string;
  login: string;
  name: string;
  lastname: string;
  totalProjects: number;
  plannedProjects: number;
  inProgressProjects: number;
  completedProjects: number;
  suspendedProjects: number;
  totalIdeas: number;
}

export default function Profile() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const fetchData = async () => {
    // Объявляем fetchData вне useEffect
    try {
      console.log('Profile: fetchData - fetching data...');
      const cookies = parseCookies();
      const token = cookies['jwt'];
      console.log('Profile: fetchData - token from cookie:', token);

      if (!token) {
        console.error('Token not found in cookies');
        router.push('/auth/autorisation'); // Redirect if no token
        return;
      }

      const response = await fetch('http://localhost:3001/auth/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Ошибка при получении данных профиля:', response.status, response.statusText);
        throw new Error(`Ошибка при получении данных профиля: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Profile: fetchData - data received:', data);
      setProfileData(data);
    } catch (error) {
      console.error('Ошибка при получении данных профиля:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/autorisation');
      return;
    }

    fetchData();
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ValidationSchemaType>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
    defaultValues: {
      login: profileData?.login || '',
      name: profileData?.name || '',
      lastname: profileData?.lastname || '',
    },
  });

  useEffect(() => {
    if (profileData) {
      reset({
        login: profileData.login,
        name: profileData.name,
        lastname: profileData.lastname,
      });
    }
  }, [profileData, reset]);

  const onSubmit: SubmitHandler<ValidationSchemaType> = async (data: ValidationSchemaType) => {
    try {
      console.log('Profile: onSubmit - submitting form...');
      const cookies = parseCookies();
      const token = cookies['jwt'];

      const response = await fetch('http://localhost:3001/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error('Ошибка при обновлении данных профиля:', response.status, response.statusText);
        throw new Error(`Ошибка при обновлении данных профиля: ${response.status} ${response.statusText}`);
      }

      // Refresh profile data after successful update
      await fetchData();
      console.log('Profile: onSubmit - form submitted successfully');
    } catch (error) {
      console.error('Ошибка при обновлении данных профиля:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <Maket typeSidebar="profile" title="ПРОФИЛЬ" subtitle="Ruzhastik">
      <div className="profile">
        <div>
          <div className="profile__info">
            <p>
              <span>Имя:</span> {profileData.name}
            </p>
            <p>
              <span>Фамилия:</span> {profileData.lastname}
            </p>
            <p>
              <span>Email:</span> {profileData.email}
            </p>
            <p>
              <span>Дата создания профиля:</span> {profileData.date}
            </p>
            <p>
              <span>Дата последнего изменения профиля:</span> {profileData.updateDate}
            </p>
          </div>
          <h3>Статистика</h3>
          <div className="profile__line"></div>
          <div className="profile__info">
            <p>
              <span>Общее количество проектов:</span> {profileData.totalProjects}
            </p>
            <p>
              <span>Количество запланированных проектов:</span> {profileData.plannedProjects}
            </p>
            <p>
              <span>Количество проектов в процессе:</span> {profileData.inProgressProjects}
            </p>
            <p>
              <span>Количество законченных проектов:</span> {profileData.completedProjects}
            </p>
            <p>
              <span>Количество приостановленных проектов:</span> {profileData.suspendedProjects}
            </p>
            <p>
              <span>Количество идей:</span> {profileData.totalIdeas}
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
