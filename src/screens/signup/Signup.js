import {
  ScrollView,
  Text,
  View,
  Pressable,
  Modal,
  Image,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {TextInput, Button} from 'react-native-paper';

import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth, db} from '../../config/auth/firebase';
import {collection, addDoc, doc, setDoc} from 'firebase/firestore';
// import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import {SignupSchema} from './signupSchema';
import {styles} from '../../styles/styles';
import date from 'date-and-time';

import {Formik} from 'formik';
import Header from '../../components/header/Header';

export default function Signup({navigation, route}) {
  const handleSubmit = async values => {
    console.log('data', values);

    try {
      let signUpResponse = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      const user = signUpResponse.user;
      console.log('user', user);

      const now = new Date();
      const formattedDate = date.format(now, 'DD-MMMM-YYYY HH:mm:ss A');
      let userRegDataForFirebaseDB = {
        ...values,
        time: formattedDate,
      };
      delete userRegDataForFirebaseDB.password;
      delete userRegDataForFirebaseDB.confirm;

      /* 
                ! add data in collection eatoos in database
                !const docRef = await addDoc(collection(db, "eatoos"), {  
                ?  Add a new document in collection "cities"
                ?  await setDoc(doc(db, "collectionName", "customDocID"), {
              */

      let insertInFirebaseDB = await setDoc(doc(db, 'todo', values.email), {
        user: userRegDataForFirebaseDB,
      });
      Alert.alert('Congrats!', 'Account is Registered Successfully!');
      navigation.replace('Login');
    } catch (err) {
      console.log('err while uploading', err);
      if (err.code == 'auth/email-already-in-use') {
        Alert.alert('Oops!', 'Account is already in use!');
      } else {
        alert(JSON.stringify(err));
      }
    }
  };
  const SignupView = (
    <ScrollView>
      <View>
        <Text
          style={{
            fontSize: 20,
            alignSelf: 'center',
            paddingVertical: 20,
          }}>
          Welcome <Text>to</Text> Signup
        </Text>

        <Formik
          initialValues={{
            fname: '',
            lname: '',
            email: '',
            password: '',
            confirm: '',
          }}
          validationSchema={SignupSchema}
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
                value={values.fname}
                onChangeText={handleChange('fname')}
                onBlur={() => setFieldTouched('fname')}
                placeholder="First Name"
                validationSchema={SignupSchema}
              />

              {touched.fname && errors.fname && (
                <Text style={{fontSize: 12, color: '#FF0D10'}}>
                  {errors.fname}
                </Text>
              )}

              <TextInput
                value={values.lname}
                onChangeText={handleChange('lname')}
                onBlur={() => setFieldTouched('lname')}
                placeholder="Last Name"
                validationSchema={SignupSchema}
              />

              {touched.lname && errors.lname && (
                <Text style={{fontSize: 12, color: '#FF0D10'}}>
                  {errors.lname}
                </Text>
              )}

              <TextInput
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={() => setFieldTouched('email')}
                placeholder="E-mail"
              />

              {touched.email && errors.email && (
                <Text style={{fontSize: 12, color: '#FF0D10'}}>
                  {errors.email}
                </Text>
              )}

              <TextInput
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={() => setFieldTouched('password')}
                placeholder="Password"
                secureTextEntry={true}
              />

              {touched.password && errors.password && (
                <Text style={{fontSize: 12, color: '#FF0D10'}}>
                  {errors.password}
                </Text>
              )}

              <TextInput
                value={values.confirm}
                onChangeText={handleChange('confirm')}
                onBlur={() => setFieldTouched('confirm')}
                placeholder="Confirm password..."
                secureTextEntry={true}
              />

              {touched.confirm && errors.confirm && (
                <Text style={{fontSize: 12, color: '#FF0D10'}}>
                  {errors.confirm}
                </Text>
              )}

              <Button
                style={{margin: 16}}
                onPress={() => handleSubmit(values)}
                title="Submit!"
                color={styles.btnPrimary}
              />
            </View>
          )}
        </Formik>

        <Button
          style={{margin: 20, marginTop: 50}}
          icon="arrow-right-bold"
          mode="contained"
          buttonColor={styles.btntertiary}
          onPress={() => navigation.replace('Login')}>
          Submit
        </Button>

        {/* ----------------- */}
      </View>
    </ScrollView>
  );

  return (
    <View>
      <Header navigation={navigation} />
      {SignupView}
    </View>
  );
}
