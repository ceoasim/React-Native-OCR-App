import React, { useEffect, useState } from 'react';
import { View, StatusBar, Text, Pressable, FlatList, TouchableOpacity, Image, ToastAndroid, ActivityIndicator } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { getStatusBarHeight } from 'react-native-status-bar-height';


import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import * as Actions from '../redux/actions';

import * as selectors from '../redux/home/selectors';

import images from './../constants/images';
import colors from './../constants/colors';


const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [leaveList, setLeaveList] = useState([])
  const [loading, setLoading] = useState(false)


  const employeesList = selectors.getEmployeeList();

  useEffect(async () => {
    setLoading(true)
    await firestore()
      .collection('Employees')
      .doc(auth()?.currentUser?.uid)
      .collection('Leave_Applications')
      .get().then(snapshot => {
        setLeaveList(snapshot)
        setLoading(false)
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }, [])
  useEffect(() => {

    // Subscribe for the focus Listener
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true)
      await firestore()
        .collection('Employees')
        .doc(auth()?.currentUser?.uid)
        .collection('Leave_Applications')
        .get().then(snapshot => {
          setLeaveList(snapshot)
          setLoading(false)
        })
        .catch(err => {
          console.log('Error getting documents', err);
        });
    });

    return unsubscribe;
  }, [navigation]);


  const renderListItem = ({ item }) => {

    return (
      <View>

        <Pressable
          onPress={() => navigation.navigate('Home', { viewEmployeeData: item })}
          style={({ pressed }) => ({
            backgroundColor: '#eee',
            padding: 12,
            alignItems: 'center',
            opacity: pressed ? 0.5 : 1,
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between'
          })}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ height: 60, width: 60, borderRadius: 60, backgroundColor: '#5F5F5F', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'white' }}>{item.employeeName.substring(0,1)}</Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: '900', marginLeft: 10 }}>
              {item.employeeName}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Home', { editEmployeeData: item })}>
              <Image resizeMode={'contain'} style={{ width: 20, height: 20, tintColor: '#00AEF0' }} source={images.edit} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              firestore()
                .collection('Employees')
                .doc(auth()?.currentUser?.uid)
                .collection('EmployeeData')
                .doc(item.id)
                .delete()
                .then(() => {
                  ToastAndroid.show('Employee removed.', ToastAndroid.SHORT);
                  dispatch(Actions.getEmployeeList())
                });


            }} >
              <Image resizeMode={'contain'} style={{ width: 18, height: 18, marginLeft: 7, tintColor: 'red' }} source={images.trash} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </View>
    )
  }
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
        <View
          style={{
            marginTop:
              StatusBar.currentHeight + getStatusBarHeight(true) + 25,
            marginBottom: 20,
            marginHorizontal: 25,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Text />
            <Text
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 21,
                color: colors.lightBlack,
              }}>
              OCR
            </Text>
            <View/>
          </View>
        </View>
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            opacity: 0.4,
            height: 6,
            borderWidth: 0.2,
            borderColor: '#F8F9F9',
            elevation: 10,
            shadowColor: 'rgba(0, 0, 0, 0.9)',
            shadowOpacity: 0.5,
          }}
        />
        <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 18, fontWeight: 'bold' }}>
          Work is in progress</Text>
      </View>
    );
  
}

export default Home;