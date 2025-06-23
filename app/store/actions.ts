import { createAction } from '@reduxjs/toolkit';
import { ItemsData } from '../types/types';

// Тип для данных, возвращаемых API
export interface ApiResponse {
  masItems: ItemsData[];
  typeSidebar: 'profile' | 'project' | 'timeline' | 'help' | 'create_character' | string | '';
  typeCard: string;
  title: string;
  subtitle: string;
  createPageUrl: string;
  slug: string;
  displayFields?: string[];
}

interface FilterItem {
  id: string;
  name: string;
  markerColor: string;
  timelineEventIds: string[];
}

interface FiltersData {
  characters: FilterItem[];
  locations: FilterItem[];
  objects: FilterItem[];
  chapters: FilterItem[];
}

// Заполнение страницы карточками
export const fetchCardsRequest = createAction('FETCH_CARDS_REQUEST');
export const fetchCardsSuccess = createAction<ApiResponse>('FETCH_CARDS_SUCCESS');
export const fetchCardsFailure = createAction<string>('FETCH_CARDS_FAILURE');
export const resetCardsState = createAction('RESET_CARDS_STATE');

// Добавление карточки
export const addCard = createAction<any>('ADD_CARD');

// Удаление карточки
export const deleteCardRequest = createAction('DELETE_CARD_REQUEST');
export const deleteCardSuccess = createAction<number>('DELETE_CARD_SUCCESS');
export const deleteCardFailure = createAction<string>('DELETE_CARD_FAILURE');

// Авторизация
export const loginRequest = createAction('LOGIN_REQUEST');
export const loginSuccess = createAction<string>('LOGIN_SUCCESS');
export const loginFailure = createAction<string>('LOGIN_FAILURE');

// Регистрация
export const registerRequest = createAction('REGISTER_REQUEST');
export const registerSuccess = createAction<string>('REGISTER_SUCCESS');
export const registerFailure = createAction<string>('REGISTER_FAILURE');

// Сброс пароля
export const checkEmailRequest = createAction('CHECK_EMAIL_REQUEST');
export const checkEmailSuccess = createAction('CHECK_EMAIL_SUCCESS');
export const checkEmailFailure = createAction<string>('CHECK_EMAIL_FAILURE');
export const resetPasswordRequest = createAction('RESET_PASSWORD_REQUEST');
export const resetPasswordSuccess = createAction('RESET_PASSWORD_SUCCESS');
export const resetPasswordFailure = createAction<string>('RESET_PASSWORD_FAILURE');

// Профиль пользователя
export const fetchProfileRequest = createAction('FETCH_PROFILE_REQUEST');
export const fetchProfileSuccess = createAction<any>('FETCH_PROFILE_SUCCESS'); // Payload is the profile data
export const fetchProfileFailure = createAction<string>('FETCH_PROFILE_FAILURE');
export const updateProfileRequest = createAction('UPDATE_PROFILE_REQUEST');
export const updateProfileSuccess = createAction('UPDATE_PROFILE_SUCCESS');
export const updateProfileFailure = createAction<string>('UPDATE_PROFILE_FAILURE');
export const clearProfile = createAction('CLEAR_PROFILE');

// Фильтрация для таймлайна
export const setFilters = createAction<FiltersData>('SET_FILTERS');

export const updateCardSuccess = createAction<{ item: any; slug: string }>('cards/updateCardSuccess');
