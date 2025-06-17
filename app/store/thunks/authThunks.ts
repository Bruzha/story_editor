// src/store/thunks/authThunks.ts

import { loginRequest, loginSuccess, loginFailure } from '../actions';
import { AppDispatch } from '../index';
import { setCookie } from 'nookies';

interface FormData {
  email: string;
  password: string;
}

export const loginUser = (data: FormData) => {
  return async (dispatch: AppDispatch) => {
    dispatch(loginRequest());
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        const token = result.token;
        setCookie(null, 'jwt', token, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
        dispatch(loginSuccess(token));
        return result; // Return the result for component to use
      } else {
        dispatch(loginFailure(result.message || 'Произошла ошибка при входе'));
        throw new Error(result.message || 'Произошла ошибка при входе');
      }
    } catch (error: any) {
      dispatch(loginFailure(error.message || 'Произошла ошибка при входе'));
      throw new Error(error.message || 'Произошла ошибка при входе');
    }
  };
};
