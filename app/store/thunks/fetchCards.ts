// src/store/thunks/fetchCards.ts

import { fetchCardsRequest, fetchCardsSuccess, fetchCardsFailure } from '../actions';
import { parseCookies } from 'nookies';
import { AppDispatch, RootState } from '../index';

type TypeSidebar = 'profile' | 'project' | 'timeline' | 'help' | 'create_character' | '';

interface ApiResponse {
  masItems: any[]; // Replace any with the correct type
  typeSidebar: TypeSidebar;
  typeCard: string; // Replace string with the correct type if it's not a string
  title: string;
  subtitle: string;
  createPageUrl: string;
  slug: string;
  displayFields: string[]; // ADD displayFields
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
        masItems: cachedData.items || [], // Provide a default empty array
        typeSidebar: cachedData.typeSidebar || '', // Provide a default empty string
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
      console.log('data: ', data);
      dispatch(fetchCardsSuccess({ ...data, slug: cacheKey }));
    } catch (error: any) {
      dispatch(fetchCardsFailure(error.message));
    }
  };
};
