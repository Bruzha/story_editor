// src/store/thunks/fetchCards.ts
import { fetchCardsRequest, fetchCardsSuccess, fetchCardsFailure } from '../actions';
import { parseCookies } from 'nookies';
import { AppDispatch } from '../index';

export const fetchCards = (slug: string[], projectId?: string) => {
  return async (dispatch: AppDispatch) => {
    const cacheKey = slug.join('/');
    console.log('Fetch projectId: ' + projectId);
    dispatch(fetchCardsRequest());
    try {
      const cookies = parseCookies();
      const token = cookies['jwt'];

      if (!token) {
        throw new Error('No token found');
      }

      const SlugToString = slug.join('/');
      const apiUrl = `http://localhost:3001/getCards/${SlugToString}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching ${SlugToString}: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(fetchCardsSuccess({ ...data, slug: cacheKey }));
    } catch (error: any) {
      dispatch(fetchCardsFailure(error.message));
    }
  };
};
