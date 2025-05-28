import { combineReducers } from 'redux';
import { cardsReducer } from './cardsReducer';
import projectReducer from './projectReducer';
import itemReducer from './itemReducer';
import createPageReducer from './createPageReducer';

export const rootReducer = combineReducers({
  posts: cardsReducer,
  project: projectReducer,
  item: itemReducer,
  createPage: createPageReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
