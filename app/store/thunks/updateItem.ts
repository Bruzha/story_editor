// store/thunks/updateItem.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseCookies } from 'nookies';
import { updateItemSuccess } from '@/app/store/reducers/itemReducer'; //  Импортируем updateItemSuccess из itemSlice
import { updateCardSuccess } from '@/app/store/actions'; //  Импортируем updateCardSuccess
import { fetchItemData } from './fetchItemData';
import { RootState } from '../../types/types'; //  Импортируй RootState

interface UpdateItemParams {
  type: string;
  id: string;
  data: {
    info?: any;
    info_appearance?: any;
    info_personality?: any;
    info_social?: any;
    status?: any;
    type?: any;
    eventDate?: any;
    markerColor?: any;
  };
  miniature?: File;
  convertFileToByteArray: (file: File) => Promise<number[]>;
}

export const updateItem = createAsyncThunk(
  'item/updateItem',
  async ({ type, id, data, miniature, convertFileToByteArray }: UpdateItemParams, { dispatch, getState }) => {
    const cookies = parseCookies();
    const jwtToken = cookies['jwt'];
    const apiUrl = `http://localhost:3001/update/update/${type}/${id}`;

    const payload: any = {
      info: data.info,
      info_appearance: data.info_appearance,
      info_personality: data.info_personality,
      info_social: data.info_social,
      status: data.status,
      type: data.type,
      eventDate: data.eventDate,
      markerColor: data.markerColor,
    };

    if (miniature) {
      const miniatureData = await convertFileToByteArray(miniature);
      payload.miniature = miniatureData;
    }

    console.log('payload: ', payload);
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

      //  Определяем slug
      let slug = '';
      const projectId = (getState() as RootState).project.projectId;
      if (type === 'projects') {
        slug = 'projects';
      } else if (type === 'ideas') {
        slug = 'ideas';
      } else if (type === 'time_events' || type === 'timelines') {
        slug = `projects/${projectId}/time_events`;
      } else {
        slug = `projects/${projectId}/${type}`;
      }

      dispatch(updateItemSuccess(updatedItem)); //  Диспатчим updateItemSuccess из itemSlice
      dispatch(updateCardSuccess({ item: updatedItem, slug })); //  Диспатчим updateCardSuccess
      dispatch(fetchItemData({ type, id }));
      return updatedItem;
    } catch (error: any) {
      console.error('Error updating item:', error);
      throw error;
    }
  }
);
