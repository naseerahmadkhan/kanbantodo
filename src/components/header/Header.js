import React, {useState, useContext, useEffect} from 'react';
import {Alert} from 'react-native';
import {
  Appbar,
  Avatar,
  PaperProvider,
  View,
  Menu,
  Button,
  Divider,
  Portal,
  Dialog,
  Text,
  TextInput,
} from 'react-native-paper';
import {AppContext, clearData} from '../../store/store';
import {styles} from '../../styles/styles';
import {removeUserLoggedIn} from '../../utils/helper';
import {
  getAuth,
  updatePassword,
  signInWithEmailAndPassword,
  verifyIdToken,
} from 'firebase/auth';
import {auth, app} from '../../config/auth/firebase';

export default function Header({navigation}) {
  const storeData = useContext(AppContext);
  const [loggedIn, setLoggedIn] = useState(false);

  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const initialState = {
    visible: false,
    current: '',
    newPassword: '',
    confirm: '',
  };
  const [changePassword, setChangePassword] = React.useState(initialState);

  useEffect(() => {
    console.log('from header', storeData.email);
    storeData.email && setLoggedIn(storeData.email);
  }, []);

  const logout = () => {
    console.log('logout');
    closeMenu();
    clearData();
    removeUserLoggedIn('user');
    navigation.navigate('AuthStackScreens', {
      screen: 'Login',
    });
    console.log('data', storeData);
  };

  const userInfo = () => {
    closeMenu();
    Alert.alert('User Info', `${storeData.email}   ${storeData.uid}`);
  };

  const verifyBeforePasswordChange = async () => {
    try {
      let authResult = await signInWithEmailAndPassword(
        auth,
        storeData.email,
        changePassword.current,
      );
      return authResult;
    } catch (e) {
      console.log(e);
      alert(JSON.stringify(e.code));
      return false;
    }
  };

  const handleChangePassword = async (action, data = null) => {
    console.log('change password', auth);

    switch (action) {
      case 'hide':
        closeMenu();
        setChangePassword(prev => ({...prev, visible: false}));
        break;

      case 'open':
        closeMenu();
        setChangePassword(prev => ({...prev, visible: true}));
        break;

      case 'set':
        closeMenu();
        // console.log('set',data)
        setChangePassword(prev => ({...prev, [data.name]: data.value}));

        // setChangePassword((prev)=>({...prev,visible:true}))
        break;
      case 'update':
        console.log('update', changePassword);

        let authResult = await verifyBeforePasswordChange();
        const user = authResult.user;
        const newPassword = changePassword.newPassword;
        console.log('after auth', authResult);

        if (authResult) {
          updatePassword(user, newPassword)
            .then(() => {
              // Update successful.
              console.log('successful password change');
              alert('Password is Successufuly Changed!');
            })
            .catch(error => {
              // An error ocurred
              console.log('err', error);
              alert(JSON.stringify(error));
              // ...
            })
            .finally(() => {});
        }
        setChangePassword(initialState);

        break;
    }
  };

  const menu = (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <Appbar.Action
          icon="dots-vertical"
          color={styles.textcolor}
          onPress={openMenu}
        />
      }>
      <Menu.Item onPress={() => logout()} title="Logout" />
      <Menu.Item
        onPress={() => handleChangePassword('open')}
        title="Change password"
      />
      <Menu.Item onPress={() => userInfo()} title="User info" />
      <Divider />
      <Menu.Item onPress={() => console.log('about')} title="About" />
    </Menu>
  );

  const changePasswordDialog = (
    <Portal>
      <Dialog
        visible={changePassword.visible}
        onDismiss={() => handleChangePassword('hide')}>
        <Dialog.Title>Change Password</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Current Password"
            value={changePassword.current}
            onChangeText={text =>
              handleChangePassword('set', {name: 'current', value: text})
            }
          />
          <TextInput
            label="New Password"
            value={changePassword.newPassword}
            onChangeText={text =>
              handleChangePassword('set', {name: 'newPassword', value: text})
            }
          />
          <TextInput
            label="Confirm Password"
            value={changePassword.confirm}
            onChangeText={text =>
              handleChangePassword('set', {name: 'confirm', value: text})
            }
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => handleChangePassword('hide')}>Cancel</Button>
          {/* <Button onPress={() => handleChangePassword("update")}>Ok</Button> */}
          <Button onPress={() => handleChangePassword('update')}>Update</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  return (
    <Appbar.Header style={{backgroundColor: styles.bgDark}}>
      <Appbar.Content title="Todo App" color={styles.textcolor} />
      {/* <Avatar.Text size={36} label={storeData.email} /> */}
      {storeData.email && menu}
      {changePassword && changePasswordDialog}
    </Appbar.Header>
  );
}
