// app/store/thunks/fetchCreatePageData.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseCookies } from 'nookies';

interface MasTitleItem {
  key: string;
  title: string;
  placeholder?: string;
  removable?: boolean;
}

interface CreatePageData {
  type: string;
  title: string;
  masTitle: MasTitleItem[];
  showImageInput?: boolean;
  typeSidebar: 'project' | 'profile' | 'timeline' | 'help' | 'create_character' | 'create_new_character' | string | '';
  projectId?: string;
  typePage?: 'characters' | 'appearance' | 'personality' | 'social';
}

interface FetchCreatePageParams {
  type: string;
  typePage?: string;
}

export const fetchCreatePageData = createAsyncThunk<CreatePageData, FetchCreatePageParams>(
  'createPage/fetchCreatePageData',
  async ({ type, typePage }: FetchCreatePageParams, thunkAPI) => {
    try {
      const cookies = parseCookies();
      const token = cookies['jwt'];

      if (!token) {
        console.error('Token not found in cookies');
        return thunkAPI.rejectWithValue('Token not found');
      }

      let apiUrl = `http://localhost:3001/create/create-page-data/${type}`;
      if (typePage) {
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
        console.error('Error fetching create page data:', response.status, response.statusText);
        return thunkAPI.rejectWithValue(`Error fetching create page data: ${response.status} ${response.statusText}`);
      }

      try {
        const data: CreatePageData = await response.json();
        return data;
      } catch (jsonError: any) {
        console.error('Error parsing JSON:', jsonError);
        return thunkAPI.rejectWithValue(`Error parsing JSON: ${jsonError.message || 'An error occurred'}`);
      }
    } catch (error: any) {
      console.error('Error fetching create page data:', error);
      return thunkAPI.rejectWithValue(error.message || 'An error occurred');
    }
  }
);
