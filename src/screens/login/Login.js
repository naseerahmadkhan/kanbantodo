import {View, Text, Alert} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Formik} from 'formik';
import {LoginSchema} from './loginSchema';
import {
  TextInput,
  Button,
  ActivityIndicator,
  MD2Colors,
} from 'react-native-paper';
import {styles} from '../../styles/styles';
import {setUserLoggedIn, getUserLoggedIn} from '../../utils/helper';
import {auth} from '../../config/auth/firebase';

// npx expo install firebase
// npx expo customize metro.config.js
/* 
add following lines in this
!metro.config.js

const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push('cjs');

module.exports = defaultConfig;

*/

// npx expo install expo-dev-client
// npx expo install @react-native-firebase/app

import {
  signInWithEmailAndPassword,
  setPersistence,
  signInWithRedirect,
  inMemoryPersistence,
  GoogleAuthProvider,
} from 'firebase/auth';
import {AppContext} from '../../store/store';
import Header from '../../components/header/Header';

export default function Login({navigation}) {
  const storeData = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);

  async function checkIsUserLoggedInBefore() {
    try {
      let result = await getUserLoggedIn('user');
      if (result) {
        const resultParsed = JSON.parse(result);
        const {email, uid} = resultParsed;
        storeData.email = email;
        storeData.uid = uid;
        console.log('>>', resultParsed);
        navigation.replace('DashboardStackScreens', {
          screen: 'Dashboard',
          params: {email},
        });
      }else{
        setIsLoading(false)
      }
    } catch (e) {
      console.log('err...', e);
    }
  }

  useEffect(() => {
    checkIsUserLoggedInBefore();
  }, []);

  const handleSubmit = async values => {
    console.log('submit', values);

    try {
      const authResult = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      const uid = authResult.user.uid;
      const email = authResult.user.email;

      console.log('auth result', authResult);
      console.log('auth result selected', authResult._tokenResponse.idToken);
      console.log(
        'auth result selected',
        authResult._tokenResponse.refreshToken,
      );
      storeData.idToken = authResult._tokenResponse.idToken;
      storeData.refreshToken = authResult._tokenResponse.refreshToken;

      setUserLoggedIn({uid, email, auth: authResult});
      storeData.email = email;
      storeData.uid = uid;
      navigation.replace('DashboardStackScreens', {
        screen: 'Dashboard',
        params: {email},
      });
    } catch (err) {
      console.log('Err while Authentication', err);
      if (err.code == 'auth/wrong-password') {
        Alert.alert('Error', 'Incorrect User or Password!');
      } else if (err.code == 'auth/too-many-requests') {
        Alert.alert(
          'Error',
          'You entered wrong user or password too many times!',
        );
      } else {
        Alert.alert('Error', JSON.stringify(err));
      }
    }
  };

  const LoginView = (
    <>
      <Text
        style={{
          fontSize: 20,
          alignSelf: 'center',
          paddingVertical: 20,
        }}>
        Login
      </Text>

      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={LoginSchema}
        onSubmit={values => handleSubmit(values)}>
        {({
          values,
          handleChange,
          handleSubmit,
          errors,
          setFieldTouched,
          touched,
          isValidating,
        }) => (
          <View>
            <TextInput
              value={values.email}
              color="grey"
              onChangeText={handleChange('email')}
              onBlur={() => setFieldTouched('email')}
              label={'Email'}
              style={{marginBottom:20}}
            />

            {touched.email && errors.email && (
              <Text style={{fontSize: 12, color: '#FF0D10'}}>
                {errors.email}
              </Text>
            )}

            <TextInput
              value={values.password}
              color="grey"
              onChangeText={handleChange('password')}
              onBlur={() => setFieldTouched('password')}
              label={'Password'}
              secureTextEntry={true}
            />

            {touched.password && errors.password && (
              <Text style={{fontSize: 12, color: '#FF0D10'}}>
                {errors.password}
              </Text>
            )}

            <Button
              style={{margin: 20, marginTop: 50}}
              icon="arrow-right-bold"
              mode="contained"
              buttonColor={styles.btnPrimary}
              onPress={() => handleSubmit(values)}>
              Login
            </Button>

            <Button
              style={{margin: 20}}
              mode="contained"
              buttonColor={styles.btntertiary}
              onPress={() => navigation.replace('Signup')}>
              Create New Account
            </Button>
          </View>
        )}
      </Formik>
    </>
  );

  return (
    <View style={{flex:1}}>
      <Header navigation={navigation} />
      <View style={styles.container}>
      {!isLoading && LoginView}
      {isLoading && <View style={{flex:1,justifyContent:'center'}}>
        <ActivityIndicator  animating={true} size={96} color={MD2Colors.blueA500}/>
      </View>
      }
      </View>
    </View>
  );
}
