import {Animated, Dimensions, Easing, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import GText from '../../../components/GText';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {Images} from '../../../utils';
import {colors} from '../../../../assets/colors';
import {useAppSelector} from '../../../redux/store/storeUtils';

const {width} = Dimensions.get('window');

const SecondTutorial = () => {
  const translateX = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const userData = useAppSelector(state => state.auth.user);
  const user = userData?.userType === 0 ? 'mentee' : 'mentor';
  const swipeRight = 'Swipe Right';
  const swipeLeftToView = `to go back to\nthe previous ${user}`;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 80,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -80,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.innerView}>
        <Animated.Image
          source={Images.LeftSwipe}
          style={[styles.animatedView(translateX)]}
        />

        <GText medium text={swipeRight} style={styles.swipeRightText} />
        <GText medium text={swipeLeftToView} style={styles.swipeRightText2} />
      </View>
    </View>
  );
};

export default SecondTutorial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scaledValue(20),
  },
  innerView: {
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  animatedView: translateX => ({
    transform: [{translateX}],
    width: scaledValue(64),
    height: scaledValue(64),
  }),
  swipeRightText: {
    color: colors.peachy,
    fontSize: scaledValue(28),
    letterSpacing: scaledValue(28 * -0.03),
    lineHeight: scaledHeightValue(28 * 1.2),
    alignSelf: 'flex-start',
  },
  swipeRightText2: {
    color: colors.white,
    fontSize: scaledValue(28),
    letterSpacing: scaledValue(28 * -0.03),
    lineHeight: scaledHeightValue(28 * 1.2),
  },
});
