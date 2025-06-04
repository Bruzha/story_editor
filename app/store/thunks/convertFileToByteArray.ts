// store/thunks/convertFileToByteArray.ts
import { createAsyncThunk } from '@reduxjs/toolkit';

interface ConvertFileToByteArrayParams {
  file: File;
}
export const convertFileToByteArray = createAsyncThunk(
  'item/convertFileToByteArray', // Префикс для избежания конфликтов
  async ({ file }: ConvertFileToByteArrayParams, { rejectWithValue }) => {
    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      return new Promise<number[]>((resolve, reject) => {
        reader.onload = () => {
          if (reader.result) {
            const arrayBuffer = reader.result as ArrayBuffer;
            const byteArray = Array.from(new Uint8Array(arrayBuffer));
            resolve(byteArray);
          } else {
            reject(new Error('File reading error'));
          }
        };
        reader.onerror = (error) => {
          reject(error);
        };
      });
    } catch (e: any) {
      console.error('convertFileToByteArray', e);
      return rejectWithValue(e.message || 'An error occurred during file conversion');
    }
  }
);
