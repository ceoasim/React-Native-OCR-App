import {
  ADD_TEXT
} from './types';

const INITIAL_STATE = {
  loading: false,
  textList: [],
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {

    case ADD_TEXT:
      const textList = state.textList
      return { ...state, textList:[...textList, action.payload]};

    default:
      return state;
  }
};
