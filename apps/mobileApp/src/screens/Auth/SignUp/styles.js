import {Dimensions, Platform, StyleSheet} from 'react-native';
import fonts from '../../../utils/fonts';
import {colors} from '../../../../assets/colors';
import {
  scaledValue,
  getFontSize,
  scaledHeightValue,
} from '../../../utils/design.utils';

const deviceW = Dimensions.get('window').width;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  input: {
    width: deviceW - 40,
    height: scaledHeightValue(48),
    marginBottom: scaledValue(15),
    backgroundColor: 'transparent',
  },
  signupText: {
    fontSize: scaledValue(33),
    fontFamily: fonts.SUSE_MEDIUM,
    color: colors.themeColor,
    position: 'absolute',
    bottom: scaledValue(30),
    alignSelf: 'center',
  },

  ThreeLines: {
    height: scaledValue(179),
    width: '100%',
  },
  rightIcon: {
    resizeMode: 'contain',
    height: scaledHeightValue(20),
    width: scaledValue(20),
    tintColor: colors.themeColor,
  },
  checkBoxIcon: {
    height: scaledValue(18),
    width: scaledValue(18),
    resizeMode: 'contain',
  },
  checkboxView: {
    width: '10%',
  },
  agreeTextView: {
    width: '90%',
    left: scaledValue(10),
  },
  agreeInner: {
    width: '98%',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  agreePart1: {
    fontSize: scaledValue(16),
    fontFamily: fonts.SATOSHI_REGULAR,
    color: colors.black,
    letterSpacing: scaledValue(16 * -0.02),
    lineHeight: scaledHeightValue(19.2),
  },
  agreePart2: {
    fontSize: scaledValue(16),
    fontFamily: fonts.SATOSHI_BOLD,
    color: colors.themeColor,
    letterSpacing: scaledValue(16 * -0.02),
    lineHeight: scaledHeightValue(19.2),
  },
  gradientButton: {
    height: scaledHeightValue(48),
    width: deviceW - 212,
    borderRadius: scaledValue(12),
    alignSelf: 'center',
    marginTop: scaledHeightValue(30),
  },
  imageStyle: {
    height: scaledValue(18),
    width: scaledValue(14),
  },
  textStyle: {
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
    padding: scaledValue(10),
  },
  line: {
    width: scaledValue(80),
    height: scaledValue(1),
    backgroundColor: colors.darkPurple,
    opacity: 0.4,
  },
  lineView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaledHeightValue(32),
    alignSelf: 'center',
  },
  customButton: {
    backgroundColor: colors.azure,
    height: scaledHeightValue(48),
    width: scaledValue(228),
    borderRadius: scaledValue(12),
    marginBottom: scaledHeightValue(47),
    alignSelf: 'center',
    marginTop: scaledHeightValue(32),
  },
  iconStyle: {
    resizeMode: 'contain',
    height: scaledValue(17),
    width: scaledValue(17),
  },
  buttonText: {
    fontSize: getFontSize(19),
    fontFamily: fonts.SUSE_MEDIUM,
    paddingLeft: scaledValue(10),
  },
  already: {
    fontFamily: fonts.BE_VIETNAM_SEMIBOLD,
    color: colors.black,
    fontSize: scaledValue(16),
    letterSpacing: scaledValue(19 * -0.04),
  },
  termsView: {flexDirection: 'row', paddingHorizontal: scaledValue(30)},
  signIn: {
    color: colors.themeColor,
  },
  loginViaText: {
    color: colors.darkPurple,
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(19.2),
    letterSpacing: scaledValue(16 * -0.01),
    paddingLeft: scaledValue(20),
    paddingRight: scaledValue(20),
    opacity: 0.4,
  },
});
