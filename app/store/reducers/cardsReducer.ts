import { createReducer } from '@reduxjs/toolkit';
import {
  fetchCardsRequest,
  fetchCardsSuccess,
  fetchCardsFailure,
  deleteCardRequest,
  deleteCardSuccess,
  deleteCardFailure,
  resetCardsState,
} from '../actions';
import { CardsState } from '../../types/types';

const initialState: CardsState = {
  items: [],
  isLoading: false,
  error: null,
  typeSidebar: '',
  typeCard: '',
  title: '',
  subtitle: '',
  createPageUrl: '',
  displayFields: [], // ADD displayFields
  cachedData: {},
};

export const cardsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchCardsRequest, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchCardsSuccess, (state, action) => {
      state.isLoading = false;
      const { slug, masItems, typeSidebar, typeCard, title, subtitle, createPageUrl, displayFields } = action.payload; // ADD displayFields
      state.cachedData[slug] = {
        items: masItems,
        typeSidebar,
        typeCard,
        title,
        subtitle,
        createPageUrl,
        displayFields, // ADD displayFields
      };
      state.items = masItems;
      state.typeSidebar = typeSidebar;
      state.typeCard = typeCard;
      state.title = title;
      state.subtitle = subtitle;
      state.createPageUrl = createPageUrl;
      state.displayFields = displayFields; // ADD displayFields
    })
    .addCase(fetchCardsFailure, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(resetCardsState, (state) => {
      state.items = [];
      state.isLoading = false;
      state.error = null;
      state.typeSidebar = '';
      state.typeCard = '';
      state.title = '';
      state.subtitle = '';
      state.createPageUrl = '';
      state.displayFields = []; // ADD displayFields
      state.cachedData = {};
    })
    .addCase(deleteCardRequest, (state) => {
      state.error = null;
    })
    .addCase(deleteCardSuccess, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      for (const slug in state.cachedData) {
        if (state.cachedData[slug] && state.cachedData[slug]!.items) {
          state.cachedData[slug]!.items = state.cachedData[slug]!.items.filter((item) => item.id !== action.payload);
        }
      }
    })
    .addCase(deleteCardFailure, (state, action) => {
      state.error = action.payload;
    });
});
