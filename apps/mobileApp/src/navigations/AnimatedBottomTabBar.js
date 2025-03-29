import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  Platform,
  Keyboard,
} from 'react-native';
import {scaledValue} from '../utils/design.utils';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {tabbarIndicator} from '../utils/Images';
import {colors} from '../../assets/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const AnimatedBottomTabBar = ({state, descriptors, navigation, route}) => {
  const insets = useSafeAreaInsets();
  const translateX = new Animated.Value(0);

  const [showTabBar, setShowTabBar] = useState(true);
  const animateTabBar = index => {
    Animated.spring(translateX, {
      toValue: index * 80, // Adjust this value based on your tab bar item width (for 4 items, 80px per item)
      useNativeDriver: true,
    }).start();
  };
  const [translateValue] = useState(new Animated.Value(0));
  const totalWidth = scaledValue(375); // Adjusted for 4 items
  const tabWidth = totalWidth / 4; // Calculating tab width dynamically for 4 items

  useEffect(() => {
    animateTabBar(state.index);
  }, [state.index]);

  const animateSlider = index => {
    Animated.spring(translateValue, {
      toValue: index * tabWidth,
      velocity: 10,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animateSlider(state.index);
  }, [state.index]);

  useEffect(() => {
    HideTab();
  }, [state.index, state.routes]);

  const HideTab = () => {
    const routes = state.routes[state.index];

    const routeName =
      getFocusedRouteNameFromRoute(routes) ||
      (routes.state && routes.state.routeNames[routes.state.index]) ||
      'Home';
    if (
      routeName === 'Home' ||
      routeName === 'Meetings' ||
      routeName === 'Inbox' ||
      routeName === 'Profile'
    ) {
      setShowTabBar(true);
    } else {
      setShowTabBar(false);
    }
  };
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const translateY = new Animated.Value(0);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      () => {
        setKeyboardVisible(true);
        Animated.timing(translateY, {
          toValue: 100,
          duration: 0,
          useNativeDriver: true,
        }).start();
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
        animateTabBar(state.index);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [state.index, state.routes]);

  if (keyboardVisible) {
    return null; // Return null when the keyboard is open to hide the bottom tab bar
  }
  return (
    <>
      {showTabBar && (
        <View style={[style.tabContainer(insets), {width: totalWidth}]}>
          <View style={{flexDirection: 'row'}}>
            {state.routes.map((route, index) => {
              const {options} = descriptors[route.key];

              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }

                animateSlider(index);
              };

              const onLongPress = () => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              };

              return (
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityStates={isFocused ? ['selected'] : []}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={{flex: 1, alignItems: 'center'}}
                  key={index}>
                  {options.tabBarIcon &&
                    options.tabBarIcon({focused: isFocused})}
                </TouchableOpacity>
              );
            })}
          </View>
          <Animated.View
            style={[
              style.slider,
              {
                transform: [{translateX: translateValue}],
                width: tabWidth,
                alignItems: 'center',
                position: 'absolute',
                top: 0,
              },
            ]}>
            <Image
              source={tabbarIndicator}
              style={{width: scaledValue(34.64), height: scaledValue(12)}}
            />
          </Animated.View>
        </View>
      )}
    </>
  );
};

const style = StyleSheet.create({
  tabContainer: insets => ({
    width: '100%',
    // position: 'absolute',
    // bottom: scaledValue(34),
    height: insets.bottom ? scaledValue(52) + insets.bottom : scaledValue(60),
    // borderRadius: scaledValue(48),
    backgroundColor: colors.offWhite,
    // shadowColor: '#2E3E461A',
    // shadowOffset: {
    //   width: 5,
    //   height: 5,
    // },
    // shadowOpacity: 0.27,
    // shadowRadius: 4.65,
    // elevation: 6,
    paddingBottom: insets.bottom
      ? insets.bottom - scaledValue(5)
      : scaledValue(5),
    justifyContent: 'flex-end',
    alignSelf: 'center',
  }),
  slider: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
});

export default AnimatedBottomTabBar;
