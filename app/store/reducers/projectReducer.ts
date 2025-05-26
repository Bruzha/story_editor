import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
  projectId: string | null;
}

const initialState: ProjectState = {
  projectId: null,
};

export const projectReducer = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectId: (state, action: PayloadAction<string>) => {
      state.projectId = action.payload;
    },
    clearProjectId: (state) => {
      state.projectId = null;
    },
  },
});

export const { setProjectId, clearProjectId } = projectReducer.actions;
export default projectReducer.reducer;
