// store/thunks/fetchProjectDataForExport.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseCookies } from 'nookies';

interface ProjectDataForExport {
  project: any;
  characters: any[];
  locations: any[];
  objects: any[];
  chapters: any[];
  groups: any[];
  notes: any[];
  plotLines: any[];
  timelineEvents: any[];
}

export const fetchProjectDataForExport = createAsyncThunk<ProjectDataForExport, string, { rejectValue: string }>(
  'project/fetchProjectDataForExport',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const cookies = parseCookies();
      const token = cookies['jwt'];

      if (!token) {
        return rejectWithValue('No token found in cookies');
      }

      const apiUrl = `http://localhost:3001/export/projectData/${projectId}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue(`Error fetching project data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);
