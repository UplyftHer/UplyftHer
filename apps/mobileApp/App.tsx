import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider, useSelector} from 'react-redux';
import store, {persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors} from './assets/colors';
import OnBoardingStack from './src/navigations/OnBoardingStack';
import StackScreens from './src/navigations/StackScreen';
import AuthStack from './src/navigations/AuthStack';
import ProfileSetUpStack from './src/navigations/ProfileSetUpStack';
import TabBar from './src/navigations/TabBar';
import Spinner from 'react-native-loading-spinner-overlay';
import SplashScreen from 'react-native-splash-screen';
import FlashMessage from 'react-native-flash-message';
import {scaledValue, statusBarHeight} from './src/utils/design.utils';
import ForegroundHandler from './src/helpers/foregroundHandler';
import {MatchingProfileProvider} from './src/hooks/useMatchingProfiles';
import {useAppDispatch} from './src/redux/store/storeUtils';
import {
  get_industry_api,
  get_interests_api,
} from './src/redux/slices/authSlice';

export const navigationContainerRef = createNavigationContainerRef();

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar
            backgroundColor={colors.offWhite}
            barStyle="dark-content"
          />
          <AppNavigation />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

const AppNavigation = () => {
  const authState = useSelector(state => state.auth);
  const loading = useSelector(state => state.loading);
  const RootStack = createNativeStackNavigator();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(get_industry_api());
    dispatch(get_interests_api());
  }, []);

  return (
    <>
      <MatchingProfileProvider>
        <NavigationContainer ref={navigationContainerRef}>
          <RootStack.Navigator
            screenOptions={{
              gestureEnabled: false,
            }}>
            {!authState?.onBoarding ? (
              <RootStack.Screen
                name="OnBoardingStack"
                component={OnBoardingStack}
                options={{headerShown: false}}
              />
            ) : authState?.user?.isCreateProfile != 1 ? (
              <RootStack.Screen
                name="AuthStack"
                component={AuthStack}
                options={{headerShown: false}}
              />
            ) : (
              <>
                <RootStack.Screen
                  name="TabBar"
                  component={TabBar}
                  options={{headerShown: false}}
                />
                <RootStack.Screen
                  name="StackScreens"
                  component={StackScreens}
                  options={{headerShown: false}}
                />
              </>
            )}
          </RootStack.Navigator>

          <Spinner
            color={colors.themeColor}
            visible={loading?.loading}
            overlayColor="transparent"
          />
          <FlashMessage
            position={'top'}
            floating={true}
            statusBarHeight={statusBarHeight}
          />
          <ForegroundHandler />
        </NavigationContainer>
      </MatchingProfileProvider>
    </>
  );
};
