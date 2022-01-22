import { call, put, takeEvery, select, takeLatest } from 'redux-saga/effects'

import {
  GET_EMPLOYEES_LIST,
  Add_EMPLOYEE,
  UPDATE_EMPLOYEE,
} from './types'
import * as Actions from './actions'
import { Api } from './api'

function* addEmployee(action) {
  try {

    const data = yield call(Api.addEmployee, action.payload);
    yield put(Actions.addEmployeeSuccess())

  } catch (error) {
    yield put(Actions.requestFailed(error.message));
  }
}
function* updateEmployee(action) {
  try {

    const data = yield call(Api.updateEmployee, action.payload);
    yield put(Actions.addEmployeeSuccess())

  } catch (error) {
    // yield put(Actions.requestFailed(error.message));
  }
}
function* getEmployeeList() {
  try {

    const data = yield call(Api.getEmployeeList);
    yield put(Actions.getEmployeeListSuccess(data))

  } catch (error) {
    // yield put(Actions.requestFailed(error.message));
  }
}



function* homeSaga() {
  yield takeLatest(GET_EMPLOYEES_LIST, getEmployeeList);
  yield takeLatest(Add_EMPLOYEE, addEmployee);
  yield takeLatest(UPDATE_EMPLOYEE, updateEmployee);

}


export default homeSaga;