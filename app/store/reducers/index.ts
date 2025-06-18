import { combineReducers } from 'redux';
import { cardsReducer } from './cardsReducer';
import projectReducer from './projectReducer';
import itemReducer from './itemReducer';
import createPageReducer from './createPageReducer';
import characterReducer from './characterReducer';
import exportReducer from './exportReducer';
import { authReducer } from './authReducer';
import { userReducer } from './userReducer';
import { filtersReducer } from './filtersReducer';

export const rootReducer = combineReducers({
  cards: cardsReducer,
  project: projectReducer,
  item: itemReducer,
  createPage: createPageReducer,
  character: characterReducer,
  export: exportReducer,
  auth: authReducer,
  user: userReducer,
  filters: filtersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
