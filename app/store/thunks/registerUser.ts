// src/store/thunks/authThunks.ts

import { registerRequest, registerSuccess, registerFailure } from '../actions';
import { AppDispatch } from '../index';
import { setCookie } from 'nookies';

interface FormData {
  login: string;
  email: string;
  password: string;
}

export const registerUser = (data: FormData) => {
  return async (dispatch: AppDispatch) => {
    dispatch(registerRequest());
    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: data.login,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const token = result.token;
        setCookie(null, 'jwt', token, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });
        dispatch(registerSuccess(token));
        return result; // Return the result for component to use
      } else {
        // Handle registration errors
        dispatch(registerFailure(result.message || 'Произошла ошибка при регистрации'));
        throw result; // Throw the result so the component can handle errors
      }
    } catch (error: any) {
      dispatch(registerFailure(error.message || 'Произошла ошибка при регистрации'));
      throw error; // Throw the error so the component can handle errors
    }
  };
};
