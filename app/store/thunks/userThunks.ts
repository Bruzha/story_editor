// src/store/thunks/userThunks.ts

import {
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
} from '../actions';
import { AppDispatch, RootState } from '../index';
import { parseCookies } from 'nookies';

interface ProfileData {
  email: string;
  role: 'user' | 'admin';
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

interface ValidationSchemaType {
  login: string;
  name: string;
  lastname: string;
}

export const fetchProfile = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(fetchProfileRequest());
    try {
      const cookies = parseCookies();
      const token = cookies['jwt'];

      if (!token) {
        dispatch(fetchProfileFailure('Token not found in cookies'));
        throw new Error('Token not found in cookies');
      }

      const response = await fetch('http://localhost:3001/auth/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        dispatch(fetchProfileFailure(`Ошибка при получении данных профиля: ${response.status} ${response.statusText}`));
        throw new Error(`Ошибка при получении данных профиля: ${response.status} ${response.statusText}`);
      }

      const data: ProfileData = await response.json();
      console.log('profile data: ', data);
      dispatch(fetchProfileSuccess(data));
    } catch (error: any) {
      dispatch(fetchProfileFailure(error.message || 'Произошла ошибка при получении данных профиля'));
      throw error;
    }
  };
};

export const updateProfile = (data: ValidationSchemaType) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(updateProfileRequest());
    try {
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
        dispatch(
          updateProfileFailure(`Ошибка при обновлении данных профиля: ${response.status} ${response.statusText}`)
        );
        throw new Error(`Ошибка при обновлении данных профиля: ${response.status} ${response.statusText}`);
      }
      const currentProfile = getState().user.profile;
      if (!currentProfile) {
        dispatch(updateProfileFailure('Ошибка: нет данных профиля в store'));
        throw new Error('Ошибка: нет данных профиля в store');
      }
      const updatedProfile = {
        ...currentProfile,
        login: data.login,
        name: data.name,
        lastname: data.lastname,
      };
      dispatch(fetchProfileSuccess(updatedProfile));

      dispatch(updateProfileSuccess());
      dispatch(fetchProfile());
      return response;
    } catch (error: any) {
      dispatch(updateProfileFailure(error.message || 'Произошла ошибка при обновлении данных профиля'));
      throw error;
    }
  };
};
