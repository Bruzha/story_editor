// store/thunks/updateRelationship.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseCookies } from 'nookies';

interface UpdateRelationshipParams {
  type: string; // 'add' или 'delete'
  endpoint: string; // эндпоинт API
  [key: string]: string | undefined; // Дополнительные параметры (groupId, characterId, и т.д.)
}

export const updateRelationship = createAsyncThunk(
  'relationships/updateRelationship',
  async (params: UpdateRelationshipParams, { rejectWithValue }) => {
    try {
      const token = parseCookies()['jwt'];
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const { type, endpoint, ...body } = params;
      const method = type === 'add' ? 'POST' : 'DELETE';

      const response = await fetch(`http://localhost:3001/addRelationship${endpoint}`, {
        method: method,
        headers: headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || `Failed to ${type} relationship: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || `An error occurred while relationship`);
    }
  }
);
