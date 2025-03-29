import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../../../assets/colors';
import fonts from '../../../utils/fonts';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';

const deviceW = Dimensions.get('window').width;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
  },
  arrow: {
    tintColor: colors.themeColor,
    height: scaledValue(40),
    width: scaledValue(40),
  },
  forgotText: {
    fontSize: scaledValue(19),
    color: colors.black,
    letterSpacing: scaledValue(19 * -0.003),
    lineHeight: scaledValue(22.8),
  },
  headerText: {
    fontSize: scaledValue(19),
    fontFamily: fonts.SUSE_MEDIUM,
  },
  emailText: {
    fontSize: scaledValue(23),
    letterSpacing: scaledValue(23 * -0.03),
    lineHeight: scaledValue(27.6),
    color: colors.themeColor,
    textAlign: 'center',
    marginTop: scaledValue(54),
  },
  content: {
    fontSize: scaledValue(16),
    lineHeight: scaledValue(20.8),
    letterSpacing: scaledValue(16 * -0.02),
    color: colors.Gray,
    textAlign: 'center',
    marginTop: scaledValue(20),
  },
  input: {
    width: deviceW - 40,
    height: scaledHeightValue(48),
    backgroundColor: 'transparent',
  },
  gradientStyle: {
    height: scaledHeightValue(48),
    width: deviceW - 40,
  },
  buttonText: {
    fontSize: scaledValue(19),
    fontFamily: fonts.SUSE_MEDIUM,
    lineHeight: scaledValue(22.8),
    letterSpacing: 19 * -0.03,
  },
  gradientView: {
    position: 'absolute',
    bottom: 40,
  },
  rightIcon: {
    resizeMode: 'contain',
    height: scaledValue(20),
    width: scaledValue(20),
    tintColor: colors.themeColor,
  },
});
