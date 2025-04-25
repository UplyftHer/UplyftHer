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
import {useAppSelector} from '../../../redux/store/storeUtils';

const {width, height} = Dimensions.get('window');

const ForthTutorial = ({goToNextManually}) => {
  const insets = useSafeAreaInsets();
  const userData = useAppSelector(state => state.auth.user);
  const user = userData?.userType === 0 ? 'mentor' : 'mentee';
  const tapText = `to skip this ${user}`;

  return (
    <View style={styles.container}>
      <View style={styles.innerView}>
        <GText medium text={'Tap the X'} style={styles.tapTextStyle} />
        <GText medium text={tapText} style={styles.tapText2Style} />
        <Image source={Images.animatedArrowDown} style={styles.arrowImgStyle} />
        <View style={styles.tapView(insets)}>
          <TouchableOpacity
            onPress={() => {
              goToNextManually();
            }}
            style={styles.tapTouchView}>
            <Image source={Images.rejectImage} style={styles.rejectImgStyle} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForthTutorial;

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
    marginLeft: scaledValue(50),
    // alignItems: 'center',
    width: '100%',
    paddingHorizontal: scaledValue(40),
  },
  tapTextStyle: {
    color: colors.peachy,
    fontSize: scaledValue(28),
    letterSpacing: scaledValue(28 * -0.03),
    lineHeight: scaledHeightValue(28 * 1.2),
  },
  tapText2Style: {
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
    backgroundColor: colors.softRed,
    alignItems: 'center',
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  rejectImgStyle: {
    height: scaledValue(20),
    width: scaledValue(20),
  },
});
