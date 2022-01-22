
import { all, spawn, call } from 'redux-saga/effects'

// import onboarding from './onboarding/saga';
import homeSaga from './home/saga';

export default function* rootSaga () {
  const sagas = [
    // onboarding,
    homeSaga
  ];

  yield all(sagas.map(saga =>
    spawn(function* () {
      while (true) {
        try {
          yield call(saga)
          break
        } catch (e) {
          console.log(e)
        }
      }
    }))
  );
}