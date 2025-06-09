// store/thunks/updateItem.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseCookies } from 'nookies';
import { updateItemSuccess } from '@/app/store/reducers/itemReducer';
import { fetchItemData } from './fetchItemData';

interface UpdateItemParams {
  type: string;
  id: string;
  data: {
    info?: any;
    info_appearance?: any;
    info_personality?: any;
    info_social?: any;
    status?: any;
    markerColor?: any;
  };
  miniature?: File;
  convertFileToByteArray: (file: File) => Promise<number[]>;
}

export const updateItem = createAsyncThunk(
  'item/updateItem',
  async ({ type, id, data, miniature, convertFileToByteArray }: UpdateItemParams, { dispatch }) => {
    const cookies = parseCookies();
    const jwtToken = cookies['jwt'];
    const apiUrl = `http://localhost:3001/update/update/${type}/${id}`;

    const payload: any = {
      info: data.info,
      info_appearance: data.info_appearance,
      info_personality: data.info_personality,
      info_social: data.info_social,
      status: data.status,
      markerColor: data.markerColor,
    };

    if (miniature) {
      const miniatureData = await convertFileToByteArray(miniature);
      payload.miniature = miniatureData;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedItem = await response.json();
      dispatch(updateItemSuccess(updatedItem));
      dispatch(fetchItemData({ type, id }));
      return updatedItem;
    } catch (error: any) {
      console.error('Error updating item:', error);
      throw error;
    }
  }
);
