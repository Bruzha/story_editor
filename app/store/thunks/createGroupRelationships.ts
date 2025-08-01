// store/thunks/createGroupRelationships.ts
import { parseCookies } from 'nookies';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface CreateGroupRelationshipsParams {
  itemId: string;
  type: string;
  data: any;
}
export const createGroupRelationships = createAsyncThunk(
  'item/createGroupRelationships',
  async ({ itemId, type, data }: CreateGroupRelationshipsParams, { rejectWithValue }) => {
    const token = parseCookies()['jwt'];
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const characterPromises =
      data.characterIds?.map((characterId: string) =>
        fetch(`http://localhost:3001/addRelationship/${type}/add-character`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ itemId, characterId }),
        })
      ) || [];

    const locationPromises =
      data.locationIds?.map((locationId: string) =>
        fetch(`http://localhost:3001/addRelationship/${type}/add-location`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ itemId, locationId }),
        })
      ) || [];

    const objectPromises =
      data.objectIds?.map((objectId: string) =>
        fetch(`http://localhost:3001/addRelationship/${type}/add-object`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ itemId, objectId }),
        })
      ) || [];

    const timeEventPromises =
      data.eventIds?.map((eventId: string) =>
        fetch(`http://localhost:3001/addRelationship/${type}/add-timeEvent`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ itemId, eventId }),
        })
      ) || [];

    const chapterPromises =
      data.chapterIds?.map((chapterId: string) =>
        fetch(`http://localhost:3001/addRelationship/${type}/add-chapter`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ itemId, chapterId }),
        })
      ) || [];

    try {
      await Promise.all([
        ...characterPromises,
        ...locationPromises,
        ...objectPromises,
        ...timeEventPromises,
        ...chapterPromises,
      ]);
      console.log('Relationships created successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error creating relationships:', error);
      return rejectWithValue(error.message || 'Error creating relationships');
    }
  }
);
