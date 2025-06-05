// store/slices/characterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CharacterState {
  characters: { [key: string]: { value: any } }; // Например, имя, возраст и т.д.
  appearance: { [key: string]: { value: any } }; // Например, рост, вес и т.д.
  personality: { [key: string]: { value: any } }; // Например, черты характера
  social: { [key: string]: { value: any } }; // Например, связи
  miniature: number[] | null;
  markerColor: string | null;
  projectId: string | null;
}

const initialState: CharacterState = {
  characters: {},
  appearance: {},
  personality: {},
  social: {},
  miniature: null,
  markerColor: null,
  projectId: null,
};

const characterReducer = createSlice({
  name: 'character',
  initialState,
  reducers: {
    setCharacterData: (
      state,
      action: PayloadAction<{
        typePage: string;
        data: { [key: string]: { value: any } };
      }>
    ) => {
      const { typePage, data } = action.payload;
      switch (typePage) {
        case 'characters':
          state.characters = { ...state.characters, ...data };
          break;
        case 'appearance':
          state.appearance = { ...state.appearance, ...data };
          break;
        case 'personality':
          state.personality = { ...state.personality, ...data };
          break;
        case 'social':
          state.social = { ...state.social, ...data };
          break;
      }
      return state;
    },
    setMiniature: (state, action: PayloadAction<number[] | null>) => {
      state.miniature = action.payload;
    },
    setMarkerColor: (state, action: PayloadAction<string | null>) => {
      state.markerColor = action.payload;
    },
    setProjectId: (state, action: PayloadAction<string | null>) => {
      state.projectId = action.payload;
    },
    clearCharacterData: () => {
      return initialState;
    },
  },
});

export const { setCharacterData, setMiniature, setMarkerColor, setProjectId, clearCharacterData } =
  characterReducer.actions;
export default characterReducer.reducer;
