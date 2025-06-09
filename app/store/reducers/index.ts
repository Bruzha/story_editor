import { combineReducers } from 'redux';
import { cardsReducer } from './cardsReducer';
import projectReducer from './projectReducer';
import itemReducer from './itemReducer';
import createPageReducer from './createPageReducer';
import characterReducer from './characterReducer';
import exportReducer from './exportReducer';

export const rootReducer = combineReducers({
  posts: cardsReducer,
  project: projectReducer,
  item: itemReducer,
  createPage: createPageReducer,
  character: characterReducer,
  export: exportReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
