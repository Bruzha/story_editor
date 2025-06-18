// src/store/thunks/fetchTimelineFilters.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseCookies } from 'nookies';

interface FiltersData {
  characters: { id: string; name: string }[];
  locations: { id: string; name: string }[];
  objects: { id: string; name: string }[];
  chapters: { id: string; name: string }[];
}

export const fetchTimelineFilters = createAsyncThunk<FiltersData, string>(
  'timeline/fetchTimelineFilters',
  async (projectId, { rejectWithValue }) => {
    const cookies = parseCookies();
    const jwtToken = cookies['jwt'];
    const apiUrl = `http://localhost:3001/addRelationship/timeline/filters/${projectId}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('HTTP error fetching timeline filters:', errorData);
        return rejectWithValue(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const filtersData: FiltersData = await response.json();
      console.log('filtersData: ', filtersData);
      return filtersData;
    } catch (error: any) {
      console.error('Error fetching timeline filters:', error);
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);
