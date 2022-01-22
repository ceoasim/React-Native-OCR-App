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
 
import { updateEmail} from '../redux/onboarding/actions';

 import Button from '../components/Button';
 import Images from '@constants/images';
 
 class EmailSignup extends Component {
   constructor(props) {
     super(props);
 
     this.state = {
       email: '',
       password: '',
       loading: false
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
 
   validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

   emailSignUp = async (password) => {
     this.setState({loading:true})
    this.props.updateEmail(this.state.email);
    try {
      await auth().createUserWithEmailAndPassword(
        this.state.email,
        password,
      );
      ToastAndroid.show('User account created & signed in!', ToastAndroid.SHORT);
      this.props.navigation.navigate('Login')
    } catch (error) {
      this.setState({loading:false})
      if (error.code === 'auth/email-already-in-use') {
      ToastAndroid.show('That email address is already in use!!', ToastAndroid.SHORT);
      
    }
    
    if (error.code === 'auth/invalid-email') {
        ToastAndroid.show('That email address is invalid!', ToastAndroid.SHORT);
      }
      console.error(error);
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
                 justifyContent:'space-between'
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
               
               style={{
                 flexDirection: 'column',
                 alignSelf: 'center',
                 fontSize: 22,
                 fontWeight:'bold'
               }}>
               Sign Up
             </Text>
             <Text></Text>
           </View>
 
           <CenterRowView style={{marginTop: '50%', marginHorizontal: 10}}>
             <Text
               fontType={'normal'}
               style={{fontSize: 17, textAlign: 'center'}}>
               Please enter your email & password
             </Text>
           </CenterRowView>
 
 
             <View
               style={{
                 flexGrow: 1,
                 marginTop: 30,
                 borderBottomColor: 'rgba(0, 0, 0, 0.12)',
                 borderBottomWidth: 1,
                 paddingBottom: 5,
               }}>
               <TextInput
                 placeholder="Email"
                 value={this.state.email}
                 onChangeText={(text)=> this.setState({email:text})}
                 style={{
                   paddingVertical: 0,
                   color:'black',
                   flexGrow: 1,
                   flexDirection: 'column',
                   fontFamily: 'Montserrat-Medium',
                   fontSize: 17,
                 }}
               />
             </View>
 
             <View
               style={{
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
                   fontFamily: 'Montserrat-Medium',
                   fontSize: 17,
                 }}
                 secureTextEntry={true}
               />
             </View>
 
           <View>
             <Button
               onClick={async () => {
                if(this.state.password && this.state.email){ if (
                   this.validatePassword(this.state.password) && this.validateEmail(this.state.email) &&
                   (await this.emailSignUp(this.state.password))
                 )
                 {
                   this.props.navigation.navigate('Login')
                 }
                 else if (
                  this.validatePassword(this.state.password) && !this.validateEmail(this.state.email) )
                 {
                  ToastAndroid.show('Invalid email.', ToastAndroid.SHORT);

                   
                 } 
                 else if(!this.validatePassword(this.state.password) && this.validateEmail(this.state.email) )
                 {
                   ToastAndroid.show('Invalid password.', ToastAndroid.SHORT);
                 }
                 else if(!this.validatePassword(this.state.password) && !this.validateEmail(this.state.email) )
                 {
                   ToastAndroid.show('Invalid credentials.', ToastAndroid.SHORT);
                 }}
                 else
                 {
                   ToastAndroid.show('Please enter credentials', ToastAndroid.SHORT);
                 }
               }}
               style={{marginTop: 40}}
               text={!this.state.loading ? 'Create' : 'Creating...'}
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
 
 const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateEmail,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(EmailSignup)
 