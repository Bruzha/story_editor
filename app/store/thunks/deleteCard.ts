import { deleteCardRequest, deleteCardSuccess, deleteCardFailure } from '../actions';
import { parseCookies } from 'nookies';
import { AppDispatch } from '../index';
import { fetchCards } from './fetchCards';
import { RootState } from '../../types/types';

export const deleteCard = (id: number, type: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(deleteCardRequest());

    try {
      const cookies = parseCookies();
      const token = cookies['jwt'];

      if (!token) {
        throw new Error('No token found');
      }

      const apiUrl = `http://localhost:3001/auth/${type}s/delete?${type}Id=${id}`;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error deleting ${type}: ${response.status} ${response.statusText}`);
      }

      dispatch(deleteCardSuccess(id));
      const projectId = getState().project.projectId;
      dispatch(fetchCards([type + 's'], projectId));
    } catch (error: any) {
      dispatch(deleteCardFailure(`Error deleting character: ${error.message}`));
    }
  };
};
