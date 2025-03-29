import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import getScreenOptions from '../helpers/screenOptions';
import Profile from '../screens/Profile/Main';
import Meetings from '../screens/Meetings/Main';

const Stack = createStackNavigator();

const MeetingStack = ({navigation, route}) => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Meetings"
          component={Meetings}
          options={props =>
            getScreenOptions({
              ...props,
              title: '',
              headerShown: true,
            })
          }
        />
      </Stack.Navigator>
    </>
  );
};

export default MeetingStack;
