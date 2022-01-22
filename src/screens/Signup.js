import auth from '@react-native-firebase/auth';

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ToastAndroid, TouchableOpacity, Image, Linking, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Signup = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const fieldRef = useRef();
  const actionSheetRef = useRef();

  function emailValidation(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }

  const showModalVisible = () => {
    actionSheetRef.current?.setModalVisible(true);
  }
  const hideModalVisible = () => {
    actionSheetRef.current?.setModalVisible(false);
  }

  actionSheetRef.current?.snapToOffset(300);

  // Handle create account button press
  const createAccount = async () => {
    try {
      await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      console.log('User account created & signed in!');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
      console.error(error);
    }
  }

  // const pickSingleWithCamera = (cropping, mediaType = 'photo') => {
  //   ImagePicker.openCamera({
  //     cropping: cropping,
  //     width: 500,
  //     height: 500,
  //     includeExif: true,
  //     mediaType,
  //   })
  //     .then((image) => {
  //       console.log('received image', image);
  //       setImageUri(image.path)

  //     })
  //     .catch((e) => alert(e));
  // }


  // const pickSingle = (cropit, circular = false, mediaType) => {
  //   ImagePicker.openPicker({
  //     width: 500,
  //     height: 500,
  //     cropping: cropit,
  //     cropperCircleOverlay: circular,
  //     sortOrder: 'none',
  //     compressImageMaxWidth: 1000,
  //     compressImageMaxHeight: 1000,
  //     compressImageQuality: 1,
  //     compressVideoPreset: 'MediumQuality',
  //     includeExif: true,
  //     cropperStatusBarColor: 'white',
  //     cropperToolbarColor: 'white',
  //     cropperActiveWidgetColor: 'white',
  //     cropperToolbarWidgetColor: '#3498DB',
  //   })
  //     .then((image) => {
  //       setImageUri(image.path)

  //     })
  //     .catch((e) => {
  //       console.log(e);
  //       Alert.alert(e.message ? e.message : e);
  //     });
  // }


  return (
    <View style={{
      flex: 1,
      backgroundColor: '#F1F1F1',
      alignItems: 'center'
    }}>
      <TextInput style={{color:'black'}} placeholder='email' onChangeText={(text) => setEmail(text)} />
      <TextInput style={{color:'black'}} placeholder='password' onChangeText={(text) => setPassword(text)} />
      <TouchableOpacity style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
      }}
        onPress={() => {
          createAccount()
        }}>
        <Text style={{
          color: 'red',
          fontSize: 17,
          fontFamily: 'Proxima-Bold'
        }}>
          Cancel
          </Text>
      </TouchableOpacity>
    </View >
  )
}

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 0.2,
    borderColor: '#707070',
    marginHorizontal: 20
  },
  label: {
    color: '#ababab',
    marginLeft: 67,
    fontSize: 15,
    marginTop: 13,
    fontFamily: 'Proxima-Medium'
  }
});

export default Signup;


