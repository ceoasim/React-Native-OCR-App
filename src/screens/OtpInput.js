/**
 * Onboarding Screen
 *
 * @format
 * @flow strict-local
 */

 import React, { Component } from 'react';
 import {
   Image,
   View,
   TouchableOpacity,
   StatusBar,
   ToastAndroid,
   Alert,
   Text
 } from 'react-native';
 import auth from '@react-native-firebase/auth';
 import { bindActionCreators } from 'redux';
 import { connect } from 'react-redux';
 import { getStatusBarHeight } from 'react-native-status-bar-height';
 
 import OTPRow from '../components/OTPRow';
 import images from '@constants/images';
 import { setLogin } from '../redux/onboarding/actions';
 
 class OtpInput extends Component {
   constructor(props) {
     super(props);
 
     this.state = {
       count: 120,
       otp: [],
       confirm: null
     };
 
     this.fakeOtp = false;
 
     this.optBox1 = React.createRef();
     this.otpBox2 = React.createRef();
     this.otpBox3 = React.createRef();
     this.otpBox4 = React.createRef();
     this.otpBox5 = React.createRef();
     this.otpBox6 = React.createRef();
 
     this.otpBoxes = Array.apply(null, Array(6)).map(function () { });
 
     this.mod = this.mod.bind(this);
     this.confirmCode = this.confirmCode.bind(this);
     this.startTimer = this.startTimer.bind(this);
   }
 
   componentDidMount() {
     this.signInWithPhoneNumber(this.props.phoneNumber);
   }
 
   startTimer() {
     this.myInterval = setInterval(() => {
       if (this.state.count === 0) {
         clearInterval(this.myInterval);
         return;
       }
       this.setState({
         count: this.state.count - 1,
       });
     }, 1000);
   }
 
   componentWillUnmount() {
     clearInterval(this.myInterval);
   }
 
   mod() {
     const { count } = this.state;
     const sec = count % 60;
     const res = count - sec;
     const mint = res / 60;
     return {
       mints: mint,
       secs: sec,
     };
   }
 
   showToast = (data) => {
     ToastAndroid.show(data, ToastAndroid.SHORT);
   };
 
   async signInWithPhoneNumber(number) {
     // this.setState({loading: true});
 
     var phoneNumber = number.replace(/\s/g, '');
     try {
       var confirmation = {};
      //  if (this.fakeOtp) {
      //    confirmation = {
      //      confirm: (code) => {
      //        if (code == '123456') {
      //          return 'Logged In';
      //        } else {
      //          throw new Error('Invalid');
      //        }
      //      },
      //    };
      //  } else {
        confirmation = await auth().signInWithPhoneNumber(phoneNumber);;
      //  }
       this.startTimer();
       this.setState({
         confirm: confirmation,
         otpGenerationTime: Date.now(),
         count: 120,
       });
     } catch (error) {
       console.log('error', error);
       this.showToast('Invalid phone number!');
     }
     // this.props.navigation.navigate('OnboardingOTP', {confirmation});
   }
 
   async confirmCode(code, clearOtp) {
     if (Date.now() - this.state.otpGenerationTime > 120000) {
       this.showToast('OTP Expired');
       clearOtp();
       return;
     }
     try {
       await auth.PhoneAuthProvider.credential(
         this.state.confirm.verificationId,
         code,
       );
 
       this.props.setLogin(true);
       this.showToast('Successfully Login');
     }
     catch (error) {
       clearOtp();
       console.log("Errors", error);
       this.showToast('Invalid code.');
     }
   }
 
   render() {
     const time = this.mod();
     return (
       <View style={{ backgroundColor: '#fff', flexGrow: 1 }}>
         <StatusBar
           translucent
           barStyle="dark-content"
           backgroundColor="transparent"
         />
 
         <View keyboardShouldPersistTaps='handled' style={{ marginHorizontal: 25, flex: 1 }}>
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
               <Image source={images.back_arrow} />
             </TouchableOpacity>
             <Text
               fontType={'medium'}
               style={{
                 flexDirection: 'column',
                 alignSelf: 'center',
                 fontSize: 22,
                 marginLeft: 15,
               }}>
               Enter Verification Code
              </Text>
           </View>
 
           <View style={{ marginTop: 27, marginLeft: 28, marginHorizontal: 10 }}>
             <Text fontType={'normal'}>
               We have sent an OTP to {this.props.phoneNumber}
             </Text>
           </View>
 
           <OTPRow style={{ marginTop: 27, marginLeft: 28, marginHorizontal: 10 }} confirmCode={this.confirmCode} ></OTPRow>
 
           {/* <View>
              <Button disabled={this.state.otp.join('').length != 6 ? true : false} onClick={() => {
                this.props.onContinue(this.state.otp.join(''));
                }} style={{ marginTop: 40 }} text={"Continue"} />
            </View> */}
 
           <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 40 }}>
             <Text
               style={{ alignSelf: 'center', marginBottom: 22.3, fontSize: 17 }}>
               {time.mints + ':' + time.secs}
             </Text>
 
             <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
               <Text
                 style={{
                   fontSize: 14,
                   fontFamily: 'Montserrat-Regular',
                 }}>
                 Didn't receive the code?
                </Text>
               <TouchableOpacity
                 disabled={this.state.count != 0}
                 onPress={() => {
                   this.signInWithPhoneNumber(this.props.signup.phoneNumber);
                 }}>
                 <Text
                   style={{
                     marginLeft: 5,
                     fontSize: 14,
                     fontFamily: 'Montserrat-Regular',
                     color: this.state.count != 0 ? '#C4C5C9' : '#E95F6D',
                   }}>
                   Resend Now
                  </Text>
               </TouchableOpacity>
             </View>
           </View>
         </View>
       </View>
     );
   }
 }
 
 const mapStateToProps = (state) => {
   const { phoneNumber } = state.onboarding;
   return { phoneNumber };
 };
 
 const mapDispatchToProps = (dispatch) =>
   bindActionCreators(
     {
       setLogin,
     },
     dispatch,
   );
 
 
 export default connect(mapStateToProps, mapDispatchToProps)(OtpInput);
 