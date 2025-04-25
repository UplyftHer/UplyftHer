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

const FifthTutorial = ({goToNextManually}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={styles.innerView}>
        <GText medium text={'Tap Bookmark'} style={styles.tapTextStyle} />
        <GText medium text={'to save for later'} style={styles.tapTextStyle2} />
        <Image source={Images.animatedArrowDown} style={styles.arrowImgStyle} />
        <View style={styles.tapView(insets)}>
          <TouchableOpacity
            onPress={() => {
              goToNextManually();
            }}
            // onPress={() => {
            //   swiperRef.current.scrollBy(1);
            // }}
            style={styles.tapTouchView}>
            <Image source={Images.bookmark} style={styles.bookmarkImgStyle} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FifthTutorial;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', // important for bottom align
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.6)', // semi-transparent if desired
    position: 'absolute', // can overlay over anything
    top: 0,
    left: 0,
  },
  innerView: {
    // height: '100%',
    // marginRight: scaledValue(50),
    alignItems: 'flex-end',
    // height: '100%',
    // marginLeft: scaledValue(50),
    // alignItems: 'center',
    width: '100%',
    paddingHorizontal: scaledValue(70),
  },
  tapTextStyle: {
    color: colors.peachy,
    fontSize: scaledValue(28),
    letterSpacing: scaledValue(28 * -0.03),
    lineHeight: scaledHeightValue(28 * 1.2),
  },
  tapTextStyle2: {
    color: colors.white,
    fontSize: scaledValue(28),
    letterSpacing: scaledValue(28 * -0.03),
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
    height: scaledValue(40),
    width: scaledValue(40),
    borderRadius: scaledValue(40),
    backgroundColor: colors.peachy,
    alignItems: 'center',
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  bookmarkImgStyle: {
    height: scaledValue(20),
    width: scaledValue(20),
  },
});
