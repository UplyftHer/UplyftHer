import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import getScreenOptions from '../helpers/screenOptions';
import Profile from '../screens/Profile/Main';

const Stack = createStackNavigator();

const ProfileStack = ({navigation, route}) => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={props =>
            getScreenOptions({
              ...props,
              title: '',
              headerShown: false,
            })
          }
        />
      </Stack.Navigator>
    </>
  );
};

export default ProfileStack;
