import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../../../assets/colors';
import {scaledValue} from '../../../utils/design.utils';
import fonts from '../../../utils/fonts';
const deviceW = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
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
    marginTop: scaledValue(100),
  },
  input: {
    width: scaledValue(355),
    height: scaledValue(48),
    marginBottom: scaledValue(15),
    backgroundColor: 'transparent',
    marginTop: scaledValue(20),
  },
  gradientStyle: {
    height: scaledValue(48),
    width: deviceW - 40,
  },
  buttonText: {
    fontSize: scaledValue(19),
    fontFamily: fonts.SUSE_MEDIUM,
    lineHeight: scaledValue(22.8),
    letterSpacing: 19 * -0.03,
  },
  gradientView: {
    // position: 'absolute',
    alignSelf: 'center',
    marginTop: '50%',
    marginBottom: scaledValue(20),
  },
  bottomText1: {
    fontFamily: fonts.BE_VIETNAM_SEMIBOLD,
    color: colors.black,
    fontSize: scaledValue(16),
    letterSpacing: scaledValue(19 * -0.04),
  },
  bottomText2: {
    color: colors.themeColor,
  },
  root: {padding: 20, minHeight: 300},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {
    marginTop: scaledValue(17),
    width: deviceW - 75,
    alignSelf: 'center',
  },
  cellRoot: {
    width: scaledValue(50),
    height: scaledValue(56),
    // paddingHorizontal: scaledValue(16),
    paddingVertical: scaledValue(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.midGray,
    borderWidth: 1,
    borderRadius: scaledValue(12),
    marginHorizontal: -12,
  },
  cellText: {
    color: '#000',
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: colors.themeColor,
    borderBottomWidth: 2,
  },
  input: {
    width: deviceW - 40,
    height: scaledValue(48),
    backgroundColor: 'transparent',
  },
  rightIcon: {
    resizeMode: 'contain',
    height: scaledValue(20),
    width: scaledValue(20),
    tintColor: colors.themeColor,
  },
});
