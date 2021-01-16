import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginOtp from './Login_Otp';
import Login from './Login';

function LoginStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="otp" component={LoginOtp} />
    </Stack.Navigator>
  );
}

export default LoginStack;
