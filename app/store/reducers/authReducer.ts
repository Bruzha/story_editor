// src/store/reducers/authReducer.ts

import { createReducer } from '@reduxjs/toolkit';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  checkEmailRequest,
  checkEmailSuccess,
  checkEmailFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
} from '../actions';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  emailChecked: boolean;
}

const initialState: AuthState = {
  isLoading: false,
  error: null,
  emailChecked: false,
};

export const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loginRequest, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(loginSuccess, (state) => {
      state.isLoading = false;
      state.error = null;
    })
    .addCase(loginFailure, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(registerRequest, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(registerSuccess, (state) => {
      state.isLoading = false;
      state.error = null;
    })
    .addCase(registerFailure, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(checkEmailRequest, (state) => {
      state.isLoading = true;
      state.error = null;
      state.emailChecked = false;
    })
    .addCase(checkEmailSuccess, (state) => {
      state.isLoading = false;
      state.error = null;
      state.emailChecked = true;
    })
    .addCase(checkEmailFailure, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.emailChecked = false;
    })
    .addCase(resetPasswordRequest, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(resetPasswordSuccess, (state) => {
      state.isLoading = false;
      state.error = null;
    })
    .addCase(resetPasswordFailure, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
});
