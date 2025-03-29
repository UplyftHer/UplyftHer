import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import getScreenOptions from '../helpers/screenOptions';
import EditProfile from '../screens/Profile/EditProfile';
import BasicInfo from '../screens/Auth/ProfileSetup/BasicInfo';
import SelectInterests from '../screens/Auth/ProfileSetup/SelectInterests';
import AddBio from '../screens/Auth/ProfileSetup/AddBio';

const Stack = createStackNavigator();

const ProfileSetUpStack = ({navigation, route}) => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="BasicInfo"
          component={BasicInfo}
          options={props =>
            getScreenOptions({
              ...props,
              title: '',
              headerShown: false,
            })
          }
        />
        <Stack.Screen
          name="SelectInterests"
          component={SelectInterests}
          options={props =>
            getScreenOptions({
              ...props,
              title: '',
              headerShown: false,
            })
          }
        />
        <Stack.Screen
          name="AddBio"
          component={AddBio}
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

export default ProfileSetUpStack;
