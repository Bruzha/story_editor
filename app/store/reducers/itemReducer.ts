// store/slices/itemSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchItemData } from '../thunks/fetchItemData';

interface ItemData {
  id: number;
  info?: any;
  typeSidebar: 'profile' | 'project' | 'timeline' | 'help' | 'create_character' | '';
  title: string;
  showImageInput?: boolean;
  markerColor?: string;
  [key: string]: any;
}

interface ItemState {
  item: ItemData | null;
  loading: boolean;
  error: string | null;
  cachedItems: { [key: string]: ItemData };
  itemId: string | null;
}

const initialState: ItemState = {
  item: null,
  loading: false,
  error: null,
  cachedItems: {},
  itemId: null,
};

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    setItemFromCache: (state, action: PayloadAction<ItemData>) => {
      state.item = action.payload;
      state.loading = false;
      state.error = null;
    },
    setItemId: (state, action: PayloadAction<string>) => {
      state.itemId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItemData.fulfilled, (state, action: PayloadAction<ItemData>) => {
        state.loading = false;
        state.item = action.payload;
        // Cache the item data
        state.cachedItems[`${action.payload.id}-${action.payload.type}`] = action.payload;
      })
      .addCase(fetchItemData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.item = null;
      });
  },
});

export const { setItemFromCache, setItemId } = itemSlice.actions;
export default itemSlice.reducer;
