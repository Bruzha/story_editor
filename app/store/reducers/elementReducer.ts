// src/store/reducers/elementReducer.ts
import { createReducer } from '@reduxjs/toolkit';
import { fetchElementsRequest, fetchElementsSuccess, fetchElementsFailure } from '../actions';

interface ElementState {
  loading: boolean;
  data: any[];
  error: string | null;
}

const initialState: ElementState = {
  loading: false,
  data: [],
  error: null,
};

const elementReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchElementsRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchElementsSuccess, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    })
    .addCase(fetchElementsFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
});

export default elementReducer;
