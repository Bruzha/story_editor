import { fetchCardsRequest, fetchCardsSuccess, fetchCardsFailure } from '../actions';
import { parseCookies } from 'nookies';
import { AppDispatch } from '../index';
import { RootState } from '../../types/types';

export const fetchCards = (slug: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const { cachedData } = getState().posts;

    // Проверяем, есть ли данные в кэше
    if (cachedData[slug]) {
      // Если есть, используем кэшированные данные
      const { items, typeSidebar, typeCard, title, subtitle, createPageUrl } = cachedData[slug]!;
      dispatch(fetchCardsSuccess({ masItems: items, typeSidebar, typeCard, title, subtitle, createPageUrl, slug })); // Передаем slug
      return;
    }

    dispatch(fetchCardsRequest());

    try {
      const cookies = parseCookies();
      const token = cookies['jwt'];

      if (!token) {
        throw new Error('No token found');
      }

      const apiUrl = `http://localhost:3001/auth/${slug}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching ${slug}: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(fetchCardsSuccess({ ...data, slug })); // Передаем весь объект data
    } catch (error: any) {
      dispatch(fetchCardsFailure(error.message));
    }
  };
};
