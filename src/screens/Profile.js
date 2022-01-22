import React from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';

import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import auth from '@react-native-firebase/auth';
import { setLogin } from '../redux/onboarding/actions';
import images from './../constants/images';
import colors from './../constants/colors';


const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();


  return (
    <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', justifyContent: 'space-between' }}>
      <View style={{ marginHorizontal: 25 }}>
        <View
          style={{
            marginTop:
              StatusBar.currentHeight + getStatusBarHeight(true) + 25,
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              resizeMode="contain"
              source={images.arrow_backward}
              style={{
                width: 20,
                height: 20,
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 21,
              color: colors.lightBlack,
            }}>
            PROFILE
          </Text>

          <Text></Text>
        </View>
        <View
          style={{
            backgroundColor: '#F8F9F9',
            opacity: 0.4,
            height: 6,
            borderWidth: 0.2,
            borderColor: '#F8F9F9',
            elevation: 8,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowOpacity: 0.1,
            marginHorizontal: -25
          }}
        />
        <View style={{ marginTop: 19 }}>
          <View
            style={{
              borderColor: '#E7EAE9',
              borderBottomWidth: 1,
            }}
          />
          <TouchableOpacity onPress={() => {
            ToastAndroid.show('Feature available soon', ToastAndroid.SHORT);


          }}>
            <Text fontType={'regular'} style={{ fontSize: 16, color:'black', marginVertical: 20, marginHorizontal: 15 }}>
              Rate us
            </Text>
          </TouchableOpacity>
          <View
            style={{
              borderColor: '#E7EAE9',
              borderBottomWidth: 1,
            }}
          />
          <TouchableOpacity onPress={() => {
            ToastAndroid.show('Feature available soon', ToastAndroid.SHORT);


          }}>
            <Text fontType={'regular'} style={{ fontSize: 16, color:'black', marginVertical: 20, marginHorizontal: 15 }}>
              Invite Friends
            </Text>
          </TouchableOpacity>
          <View
            style={{
              borderColor: '#E7EAE9',
              borderBottomWidth: 1,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              auth()
                .signOut()
                .then(() => {
                  dispatch(setLogin(false));
                });
            }}>
            <Text fontType={'regular'} style={{ fontSize: 16, color:'black', marginVertical: 20, marginHorizontal: 15 }}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          height: 40,
          backgroundColor: '#E7EAE9',
          marginHorizontal: -25,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{}}>App Version 1.1</Text>
      </View>
    </View>
  )
}
export default Profile;