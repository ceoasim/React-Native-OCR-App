import React, { Component } from 'react';
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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import auth from '@react-native-firebase/auth';
import {
  MenuProvider,
  Menu,
  MenuOption,
  MenuTrigger,
  MenuOptions,
} from 'react-native-popup-menu';

import Button from '../components/Button';
import Images from '@constants/images';
import { updatePhoneNumber, updateEmail } from '../redux/onboarding/actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      emai: '',
      countryCode: 1,
    };
    this.menu = React.createRef();
    this.onPhoneChange = this.onPhoneChange.bind(this);
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  onPhoneChange(text) {
    if (text.length == 4 && this.state.phoneNumber.length < 4) {
      text = text + ' ';
    } else if (text.length === 4 && this.state.phoneNumber.length > 4) {
      text = text.slice(0, 3);
    }
    this.setState({ phoneNumber: text });
  }
  validatePhoneNo = (phone) => {
    phone = phone.replace(/\s/g, '');
    var re;
    if (this.state.countryCode == 92) {
      re = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
    } else if (this.state.countryCode == 91) {
      re = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
    } else {
      re = /\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/;
    }
    return re.test(phone);
  };

  onContinue = () => {
    const phoneNo =
      '+' + String(this.state.countryCode) + ' ' + this.state.phoneNumber;
    if (this.validatePhoneNo(phoneNo)) {
      this.props.updatePhoneNumber(phoneNo);
      this.props.navigation.navigate('OtpInput');
    } else if (this.validateEmail(this.state.email)) {
      this.props.updateEmail(this.state.email);
      this.props.navigation.navigate('PasswordLogin');
    } else if (!this.state.phone && !this.state.email) {
      ToastAndroid.show('Please enter phone number or email', ToastAndroid.SHORT);
    }
    else if (!this.validateEmail(this.state.email)) {
      ToastAndroid.show('Invali email', ToastAndroid.SHORT);
    }
  };

  render() {
    const CenterRowView = ({ style: _style, children }) => (
      <View style={[_style, { ...style.rowCenter }]}>{children}</View>
    );
    const { countryCode } = this.state;
    var selectedFlag;
    if (countryCode == 92) {
      selectedFlag = Images.pk_flag;
    } else if (countryCode == 91) {
      selectedFlag = Images.in_flag;
    } else {
      selectedFlag = Images.us_flag;
    }

    var numberMaxCount;
    if (this.state.countryCode == 92) {
      numberMaxCount = 11;
    } else if (this.state.countryCode == 91) {
      numberMaxCount = 10;
    } else {
      numberMaxCount = 11;
    }

    return (
      <MenuProvider>
        <ScrollView keyboardShouldPersistTaps='handled' style={{ backgroundColor: '#fff' }}>
          <StatusBar
            translucent
            barStyle="dark-content"
            backgroundColor="transparent"
          />
          <View style={{ marginHorizontal: 25 }}>
            <CenterRowView
              style={{
                marginTop:
                  StatusBar.currentHeight + getStatusBarHeight(true) + 20,
              }}>
              <Text
                style={{
                  flexDirection: 'column',
                  alignSelf: 'center',
                  fontSize: 30,
                  color:'black',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                OCR
              </Text>
            </CenterRowView>
            <CenterRowView style={{ marginTop: 40, marginHorizontal: 10 }}>
              <Text
                style={{ fontSize: 17, color:'black', textAlign: 'center', fontWeight: 'normal' }}>
                Enter your phone number or email to continue
              </Text>
            </CenterRowView>
            <View style={{ marginTop: 69 }}>
              <Text style={{ fontSize: 13, fontWeight: 'normal' }}>
                Mobile no.
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginRight: 17,
                  marginTop: 30,
                  width: 80,
                  borderBottomColor: 'rgba(0, 0, 0, 0.12)',
                  borderBottomWidth: 1,
                  paddingBottom: 5,
                }}>
                <Menu
                  ref={this.menu}
                  onSelect={(value) => this.setState({ countryCode: value })}>
                  <MenuTrigger />
                  <MenuOptions
                    customStyles={{
                      optionsWrapper: {
                        width: 'auto',
                      },
                      optionsContainer: {
                        width: 'auto',
                      },
                    }}>
                    <MenuOption value={1}>
                      <View style={{ flexDirection: 'row' }}>
                        <Image
                          style={{
                            flexDirection: 'column',
                            alignSelf: 'center',
                            width: 30,
                            height: 20,
                          }}
                          source={Images.us_flag}
                        />
                        <Text
                          style={{
                            paddingVertical: 0,
                            paddingLeft: 5,
                            flexGrow: 1,
                            flexDirection: 'column',
                            alignSelf: 'center',
                            fontFamily: 'Montserrat-Medium',
                            fontSize: 17, color:'black',
                            fontWeight: '900'
                          }}>
                          +1
                        </Text>
                      </View>
                    </MenuOption>
                    <MenuOption value={91}>
                      <View style={{ flexDirection: 'row' }}>
                        <Image
                          style={{
                            flexDirection: 'column',
                            alignSelf: 'center',
                            width: 30,
                            height: 20,
                          }}
                          source={Images.in_flag}
                        />
                        <Text
                          style={{
                            paddingVertical: 0,
                            paddingLeft: 5,
                            flexGrow: 1,
                            flexDirection: 'column',
                            alignSelf: 'center',
                            fontFamily: 'Montserrat-Medium',
                            fontSize: 17, color:'black',
                            fontWeight: '900'
                          }}>
                          +91
                        </Text>
                      </View>
                    </MenuOption>
                    <MenuOption value={92}>
                      <View style={{ flexDirection: 'row' }}>
                        <Image
                          style={{
                            flexDirection: 'column',
                            alignSelf: 'center',
                            width: 30,
                            height: 20,
                          }}
                          source={Images.pk_flag}
                        />
                        <Text
                          style={{
                            paddingVertical: 0,
                            paddingLeft: 5,
                            flexGrow: 1,
                            flexDirection: 'column',
                            alignSelf: 'center',
                            fontFamily: 'Montserrat-Medium',
                            fontSize: 17, color:'black',
                            fontWeight: '900'
                          }}>
                          +92
                        </Text>
                      </View>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => this.menu.current.open()}>
                  <Image
                    style={{
                      flexDirection: 'column',
                      alignSelf: 'center',
                      width: 30,
                      height: 20,
                    }}
                    source={selectedFlag}
                  />
                  <Text
                    style={{
                      paddingVertical: 0,
                      paddingLeft: 5,
                      flexGrow: 1,
                      flexDirection: 'column',
                      alignSelf: 'center',
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 17, color:'black',
                      fontWeight: '900'
                    }}>
                    +{this.state.countryCode}
                  </Text>
                </TouchableOpacity>
              </View>
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
                  placeholder="0123 456789"
                  value={this.state.phoneNumber}
                  onChangeText={this.onPhoneChange}
                  style={{
                    paddingVertical: 0,
                    flexGrow: 1,
                    flexDirection: 'column',
                    alignSelf: 'center',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 17, color:'black',
                  }}
                  maxLength={numberMaxCount}
                  keyboardType={
                    Platform.OS == 'android' ? 'numeric' : 'number-pad'
                  }
                />
              </View>
            </View>
            <View style={{ marginTop: 25 }}>
              <Image
                source={Images.or_bundle}
                style={{ resizeMode: 'contain', width: '100%' }}
              />
            </View>
            <View style={{ marginTop: 25 }}>
              <Text style={{ fontSize: 13, fontWeight: 'normal' }}>
                Sign in with email
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
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
                  placeholder="john.doe@gmail.com"
                  value={this.state.email}
                  onChangeText={(value) => {
                    this.setState({ email: value });
                  }}
                  style={{
                    paddingVertical: 0,
                    flexGrow: 1,
                    flexDirection: 'column',
                    alignSelf: 'center',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 17, color:'black',
                  }}
                  keyboardType={'email-address'}
                />
              </View>
            </View>


            <View>
              <Button
                onClick={this.onContinue}
                style={{ marginTop: 40 }}
                text={'Continue'}
              />
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('EmailSignup')} style={{ marginTop: 25, alignItems: 'center', alignSelf: 'center', }}>
              <Text style={{ fontSize: 13, fontWeight: 'normal', color: 'red' }}>
                Sign up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                if (!this.validateEmail(this.state.email)) {
                  ToastAndroid.show(
                    'Please enter your email to reset the password.',
                    ToastAndroid.LONG,
                  );
                } else {
                  try {
                    var data = await auth().sendPasswordResetEmail(
                      this.state.email,
                    );
                    ToastAndroid.show(
                      'Email sent successfully .',
                      ToastAndroid.SHORT,
                    );
                  } catch (error) {
                    ToastAndroid.show(
                      'Unable to reset. Email may not exist.',
                      ToastAndroid.LONG,
                    );
                  }
                }
              }}
              style={{ marginVertical: 15, ...style.rowCenter }}>
              <Text style={{ fontSize: 14, fontWeight: 'normal' }}>
                Forgot Password?{' '}
              </Text>
              <Text
                fontType={'medium'}
                style={{ fontSize: 13, color: '#FE7E8B' }}>
                Reset
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </MenuProvider>
    );
  }
}

const style = {
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
};



const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updatePhoneNumber,
      updateEmail,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(App)