import { combineReducers } from 'redux';
import { cardsReducer } from './cardsReducer';
import projectReducer from './projectReducer';

export const rootReducer = combineReducers({
  posts: cardsReducer,
  project: projectReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
