import { createAction } from '@reduxjs/toolkit';
import { ItemsData } from '../types/types';

// Тип для данных, возвращаемых API
export interface ApiResponse {
  masItems: ItemsData[];
  typeSidebar: 'profile' | 'project' | 'timeline' | 'help' | 'create_character' | '';
  typeCard: string;
  title: string;
  subtitle: string;
  createPageUrl: string;
  slug: string;
}

// Заполнение страницы карточками
export const fetchCardsRequest = createAction('FETCH_CARDS_REQUEST');
export const fetchCardsSuccess = createAction<ApiResponse>('FETCH_CARDS_SUCCESS');
export const fetchCardsFailure = createAction<string>('FETCH_CARDS_FAILURE');
export const resetCardsState = createAction('RESET_CARDS_STATE');

// Удаление карточки
export const deleteCardRequest = createAction('DELETE_CARD_REQUEST');
export const deleteCardSuccess = createAction<number>('DELETE_CARD_SUCCESS');
export const deleteCardFailure = createAction<string>('DELETE_CARD_FAILURE');
