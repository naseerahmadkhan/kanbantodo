import AppNavigator from './src/screens/AppNavigator';
import {styles} from './src/styles/styles';
import {DefaultTheme, Provider} from 'react-native-paper';
import React from 'react';
import {AppContext, data} from './src/store/store';

import {SafeAreaView, ScrollView, StatusBar, Text, View} from 'react-native';

export default function App() {
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#1D267D',
      accent: '#f1c40f',
    },
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <StatusBar
        barStyle="default"
        hidden={true}
        backgroundColor="blue"
        translucent={false}
      />
      <Provider theme={theme}>
        <AppContext.Provider value={data}>
          <AppNavigator />
        </AppContext.Provider>
      </Provider>
    </SafeAreaView>
  );
}
