'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';
import Maket from '../components/sections/maket/Maket';
import Form from '../components/ui/form/Form';
import Button from '../components/ui/button/Button';
import Input from '../components/ui/input/Input';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import validationSchema, { ValidationSchemaType } from './validation';
import './style.scss';
import Loading from '../components/ui/loading/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from './../store/thunks/userThunks';
import { RootState, AppDispatch } from '@/app/store';

export default function Profile() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.user.profile);
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const error = useSelector((state: RootState) => state.user.error);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ValidationSchemaType>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
    defaultValues: {
      login: profile?.login || '',
      name: profile?.name || '',
      lastname: profile?.lastname || '',
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/autorisation');
      return;
    }

    if (!profile) {
      dispatch(fetchProfile());
    }
  }, [isAuthenticated, router, dispatch, profile]);

  useEffect(() => {
    if (profile) {
      reset({
        login: profile.login,
        name: profile.name,
        lastname: profile.lastname,
      });
    }
  }, [profile, reset]);

  const onSubmit: SubmitHandler<ValidationSchemaType> = async (data: ValidationSchemaType) => {
    dispatch(updateProfile(data)).catch((error) => {
      console.error('Ошибка при обновлении данных профиля:', error);
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <Maket typeSidebar="profile" title="ПРОФИЛЬ" subtitle={profile?.login || ''}>
      <div className="profile">
        <div>
          <div className="profile__info">
            <p>
              <span>Имя:</span> {profile?.name}
            </p>
            <p>
              <span>Фамилия:</span> {profile?.lastname}
            </p>
            <p>
              <span>Email:</span> {profile?.email}
            </p>
            <p>
              <span>Дата создания профиля:</span> {profile?.date}
            </p>
            <p>
              <span>Дата последнего изменения профиля:</span> {profile?.updateDate}
            </p>
          </div>
          <h3>Статистика</h3>
          <div className="profile__line"></div>
          <div className="profile__info">
            <p>
              <span>Общее количество проектов:</span> {profile?.totalProjects}
            </p>
            <p>
              <span>Количество запланированных проектов:</span> {profile?.plannedProjects}
            </p>
            <p>
              <span>Количество проектов в процессе:</span> {profile?.inProgressProjects}
            </p>
            <p>
              <span>Количество законченных проектов:</span> {profile?.completedProjects}
            </p>
            <p>
              <span>Количество приостановленных проектов:</span> {profile?.suspendedProjects}
            </p>
            <p>
              <span>Количество идей:</span> {profile?.totalIdeas}
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
              <Button name="Сохранить" type="submit" disabled={isLoading} />
            </div>
          </Form>
        </div>
      </div>
    </Maket>
  );
}
