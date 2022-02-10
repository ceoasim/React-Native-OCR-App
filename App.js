import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  Text
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


import AsyncStorage from '@react-native-community/async-storage';
import { PersistGate } from 'redux-persist/integration/react';

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';

import createSagaMiddleware from 'redux-saga'


import { persistStore, persistReducer } from 'redux-persist'

import reducers from './src/redux/index';
import Reactotron from './ReactotronConfig';
import rootSaga from './src/redux/sagas';
import * as Actions from './src/redux/actions';
import SplashScreen from 'react-native-splash-screen'


//  var store;

const sagaMonitor = Reactotron.createSagaMonitor()

const sagaMiddleware = createSagaMiddleware({ sagaMonitor })

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [
    // 'onboarding'
  ]
};
var store;
const persistedReducer = persistReducer(persistConfig, reducers);
//  Reactotron
if (__DEV__) {
  store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(sagaMiddleware),
      Reactotron.createEnhancer(),
    ),
  );
} else {
  store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(sagaMiddleware)
    ),
  );
}

sagaMiddleware.run(rootSaga);
let persistor = persistStore(store)


import Login from './src/screens/Login'
import Profile from './src/screens/Profile'
import OtpInput from './src/screens/OtpInput'
import Home from './src/screens/Home'
import ImageToTextStack from './src/screens/ImageToText'
import PasswordLogin from './src/screens/PasswordLogin'
import EmailSignup from './src/screens/EmailSignup'
import images from './src/constants/images'
import DigiSign from './src/screens/DigiSign';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App(navigation) {

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [loading, setloading] = useState(store.getState().home.loading);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  function handleChange() {
    let currentValue = store.getState();
    // if (currentValue.signup.login == true) {
    setLoggedIn(currentValue.onboarding.login);
    // }
  }

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = store.subscribe(handleChange);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
		SplashScreen.hide()
	
	  }, [])

  // Firestore subscribe
  useEffect(() => {
    var unsubscribe = null;

    if (user) {
      unsubscribe = firestore()
        .collection('Employees')
        .doc(auth()?.currentUser?.uid)
        .collection('EmployeeData')
        .get();
      store.dispatch(Actions.login());

    }

    if (unsubscribe) return unsubscribe;
  }, [user, loggedIn, loading, Tab]);

  if (initializing) return null;

  if (loggedIn || (user && user.displayName && user.email)) {

    const HomeStack = () => {
      return (
        <Stack.Navigator headerMode={false} initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              animationEnabled: false
            }}
          />
        </Stack.Navigator>
      );
    };
    const ImageStack = () => {
      return (
        <Stack.Navigator headerMode={false} initialRouteName="Home">
          <Stack.Screen
            name="ImageStack"
            component={ImageToTextStack}
            options={{
              animationEnabled: false
            }}
          />
        </Stack.Navigator>
      );
    };
    const SignatureStack = () => {
      return (
        <Stack.Navigator headerMode={false} initialRouteName="Attendance">
          <Stack.Screen
            name="DigiSign"
            component={DigiSign}
            options={{
              animationEnabled: false
            }}
          />
        </Stack.Navigator>
      );
    };
    
    // const SearchStack = () => {
    //   return (
    //     <Stack.Navigator headerMode={false} initialRouteName="Search">
    //       <Stack.Screen
    //         name="Home"
    //         component={Home}
    //         options={{
    //           animationEnabled: false
    //         }}
    //       />
    //     </Stack.Navigator>
    //   );
    // };

    const ProfileStack = () => {
      return (
        <Stack.Navigator headerMode={false} initialRouteName="Profile">
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              animationEnabled: false
            }}
          />
        </Stack.Navigator>
      );
    };

    const BottomTabNavigator = () => {
      return (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {


              if (route.name === 'HomeStack') {
                return (
                  <Image
                    style={{ tintColor: color, height: size, width: size }}
                    source={images.home_icon}
                  />
                );
              } else if (route.name === 'ImageStack') {
                return (
                  <Image
                    style={{ tintColor: color, height: size, width: size, resizeMode:'contain' }}
                    source={images.camera_new}
                  />

                );
              } else if (route.name === 'SignatureStack') {
                return (
                  <Image
                    resizeMode='contain'
                    style={{ tintColor: color, height: size, width: size }}
                    source={images.attendance}
                  />
                );
              }
              //  else if (route.name === 'SearchStack') {
              //   return (
              //     <Image
              //       resizeMode='contain'
              //       style={{ tintColor: color, height: size, width: size }}
              //       source={images.search}
              //     />
              //   );
              // }
              else if (route.name === 'ProfileStack') {
                return (
                  <Image
                    resizeMode='contain'

                    style={{ tintColor: color, height: size, width: size }}
                    source={images.profile_silhouette}
                  />
                );
              }
            },
          })}
          tabBarOptions={{
            activeTintColor: '#00AEF0',
            inactiveTintColor: 'gray',
            showLabel: false,
          }}>
          <Tab.Screen name="HomeStack" component={HomeStack} />
          <Tab.Screen name="ImageStack" component={ImageStack} />
          <Tab.Screen name="SignatureStack" component={SignatureStack} />
          {/* <Tab.Screen name="SearchStack" component={SearchStack} /> */}
          <Tab.Screen name="ProfileStack" component={ProfileStack} />
        </Tab.Navigator>
      );
    };
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            {/* Rest of your app code */}
            <Stack.Navigator initialRouteName="BottomTabNavigator" headerMode='none' >
              <Stack.Screen
                name="BottomTabNavigator"
                component={BottomTabNavigator}
                options={{
                  animationEnabled: false
                }}
              />


            </Stack.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    );
  }
  else {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            {/* Rest of your app code */}
            <Stack.Navigator initialRouteName="Login" headerMode='none' >
              <Stack.Screen
                name="Login"
                component={Login}
                options={{
                  animationEnabled: false
                }}
              />
              <Stack.Screen
                name="OtpInput"
                component={OtpInput}
                options={{
                  animationEnabled: false
                }}
              />
              <Stack.Screen
                name="EmailSignup"
                component={EmailSignup}
                options={{
                  animationEnabled: false
                }}
              />
              <Stack.Screen name="PasswordLogin" component={PasswordLogin} options={{
                animationEnabled: false
              }} />

            </Stack.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    );
  }
};

