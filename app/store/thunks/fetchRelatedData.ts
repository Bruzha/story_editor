// store/thunks/fetchRelatedData.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseCookies } from 'nookies';

interface FetchRelatedDataParams {
  type: string;
  projectId: string | undefined;
}
export const fetchRelatedData = createAsyncThunk(
  'item/fetchRelatedData', // Префикс для избежания конфликтов
  async ({ type, projectId }: FetchRelatedDataParams, { rejectWithValue }) => {
    if (!projectId || !type) {
      return rejectWithValue('projectId or type is missing');
    }
    try {
      const token = parseCookies()['jwt'];
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const charactersResponse = await fetch(`http://localhost:3001/getCards/projects/${projectId}/characters`, {
        headers,
      });
      const locationsResponse = await fetch(`http://localhost:3001/getCards/projects/${projectId}/locations`, {
        headers,
      });
      const objectsResponse = await fetch(`http://localhost:3001/getCards/projects/${projectId}/objects`, {
        headers,
      });
      const timeEventsResponse = await fetch(`http://localhost:3001/getCards/projects/${projectId}/time_events`, {
        headers,
      });
      const chaptersResponse = await fetch(`http://localhost:3001/getCards/projects/${projectId}/chapters`, {
        headers,
      });

      if (
        !charactersResponse.ok ||
        !locationsResponse.ok ||
        !objectsResponse.ok ||
        !timeEventsResponse.ok ||
        !chaptersResponse.ok
      ) {
        const errorData = await charactersResponse.json();
        const errorMessage = `Failed to fetch related data: ${charactersResponse.status} - ${errorData.message}`;
        console.error(errorMessage);
        return rejectWithValue(errorMessage);
      }

      const charactersData = await charactersResponse.json();
      const locationsData = await locationsResponse.json();
      const objectsData = await objectsResponse.json();
      const timeEventsData = await timeEventsResponse.json();
      const chaptersData = await chaptersResponse.json();
      console.log('charactersData', charactersData);
      console.log('locationsData', locationsData);
      console.log('objectsData', objectsData);
      console.log('timeEventsData', timeEventsData);
      console.log('chaptersData', chaptersData);

      const charactersForCheckboxes = charactersData.masItems.map((item: any) => ({
        id: item.id,
        title: item.info.name.value || '',
      }));
      const locationsForCheckboxes = locationsData.masItems.map((item: any) => ({
        id: item.id,
        title: item.info.name.value || '',
      }));
      const objectsForCheckboxes = objectsData.masItems.map((item: any) => ({
        id: item.id,
        title: item.info.name.value || '',
      }));
      const timeEventsForCheckboxes = timeEventsData.masItems.map((item: any) => ({
        id: item.id,
        title: item.info.name.value + ' (' + item.eventDate + ')',
      }));
      const chaptersForCheckboxes = chaptersData.masItems.map((item: any) => ({
        id: item.id,
        title: item.info.order.value + '. ' + item.info.title.value,
      }));
      return {
        characters: charactersForCheckboxes,
        locations: locationsForCheckboxes,
        objects: objectsForCheckboxes,
        timeEvents: timeEventsForCheckboxes,
        chapters: chaptersForCheckboxes,
        relatedData: true,
      };
    } catch (error: any) {
      console.error('Error fetching related data:', error);
      return rejectWithValue(error.message || 'An error occurred while fetching related data');
    }
  }
);
