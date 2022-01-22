import { call, put, takeEvery, select, takeLatest } from 'redux-saga/effects'

import {
  ADD_TEXT,
} from './types'
import * as Actions from './actions'
import { Api } from './api'

function* addEmployee(action) {
  try {

    const data = yield call(Api.addEmployee, action.payload);

  } catch (error) {
    console.log("yooy");
  }
}


function* homeSaga() {
  yield takeLatest(ADD_TEXT, addEmployee);

}


export default homeSaga;