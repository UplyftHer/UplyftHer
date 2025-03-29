import {Dimensions, Platform, StyleSheet} from 'react-native';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {colors} from '../../../../assets/colors';
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
    lineHeight: scaledHeightValue(20.8),
    letterSpacing: scaledValue(16 * -0.02),
    color: colors.Gray,
    textAlign: 'center',
    marginTop: scaledValue(20),
  },
  input: {
    width: deviceW - 40,
    height: scaledHeightValue(48),
    marginBottom: scaledValue(15),
    backgroundColor: 'transparent',
    marginTop: scaledValue(20),
  },
  gradientStyle: {
    height: scaledHeightValue(48),
  },
  buttonText: {
    fontSize: scaledValue(19),
    fontFamily: fonts.SUSE_MEDIUM,
    lineHeight: scaledValue(22.8),
    letterSpacing: 19 * -0.03,
  },
  absoluteButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonContainer: {
    paddingHorizontal: scaledValue(20),
    marginBottom: Platform.OS == 'android' ? scaledValue(20) : 20,
  },

  gradientView: insets => ({
    position: 'absolute',
    bottom: insets?.bottom + 40,
    width: deviceW - 40,
  }),
});
