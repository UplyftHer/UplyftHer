import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import getScreenOptions from '../helpers/screenOptions';
import SignUp from '../screens/Auth/SignUp';
import SignIn from '../screens/Auth/SignIn';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import NewPassword from '../screens/Auth/NewPassword';
import BasicInfo from '../screens/Auth/ProfileSetup/BasicInfo';
import AddBio from '../screens/Auth/ProfileSetup/AddBio';
import CheckInbox from '../screens/Auth/CheckInbox';
import SelectInterests from '../screens/Auth/ProfileSetup/SelectInterests';
import ConfirmSignUp from '../screens/Auth/ConfirmSignUp';
import LinkedinLogin from '../screens/Auth/SignUp/linkedinLogin';
import TermsPrivacy from '../screens/Profile/TermsPrivacy';

const Stack = createStackNavigator();

const AuthStack = ({navigation, route}) => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={props =>
            getScreenOptions({
              ...props,
              title: '',
            })
          }
        />
        <Stack.Screen
          name="CheckInbox"
          component={CheckInbox}
          options={props =>
            getScreenOptions({
              ...props,
              title: '',
            })
          }
        />
        <Stack.Screen
          name="ConfirmSignUp"
          component={ConfirmSignUp}
          options={props =>
            getScreenOptions({
              ...props,
              title: '',
            })
          }
        />
        <Stack.Screen
          name="NewPassword"
          component={NewPassword}
          options={props =>
            getScreenOptions({
              ...props,
              title: '',
            })
          }
        />
        <Stack.Screen
          name="BasicInfo"
          component={BasicInfo}
          options={props =>
            getScreenOptions({
              ...props,
              title: '',
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
            })
          }
        />
        <Stack.Screen
          name="LinkedinLogin"
          component={LinkedinLogin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TermsPrivacy"
          component={TermsPrivacy}
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

export default AuthStack;
