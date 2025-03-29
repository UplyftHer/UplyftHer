import {Dimensions, StyleSheet} from 'react-native';
import {scaledHeightValue, scaledValue} from '../../../../utils/design.utils';
import {colors} from '../../../../../assets/colors';
import fonts from '../../../../utils/fonts';

const deviceW = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  headerIconStyle: {width: scaledValue(40), height: scaledValue(40)},
  headerTitleStyle: {
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
    lineHeight: scaledHeightValue(22.8),
    color: colors.charcoal,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#FFF4EC',
    paddingHorizontal: scaledValue(20),
  },
  content: {
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(20.8),
    letterSpacing: scaledValue(16 * -0.02),
    color: colors.Gray,
    textAlign: 'center',
    marginTop: scaledHeightValue(53),
  },
  input: {
    width: deviceW - 40,
    height: scaledHeightValue(48),
    backgroundColor: 'transparent',
    marginTop: scaledValue(32),
  },
  labelStyling: (isFocused, newEmail) => ({
    color: isFocused || newEmail ? colors.themeColor : colors.Gray,
    fontFamily:
      isFocused || newEmail ? fonts.BE_VIETNAM_BOLD : fonts.BE_VIETNAM_REGULAR,
    fontSize: scaledValue(14),
    letterSpacing: scaledValue(14 * -0.02),
  }),
  buttonText: {
    fontSize: scaledValue(19),
    fontFamily: fonts.SUSE_MEDIUM,
    lineHeight: scaledHeightValue(22.8),
    letterSpacing: 19 * -0.03,
  },
  gradientStyle: {
    height: scaledHeightValue(48),
    width: deviceW - 40,
    marginTop: scaledValue(40),
  },
});
