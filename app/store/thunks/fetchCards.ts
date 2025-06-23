// src/store/thunks/fetchCards.ts

import { fetchCardsRequest, fetchCardsSuccess, fetchCardsFailure } from '../actions';
import { parseCookies } from 'nookies';
import { AppDispatch, RootState } from '../index';

type TypeSidebar = 'profile' | 'project' | 'timeline' | 'help' | 'create_character' | string | '';

interface ApiResponse {
  masItems: any[];
  typeSidebar: TypeSidebar;
  typeCard: string;
  title: string;
  subtitle: string;
  createPageUrl: string;
  slug: string;
  displayFields: string[];
}

export const fetchCards = (slug: string[]) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const cacheKey = slug.join('/');
    const cachedData = getState().cards.cachedData[cacheKey];

    if (cachedData) {
      console.log('Using cached data for slug: ' + cacheKey);
      const apiResponse: ApiResponse = {
        ...cachedData,
        slug: cacheKey,
        masItems: cachedData.items || [],
        typeSidebar: cachedData.typeSidebar || '',
        typeCard: cachedData.typeCard || '',
        title: cachedData.title || '',
        subtitle: cachedData.subtitle || '',
        createPageUrl: cachedData.createPageUrl || '',
        displayFields: cachedData.displayFields || [],
      };
      dispatch(fetchCardsSuccess(apiResponse));

      return;
    }

    console.log('cachedData: ', cachedData);
    console.log('Fetching data from API for slug: ' + cacheKey);
    dispatch(fetchCardsRequest());
    try {
      const cookies = parseCookies();
      const token = cookies['jwt'];

      if (!token) {
        throw new Error('No token found');
      }

      const SlugToString = slug.join('/');
      const apiUrl = `http://localhost:3001/getCards/${SlugToString}`;
      console.log('apiUrl: ', apiUrl);
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
