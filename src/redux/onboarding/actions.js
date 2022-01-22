import {
  ADD_PHONE_NUMBER,
  ADD_EMAIL,
  CHECK_LOGIN,
} from './types';


export const updatePhoneNumber = phoneNumber => (
  {
      type: ADD_PHONE_NUMBER,
      payload: phoneNumber
  }
);
export const updateEmail = email => (
  {
      type: ADD_EMAIL,
      payload: email
  }
);
export const setLogin = boolValue => (
  {
      type: CHECK_LOGIN,
      payload: boolValue
  }
);