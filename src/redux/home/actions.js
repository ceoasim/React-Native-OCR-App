import {
  ADD_TEXT, LOGIN,
} from './types';


export const addText = (
  text
) => (
  {
    type: ADD_TEXT,
    payload: {
      text
    }
  }
);

export const login = (
  
) => (
  {
    type: LOGIN,
  }
);
