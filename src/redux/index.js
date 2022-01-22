import {combineReducers} from 'redux';

import onboardingReducer from './onboarding/reducer';
import homeReducer from './home/reducer';



export default combineReducers({
  onboarding: onboardingReducer,
  home: homeReducer,
});