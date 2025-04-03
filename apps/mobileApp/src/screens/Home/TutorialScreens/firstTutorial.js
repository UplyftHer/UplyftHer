import {Animated, Dimensions, Easing, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import GText from '../../../components/GText';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {Images} from '../../../utils';
import {colors} from '../../../../assets/colors';
import {useAppSelector} from '../../../redux/store/storeUtils';

const {width} = Dimensions.get('window');

const FirstTutorial = () => {
  const translateX = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const userData = useAppSelector(state => state.auth.user);
  const user = userData?.userType === 0 ? 'mentee' : 'mentor';
  const swipeLeft = 'Swipe Left';
  const swipeLeftToView = `to view the\nnext ${user}`;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -80,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
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
          source={Images.RightSwipe}
          style={[styles.animatedView(translateX)]}
        />
        <GText medium text={swipeLeft} style={styles.swipeLeftText} />
        <GText medium text={swipeLeftToView} style={styles.swipeLeftText2} />
      </View>
    </View>
  );
};

export default FirstTutorial;

const styles = StyleSheet.create({
  container: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scaledValue(20),
  },
  innerView: {
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center',
    alignSelf: 'flex-end',
    right: scaledValue(30),
  },
  animatedView: translateX => ({
    transform: [{translateX}],
    width: scaledValue(64),
    height: scaledValue(64),
  }),
  swipeLeftText: {
    color: colors.peachy,
    fontSize: scaledValue(28),
    letterSpacing: scaledValue(28 * -0.03),
    textAlign: 'center',
    lineHeight: scaledHeightValue(28 * 1.2),
  },
  swipeLeftText2: {
    color: colors.white,
    fontSize: scaledValue(28),
    letterSpacing: scaledValue(28 * -0.03),
    textAlign: 'center',
    lineHeight: scaledHeightValue(28 * 1.2),
  },
});
