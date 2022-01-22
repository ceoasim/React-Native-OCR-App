import React from 'react';
import { View, StatusBar, Text, Pressable, FlatList, TouchableOpacity, Image, ToastAndroid } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { getStatusBarHeight } from 'react-native-status-bar-height';


import { useNavigation } from '@react-navigation/native';
import * as selectors from '../redux/home/selectors';

import images from './../constants/images';
import colors from './../constants/colors';

const EmployeeView = ({ item }) => {
  console.log('navi', useNavigation());
  // const navigation = useNavigation();

  return (
    <View>

      <Pressable
        onPress={() => navigation.navigate('BasicDetails', { viewEmployeeData: item })}
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
            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'white' }}>asim</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '900', marginLeft: 10 }}>
            {item.employeeName}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('BasicDetails', { editEmployeeData: item })}>
            <Image resizeMode={'contain'} style={{ width: 20, height: 20, tintColor:'blue' }} source={images.edit} />
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

              });
          }} >
            <Image resizeMode={'contain'} style={{ width: 18, height: 18, marginLeft: 7, tintColor: 'red' }} source={images.trash} />
          </TouchableOpacity>
        </View>
      </Pressable>
    </View>
  )
}
export default EmployeeView