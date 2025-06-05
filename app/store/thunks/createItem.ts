// store/thunks/createItem.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseCookies } from 'nookies';

interface CreateItemParams {
  type: string;
  payload: any;
}

export const createItem = createAsyncThunk(
  'item/createItem',
  async ({ type, payload }: CreateItemParams, { rejectWithValue }) => {
    const cookies = parseCookies();
    const jwtToken = cookies['jwt'];
    const apiUrl = `http://localhost:3001/create/create_item/${type}`;

    try {
      let requestBody = payload;
      if (type === 'characters') {
        requestBody = {
          info: payload.info,
          info_appearance: payload.info_appearance,
          info_personality: payload.info_personality,
          info_social: payload.info_social,
          miniature: payload.miniature,
          markerColor: payload.markerColor,
          projectId: payload.projectId,
        };
      }

      console.log('requestBody 3: ', requestBody);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestBody), // Используем requestBody
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('HTTP error creating item:', errorData);
        return rejectWithValue(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const newItem = await response.json();
      return newItem;
    } catch (error: any) {
      console.error('Error creating item:', error);
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);
