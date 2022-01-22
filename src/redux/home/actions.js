import {
  Add_EMPLOYEE,
  Add_EMPLOYEE_SUCCESS,
  GET_EMPLOYEES_LIST,
  GET_EMPLOYEES_LIST_SUCCESS,
  UPDATE_EMPLOYEE,
} from './types';


export const addEmployee = (
  employeeName,
  employeeAddress,
  city,
  state,
  position,
  salary,
  phone,
  emailId
) => (
  {
    type: Add_EMPLOYEE,
    payload: {
      employeeName,
      employeeAddress,
      city,
      state,
      position,
      salary,
      phone,
      emailId
    }
  }
);

export const updateEmployee = (
  id,
  employeeName,
  employeeAddress,
  city,
  state,
  position,
  salary,
  phone,
  emailId
) => (
  {
    type: UPDATE_EMPLOYEE,
    payload: {
      id,
      employeeName,
      employeeAddress,
      city,
      state,
      position,
      salary,
      phone,
      emailId,
    }
  }
);

export const addEmployeeSuccess = () => (
  {
    type: Add_EMPLOYEE_SUCCESS,
  }
);
export const getEmployeeList = phoneNumber => (
  {
    type: GET_EMPLOYEES_LIST,
    payload: phoneNumber
  }
);
export const getEmployeeListSuccess = data => (
  {
    type: GET_EMPLOYEES_LIST_SUCCESS,
    payload: data
  }
);