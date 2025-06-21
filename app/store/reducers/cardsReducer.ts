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
import { createItem } from '../thunks/createItem';
import { updateCardSuccess } from '@/app/store/actions'; //  Импортируем updateCardSuccess
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
  displayFields: [],
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
        displayFields,
      };
      state.items = masItems;
      state.typeSidebar = typeSidebar;
      state.typeCard = typeCard;
      state.title = title;
      state.subtitle = subtitle;
      state.createPageUrl = createPageUrl;
      state.displayFields = displayFields;
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
      state.displayFields = [];
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
    .addCase(createItem.fulfilled, (state, action) => {
      const { newItem, slug } = action.payload;

      //  Добавляем новый элемент в state.items
      state.items.push(newItem);

      //  Обновляем cachedData только для текущего slug
      if (state.cachedData[slug] && state.cachedData[slug]!.items) {
        state.cachedData[slug]!.items.push(newItem);
      } else {
        //  Если для данного slug еще нет данных, создаем их
        state.cachedData[slug] = {
          items: [newItem],
          typeSidebar: '', //  Замени на фактические значения, если они известны
          typeCard: '', //  Замени на фактические значения, если они известны
          title: '', //  Замени на фактические значения, если они известны
          subtitle: '', //  Замени на фактические значения, если они известны
          createPageUrl: '', //  Замени на фактические значения, если они известны
          displayFields: [], //  Замени на фактические значения, если они известны
        };
      }
    })
    .addCase(updateCardSuccess, (state, action) => {
      const { item, slug } = action.payload;

      // Обновляем элемент в state.items
      state.items = state.items.map((i) => (i.id === item.id ? item : i));

      // Обновляем элемент в cachedData[slug].items
      if (state.cachedData[slug] && state.cachedData[slug]!.items) {
        state.cachedData[slug]!.items = state.cachedData[slug]!.items.map((i) => (i.id === item.id ? item : i));
      }
    });
});
