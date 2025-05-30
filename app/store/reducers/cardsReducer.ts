// src/store/reducers/cardsReducer.ts
import { createReducer, createAction } from '@reduxjs/toolkit';
import {
  fetchCardsRequest,
  fetchCardsSuccess,
  fetchCardsFailure,
  deleteCardRequest,
  deleteCardSuccess,
  deleteCardFailure,
  resetCardsState,
} from '../actions';
import { CardsState, ItemsData } from '../../types/types';

// Define the updateCard action
export const updateCard = createAction<ItemsData>('cards/updateCard');
export const addCard = createAction<ItemsData>('cards/addCard');

const initialState: CardsState = {
  items: [],
  isLoading: false,
  error: null,
  typeSidebar: '',
  typeCard: '',
  title: '',
  subtitle: '',
  createPageUrl: '',
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
      const { slug, masItems, typeSidebar, typeCard, title, subtitle, createPageUrl } = action.payload;

      // Check if items already exist in state.items
      masItems.forEach((newItem) => {
        const existingItemIndex = state.items.findIndex((item) => item.id === newItem.id);
        if (existingItemIndex === -1) {
          // If the item doesn't exist, add it to the beginning of the array
          state.items.unshift(newItem);
        } else {
          // If the item exists, update it
          state.items[existingItemIndex] = newItem;
        }
      });

      state.cachedData[slug] = {
        items: masItems,
        typeSidebar,
        typeCard,
        title,
        subtitle,
        createPageUrl,
      };
      state.typeSidebar = typeSidebar;
      state.typeCard = typeCard;
      state.title = title;
      state.subtitle = subtitle;
      state.createPageUrl = createPageUrl;
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
    })
    // Add the updateCard case
    .addCase(updateCard, (state, action) => {
      const updatedCard = action.payload;
      // Update the item in the items array
      state.items = state.items.map((item) => (item.id === updatedCard.id ? updatedCard : item));

      // Update the item in cachedData
      for (const slug in state.cachedData) {
        if (state.cachedData[slug] && state.cachedData[slug]!.items) {
          state.cachedData[slug]!.items = state.cachedData[slug]!.items.map((item) =>
            item.id === updatedCard.id ? updatedCard : item
          );
        }
      }
    })
    .addCase(addCard, (state, action) => {
      const newCard = action.payload;
      state.items = [newCard, ...state.items];
    });
});
