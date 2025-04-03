import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import GText from '../../../components/GText';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {Images} from '../../../utils';
import {colors} from '../../../../assets/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

const ThirdTutorial = ({swiperRef}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={styles.innerView}>
        <GText medium text={'Tap the Check'} style={styles.tapTextStyle} />
        <GText medium text={'to connect'} style={styles.tapTextStyle2} />
        <Image source={Images.animatedArrowDown} style={styles.arrowImgStyle} />
        <View style={styles.tapView(insets)}>
          <TouchableOpacity
            onPress={() => {
              swiperRef.current.scrollBy(1);
            }}
            style={styles.tapTouchView}>
            <Image source={Images.checkCircle} style={styles.circleImgStyle} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ThirdTutorial;

const styles = StyleSheet.create({
  container: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scaledValue(20),
    position: 'absolute',
    bottom: 0,
  },
  innerView: {
    height: '100%',
    alignItems: 'center',
  },
  tapTextStyle: {
    color: colors.peachy,
    fontSize: scaledValue(28),
    letterSpacing: scaledValue(28 * -0.03),
    textAlign: 'center',
    lineHeight: scaledHeightValue(28 * 1.2),
  },
  tapTextStyle2: {
    color: colors.white,
    fontSize: scaledValue(28),
    letterSpacing: scaledValue(28 * -0.03),
    textAlign: 'center',
    lineHeight: scaledHeightValue(28 * 1.2),
  },
  arrowImgStyle: {
    width: scaledValue(61),
    height: scaledValue(127),
  },
  tapView: insets => ({
    height: scaledValue(72),
    width: scaledValue(72),
    borderRadius: scaledValue(40),
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:
      insets.bottom === 0
        ? insets.bottom + scaledValue(42)
        : insets.bottom + scaledValue(15),
  }),
  tapTouchView: {
    height: scaledValue(60),
    width: scaledValue(60),
    borderRadius: scaledValue(40),
    backgroundColor: colors.themeColor,
    alignItems: 'center',
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  circleImgStyle: {
    height: scaledValue(30),
    width: scaledValue(30),
  },
});
