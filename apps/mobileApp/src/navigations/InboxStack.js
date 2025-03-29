import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import getScreenOptions from '../helpers/screenOptions';
import Inbox from '../screens/Inbox/Main';

const Stack = createStackNavigator();

const InboxStack = ({navigation, route}) => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Inbox"
          component={Inbox}
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

export default InboxStack;
