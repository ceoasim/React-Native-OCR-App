
import {
  ADD_PHONE_NUMBER,
  ADD_EMAIL,
  CHECK_LOGIN
} from './types';

const INITIAL_STATE = {
  phoneNumber: '',
  email: '',
  login: false,
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {

      case ADD_PHONE_NUMBER:
          return {...state, phoneNumber: payload};
      case ADD_EMAIL:
          return {...state, email: payload};
      case CHECK_LOGIN:
          return {...state, login: payload};

      default:
          return state;
  }
};