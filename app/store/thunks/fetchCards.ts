import { fetchCardsRequest, fetchCardsSuccess, fetchCardsFailure } from '../actions';
import { parseCookies } from 'nookies';
import { AppDispatch } from '../index';
import { RootState } from '../../types/types';

export const fetchCards = (slug: string[], projectId?: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const { cachedData } = getState().posts;
    const cacheKey = slug.join('/');
    console.log('Fetch projectId: ' + projectId);
    if (cachedData[cacheKey]) {
      const { items, typeSidebar, typeCard, title, subtitle, createPageUrl } = cachedData[cacheKey]!;
      dispatch(
        fetchCardsSuccess({ masItems: items, typeSidebar, typeCard, title, subtitle, createPageUrl, slug: cacheKey })
      );
      return;
    }
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
