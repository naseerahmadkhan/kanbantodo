import AsyncStorage from '@react-native-async-storage/async-storage';
// npx expo install @react-native-async-storage/async-storage
//npm i @react-native-async-storage/async-storage

const setUserLoggedIn = async value => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(value));
  } catch (e) {
    // saving error
    console.log(e);
  }
};

const getUserLoggedIn = async key => {
  try {
    let useLoggedInValue = await AsyncStorage.getItem(key);

    if (useLoggedInValue) {
      return useLoggedInValue;
    }
  } catch (e) {
    // saving error
    console.log(e);
    return false;
  }
};

const removeUserLoggedIn = async key => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (exception) {
    return exception;
  }
};

export {setUserLoggedIn, getUserLoggedIn, removeUserLoggedIn};
