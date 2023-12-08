import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomePage from "./Screens/HomePage";
import LiveSpeed from "./Screens/LiveSpeed";
import DriverAssistant from "./Screens/DriverAssistant";
import login from "./Screens/LoginScreen";
import profile from "./Screens/ProfileScreen";
import Login from "./Screens/LoginScreen";
import LoginScreen from "./Screens/LoginScreen";
import Registration from "./Screens/Registration";
import DriverAssistant5 from "./Screens/DriverAssistant5";


const Stack = createNativeStackNavigator();

export const Navigation = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'LoginScreen'}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{title: 'LOGIN'}}
          />
          <Stack.Screen
            name={'Registration'}
            component={Registration}
          />
          <Stack.Screen
            name={'Home'}
            component={HomePage}
          />
          <Stack.Screen
            name={'DriverAssistant'}
            component={DriverAssistant5}
          />
          <Stack.Screen
            name={'LiveSpeed'}
            component={LiveSpeed}
          />
          <Stack.Screen
            name={'Settings'}
            component={profile}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
