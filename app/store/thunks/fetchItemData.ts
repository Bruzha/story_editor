import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseCookies } from 'nookies';
import { RootState } from '@/app/store';
import { setItemFromCache } from '../reducers/itemReducer';

interface FetchItemParams {
  type: string;
  id: string;
  typePage?: string;
}

export const fetchItemData = createAsyncThunk(
  'item/fetchItemData',
  async ({ type, id, typePage }: FetchItemParams, thunkAPI) => {
    try {
      const cookies = parseCookies();
      const token = cookies['jwt'];
      const state = thunkAPI.getState() as RootState;
      const { cachedItems } = state.item;
      const { projectId } = state.project;

      const cacheKey = `${id}-${type}${typePage ? `-${typePage}` : ''}`;

      if (cachedItems[cacheKey]) {
        thunkAPI.dispatch(setItemFromCache(cachedItems[cacheKey]));
        return cachedItems[cacheKey];
      }

      if (!token) {
        console.error('No token found in cookies');
        return thunkAPI.rejectWithValue('No token found in cookies');
      }

      let apiUrl = `http://localhost:3001/getItem/${type}/${id}`;

      if (
        type === 'characters' ||
        type === 'locations' ||
        type === 'objects' ||
        type === 'groups' ||
        type === 'chapters' ||
        type === 'notes' ||
        type === 'plotlines' ||
        type === 'time_events' ||
        type === 'timelines' ||
        type === 'supportingMaterials'
      ) {
        if (!projectId) {
          console.error('projectId is not available in the store');
          return thunkAPI.rejectWithValue('projectId is not available in the store');
        }
        apiUrl = `http://localhost:3001/getItem/projects/${projectId}/${type}/${id}`;
      }
      if (type === 'characters' && typePage) {
        apiUrl += `?typePage=${typePage}`;
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error(`Error fetching item: ${response.status} ${response.statusText}`);
        return thunkAPI.rejectWithValue(`Error fetching item: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching item:', error);
      return thunkAPI.rejectWithValue(error.message || 'An error occurred');
    }
  }
);
