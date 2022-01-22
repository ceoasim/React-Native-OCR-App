import React, { useEffect, useState } from 'react';
import { View, StatusBar, Text, Pressable, FlatList, TouchableOpacity, Image, ToastAndroid, ActivityIndicator } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Tts from 'react-native-tts';

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


  const textList = selectors.getTextList();


  const renderListItem = ({ item }) => {

    return (
      <View>

        <View
          style={{
            backgroundColor: '#eee',
            padding: 12,
            alignItems: 'center',
            opacity: 1,
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text numberOfLines={1} style={{ fontSize: 18, fontWeight: '900', width:200 }}>
              {item.text}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => Tts.speak(item.text)}>
              <Image resizeMode={'contain'} style={{ width: 20, height: 20 }} source={images.tracking} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Tts.stop(item.text)}>
              <Image resizeMode={'contain'} style={{ width: 20, height: 20, marginLeft:20 }} source={images.close} />
            </TouchableOpacity>
          </View>
        </View>
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
            Text To Speech
          </Text>
          <View />
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

      {textList.length ? <FlatList
        data={textList}
        renderItem={(item) => renderListItem(item)}

        keyExtractor={(item) => item.id}
      /> : <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 18, fontWeight: 'bold' }}>
        No data found</Text>}
    </View>
  );

}

export default Home;