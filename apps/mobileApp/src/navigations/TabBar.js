import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet, View} from 'react-native';
import {scaledHeightValue, scaledValue} from '../utils/design.utils';
import HomeStack from './HomeStack';
import GText from '../components/GText';
import {colors} from '../../assets/colors';
import {Images} from '../utils';
import AnimatedBottomTabBar from './AnimatedBottomTabBar';
import Meetings from '../screens/Meetings/Main';

import fonts from '../utils/fonts';
import ProfileStack from './ProfileStack';
import MeetingStack from './MeetingStack';
import Inbox from '../screens/Inbox/Main';
import InboxStack from './InboxStack';

const BottomTab = createBottomTabNavigator();

const TabBar = props => {
  const renderIcon = (focused, source, label) => (
    <View
      style={{
        alignItems: 'center',
        gap: scaledValue(4),
      }}>
      <Image
        source={source.focus}
        tintColor={focused ? colors.themeColor : colors.charcoal}
        style={{width: scaledValue(20), height: scaledValue(20)}}
      />
      <GText
        text={label}
        style={{
          fontFamily: focused ? fonts.SUSE_SEMIBOLD : fonts.SUSE_MEDIUM,
          fontSize: scaledValue(13),
          lineHeight: scaledHeightValue(15.6),
          letterSpacing: scaledValue(13 * -0.03),
          color: focused ? colors.themeColor : colors.charcoal,
          //   opacity: focused ? 1 : 0.5,
        }}
      />
    </View>
  );

  return (
    <BottomTab.Navigator
      tabBar={props => <AnimatedBottomTabBar {...props} />}
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: false,
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({focused}) =>
            renderIcon(focused, {focus: Images.sealCheckFill}, 'Home'),
        }}
      />
      <BottomTab.Screen
        name="MeetingStack"
        component={MeetingStack}
        options={{
          tabBarIcon: ({focused}) =>
            renderIcon(
              focused,
              {focus: Images.cheersFill, default: Images.cheersFill},
              'Meetings',
            ),
          unmountOnBlur: true,
        }}
      />
      <BottomTab.Screen
        name="InboxStack"
        component={InboxStack}
        options={{
          tabBarIcon: ({focused}) =>
            renderIcon(
              focused,
              {focus: Images.callBellFill, default: Images.callBellFill},
              'Inbox',
            ),
        }}
      />
      <BottomTab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarIcon: ({focused}) =>
            renderIcon(
              focused,
              {focus: Images.femaleShimmer, default: Images.femaleShimmer},
              'Profile',
            ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabBarStyle: {
    // height: scaledValue(67),
    // backgroundColor: colors.offWhite,
  },
});
