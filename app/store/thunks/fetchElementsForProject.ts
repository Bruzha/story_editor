import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseCookies } from 'nookies';
import { fetchElementsRequest, fetchElementsSuccess, fetchElementsFailure } from '../actions'; //  Подключаем actions

interface ElementItem {
  id: number;
  [key: string]: any;
}

interface IProjectElements {
  projectId: number;
  projectName: string;
  elements: ElementItem[];
}

interface FetchElementsParams {
  type: string;
}

export const fetchElementsForProject = createAsyncThunk<IProjectElements[], FetchElementsParams>(
  'elements/fetchElementsForProject',
  async ({ type }: FetchElementsParams, thunkAPI) => {
    try {
      thunkAPI.dispatch(fetchElementsRequest()); //  Диспатчим action начала загрузки

      const cookies = parseCookies();
      const token = cookies['jwt'];

      if (!token) {
        throw new Error('No token found');
      }

      const apiUrl = `http://localhost:3001/create/copy/elements/${type}`; // Изменили URL

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch elements: ${response.status} ${response.statusText}`);
      }

      const data: IProjectElements[] = await response.json();
      thunkAPI.dispatch(fetchElementsSuccess(data)); //  Диспатчим action успешной загрузки
      return data;
    } catch (error: any) {
      console.error('Error fetching elements:', error);
      thunkAPI.dispatch(fetchElementsFailure(error.message)); //  Диспатчим action ошибки
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch elements');
    }
  }
);
