import { deleteCardRequest, deleteCardSuccess, deleteCardFailure } from '../actions';
import { parseCookies } from 'nookies';
import { AppDispatch } from '../index';
import { fetchCards } from './fetchCards';

export const deleteCard = (id: number, type: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(deleteCardRequest());

    try {
      const cookies = parseCookies();
      const token = cookies['jwt'];

      if (!token) {
        throw new Error('No token found');
      }

      const apiUrl = `http://localhost:3001/auth/${type}s/delete?projectId=${id}`;

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
      // После успешного удаления перезагружаем данные
      dispatch(fetchCards(type + 's'));
    } catch (error: any) {
      dispatch(deleteCardFailure(error.message));
    }
  };
};
