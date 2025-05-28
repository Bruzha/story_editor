import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchItemData } from '../thunks/fetchItemData';

interface ItemData {
  id: number;
  info?: any;
  typeSidebar: 'profile' | 'project' | 'timeline' | 'help' | 'create_character' | '';
  title: string;
  showImageInput?: boolean;
  [key: string]: any;
}

interface ItemState {
  item: ItemData | null;
  loading: boolean;
  error: string | null;
  cachedItems: { [key: string]: ItemData };
  itemId: string | null;
  characterName: string | null;
}

const initialState: ItemState = {
  item: null,
  loading: false,
  error: null,
  cachedItems: {},
  itemId: null,
  characterName: null,
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
    setCharacterName: (state, action: PayloadAction<string | null>) => {
      state.characterName = action.payload;
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
        if (action.payload.info && action.payload.info.name && action.payload.info.name.value) {
          state.characterName = action.payload.info.name.value;
        }
        state.cachedItems[`${action.payload.id}-${action.payload.type}`] = action.payload;
      })
      .addCase(fetchItemData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.item = null;
      });
  },
});

export const { setItemFromCache, setItemId, setCharacterName } = itemSlice.actions;
export default itemSlice.reducer;
