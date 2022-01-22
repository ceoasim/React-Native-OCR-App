import {
  Add_EMPLOYEE,
  Add_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE,
  GET_EMPLOYEES_LIST,
  GET_EMPLOYEES_LIST_SUCCESS,
} from './types';

const INITIAL_STATE = {
  loading: false,
  employeeList: [],
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {

    case UPDATE_EMPLOYEE:
    case Add_EMPLOYEE:

      return { ...state, loading: true };

    case Add_EMPLOYEE_SUCCESS:
      return { ...state, loading: false };

    case GET_EMPLOYEES_LIST:
      return { ...state };

    case GET_EMPLOYEES_LIST_SUCCESS:
      return { ...state, employeeList: action.payload };


    default:
      return state;
  }
};
