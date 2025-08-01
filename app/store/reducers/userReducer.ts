// src/store/reducers/userReducer.ts

import { createReducer } from '@reduxjs/toolkit';
import {
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  clearProfile,
} from '../actions';

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

interface UserState {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchProfileRequest, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchProfileSuccess, (state, action) => {
      state.isLoading = false;
      state.profile = action.payload;
      state.error = null;
    })
    .addCase(fetchProfileFailure, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(updateProfileRequest, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(updateProfileSuccess, (state) => {
      state.isLoading = false;
      state.error = null;
    })
    .addCase(updateProfileFailure, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(clearProfile, (state) => {
      state.profile = null;
      state.isLoading = false;
      state.error = null;
    });
});
