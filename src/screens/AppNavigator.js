import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './login/Login';
import Signup from './signup/Signup';
// import Dashboard from './dashboard/Dashboard';
// import TaskList from './tasklist/TaskList';

// const Login = () => <Text>Login</Text>;
// const Signup = () => <Text>Signup</Text>;
const Dashboard = () => <Text>Dashboard</Text>;
const TaskList = () => <Text>TaskList</Text>;
export default function AppNavigator() {
  const Stack = createStackNavigator();
  const AuthStack = createStackNavigator();
  const DashboardStack = createStackNavigator();

  const AuthStackScreens = () => {
    return (
      <AuthStack.Navigator initialRouteName="Login">
        <AuthStack.Screen
          name="Login"
          component={Login}
          options={{title: 'Login', headerShown: false}}
        />
        <AuthStack.Screen
          name="Signup"
          component={Signup}
          options={{title: 'Signup', headerShown: false}}
        />
      </AuthStack.Navigator>
    );
  };

  const DashboardStackScreens = () => {
    return (
      <DashboardStack.Navigator>
        <DashboardStack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{title: 'Dashboard', headerShown: false}}
        />

        <DashboardStack.Screen
          name="TaskList"
          component={TaskList}
          options={{title: 'TaskList', headerShown: false}}
        />
      </DashboardStack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      {/* <Header/> */}
      <Stack.Navigator>
        <Stack.Screen
          name="AuthStackScreens"
          component={AuthStackScreens}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DashboardStackScreens"
          component={DashboardStackScreens}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
