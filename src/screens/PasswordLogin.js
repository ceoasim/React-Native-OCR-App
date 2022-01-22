/**
 * Onboarding Screen
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Platform,
  ToastAndroid,
  Text
} from 'react-native';
import auth from '@react-native-firebase/auth';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getStatusBarHeight} from 'react-native-status-bar-height';
import { setLogin } from '../redux/onboarding/actions';

import Button from '../components/Button';
import Images from '@constants/images';

class PasswordLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      loading: false,
    };

    this.onPasswordChange = this.onPasswordChange.bind(this);
  }

  onPasswordChange(text) {
    this.setState({password: text});
  }

  validatePassword(password) {
    // https://stackoverflow.com/questions/5142103/regex-to-validate-password-strength
    const re = /^(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    return re.test(String(password));
  }

  loginWithPassword = async (password) => {
    this.setState({loading: true})
    try {
       await auth().signInWithEmailAndPassword(
        this.props.onboarding.email,
        password,
      );
      ToastAndroid.show('User is login now', ToastAndroid.SHORT);
      this.props.setLogin(true);
      
      return true;
    } catch (error) {
      this.setState({loading:false})
      ToastAndroid.show('Incorrect Password', ToastAndroid.SHORT);

      return false;
    }

    
  };

  render() {
    const CenterRowView = ({style: _style, children}) => (
      <View style={[_style, {...style.rowCenter}]}>{children}</View>
    );

    return (
      <ScrollView keyboardShouldPersistTaps='handled' style={{backgroundColor: '#fff'}}>
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="transparent"
        />

        <View style={{marginHorizontal: 25}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop:
                StatusBar.currentHeight + getStatusBarHeight(true) + 20,
            }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{
                flexDirection: 'column',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={Images.back_arrow} />
            </TouchableOpacity>
            <Text
              fontType={'medium'}
              style={{
                flexDirection: 'column',
                alignSelf: 'center',
                fontSize: 22,
                marginLeft: 15,
              }}>
              Password
            </Text>
          </View>

          <CenterRowView style={{marginTop: 40, marginHorizontal: 10}}>
            <Text
              fontType={'normal'}
              style={{fontSize: 17, textAlign: 'center'}}>
              Please enter your password
            </Text>
          </CenterRowView>

          <View style={{marginTop: 69}}>
            <Text fontType={'normal'} style={{fontSize: 13}}>
              Password
            </Text>
          </View>

          <View style={{flex: 1, flexDirection: 'row'}}>
            <View
              style={{
                flexDirection: 'row',
                flexGrow: 1,
                marginTop: 30,
                borderBottomColor: 'rgba(0, 0, 0, 0.12)',
                borderBottomWidth: 1,
                paddingBottom: 5,
              }}>
              <TextInput
                placeholder="**************"
                value={this.state.password}
                onChangeText={this.onPasswordChange}
                style={{
                  paddingVertical: 0,
                  color:'black',
                  flexGrow: 1,
                  flexDirection: 'column',
                  alignSelf: 'center',
                  fontFamily: 'Montserrat-Medium',
                  fontSize: 17,
                }}
                secureTextEntry={true}
              />
            </View>
          </View>

          <View>
            <Button
              onClick={async () => {
                 this.loginWithPassword(this.state.password)
               
              }}
              style={{marginTop: 40}}
              text={!this.state.loading ? 'Continue' : 'Signing...'}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const style = {
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
};

const mapStateToProps = (state) => {
  const {onboarding} = state;
  return {onboarding};
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setLogin,
    },
    dispatch,
  );


export default connect(mapStateToProps, mapDispatchToProps)(PasswordLogin);
