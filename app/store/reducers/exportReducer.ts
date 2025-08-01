// store/slices/exportSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchProjectDataForExport } from '../thunks/fetchProjectDataForExport';

interface ExportState {
  projectData: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ExportState = {
  projectData: null,
  loading: false,
  error: null,
};

const exportReducer = createSlice({
  name: 'export',
  initialState,
  reducers: {
    clearProjectData: (state) => {
      state.projectData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectDataForExport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectDataForExport.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.projectData = action.payload;
      })
      .addCase(fetchProjectDataForExport.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProjectData } = exportReducer.actions;
export default exportReducer.reducer;
