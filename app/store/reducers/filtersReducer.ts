// src/store/reducers/filtersReducer.ts

import { createReducer } from '@reduxjs/toolkit';
import { fetchTimelineFilters } from '../thunks/fetchTimelineFilters';

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

interface FiltersState {
  filters: FiltersData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FiltersState = {
  filters: null,
  isLoading: false,
  error: null,
};

export const filtersReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchTimelineFilters.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchTimelineFilters.fulfilled, (state, action) => {
      state.filters = action.payload as FiltersData;
      state.isLoading = false;
      state.error = null;
    })
    .addCase(fetchTimelineFilters.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Произошла ошибка';
    });
});
