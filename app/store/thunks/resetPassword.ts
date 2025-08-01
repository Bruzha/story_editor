// src/store/thunks/authThunks.ts

import {
  checkEmailRequest,
  checkEmailSuccess,
  checkEmailFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
} from '../actions';
import { AppDispatch } from '../index';

interface PasswordForm {
  password: string;
  confirmPassword: string;
}

export const checkEmail = (email: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(checkEmailRequest());
    try {
      const response = await fetch('http://localhost:3001/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const result = await response.json();

      if (response.ok) {
        dispatch(checkEmailSuccess());
        return result; // Return the result for component to use
      } else {
        dispatch(checkEmailFailure(result.message || 'Пользователь с таким email не найден'));
        throw result; // Throw the result so the component can handle errors
      }
    } catch (error: any) {
      dispatch(checkEmailFailure(error.message || 'Произошла ошибка при проверке email'));
      throw error; // Throw the error so the component can handle errors
    }
  };
};

export const resetPassword = (email: string, data: PasswordForm) => {
  return async (dispatch: AppDispatch) => {
    dispatch(resetPasswordRequest());
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

      const result = await response.json();

      if (response.ok) {
        dispatch(resetPasswordSuccess());
        return result; // Return the result for component to use
      } else {
        dispatch(resetPasswordFailure(result.message || 'Не удалось сбросить пароль'));
        throw result; // Throw the result so the component can handle errors
      }
    } catch (error: any) {
      dispatch(resetPasswordFailure(error.message || 'Произошла ошибка при сбросе пароля'));
      throw error; // Throw the error so the component can handle errors
    }
  };
};
