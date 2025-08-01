// store/thunks/fetchExistingRelationships.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseCookies } from 'nookies';

interface FetchExistingRelationshipsParams {
  type: string;
  id: string;
}

interface ExistingRelationships {
  characterIds: string[];
  locationIds: string[];
  objectIds: string[];
  eventIds: string[];
  chapterIds: string[];
}

export const fetchExistingRelationships = createAsyncThunk<
  ExistingRelationships,
  FetchExistingRelationshipsParams,
  { rejectValue: string }
>('item/fetchExistingRelationships', async ({ type, id }: FetchExistingRelationshipsParams, { rejectWithValue }) => {
  try {
    const token = parseCookies()['jwt'];
    const apiUrl = `http://localhost:3001/addRelationship/getExistingRelationships/${type}/${id}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || `Failed to fetch existing relationships: ${response.status}`);
    }

    const data: ExistingRelationships = await response.json();
    console.log('data: ', data);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'An error occurred while fetching existing relationships');
  }
});
