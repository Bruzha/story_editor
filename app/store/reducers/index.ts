import { combineReducers } from 'redux';
import { cardsReducer } from './cardsReducer';
import projectReducer from './projectReducer';
import itemReducer from './itemReducer';

export const rootReducer = combineReducers({
  posts: cardsReducer,
  project: projectReducer,
  item: itemReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
