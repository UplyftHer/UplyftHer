import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import getScreenOptions from '../helpers/screenOptions';
import DashboardScreen from '../screens/Home/DashboardScreen';

const Stack = createStackNavigator();

const HomeStack = ({navigation, route}) => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="DashBoardScreen"
          component={DashboardScreen}
          options={props =>
            getScreenOptions({
              ...props,
              title: '',
            })
          }
        />
      </Stack.Navigator>
    </>
  );
};

export default HomeStack;
