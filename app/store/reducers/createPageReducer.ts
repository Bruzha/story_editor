import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCreatePageData } from '../thunks/fetchCreatePageData';

interface MasTitleItem {
  key: string;
  title: string;
  placeholder?: string;
  removable?: boolean;
}

interface CreatePageData {
  title: string;
  type: string;
  masTitle: MasTitleItem[];
  showImageInput?: boolean;
  showMarkerColorInput?: boolean;
  typeSidebar: 'project' | 'profile' | 'timeline' | 'help' | 'create_character' | 'create_new_character' | '';
}

interface CreatePageState {
  createPageData: CreatePageData | null;
  loading: boolean;
  error: string | null;
}

const initialState: CreatePageState = {
  createPageData: null,
  loading: false,
  error: null,
};

const createPageReducer = createSlice({
  name: 'createPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreatePageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreatePageData.fulfilled, (state, action: PayloadAction<CreatePageData>) => {
        state.loading = false;
        state.createPageData = action.payload;
      })
      .addCase(fetchCreatePageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.createPageData = null;
      });
  },
});

export const {} = createPageReducer.actions;
export default createPageReducer.reducer;
