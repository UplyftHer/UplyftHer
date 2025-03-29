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
  emailText: {
    fontSize: scaledValue(23),
    letterSpacing: scaledValue(23 * -0.03),
    lineHeight: scaledValue(27.6),
    color: colors.themeColor,
    textAlign: 'center',
    marginTop: scaledValue(30),
  },
  content: {
    fontSize: scaledValue(16),
    lineHeight: scaledValue(20.8),
    letterSpacing: scaledValue(16 * -0.02),
    color: colors.Gray,
    textAlign: 'center',
    marginTop: scaledValue(20),
  },
  codeFieldRoot: {
    marginTop: scaledValue(30),
    width: deviceW - 75,
    alignSelf: 'center',
  },
  cellRoot: {
    width: scaledValue(40),
    height: scaledValue(56),
    paddingVertical: scaledValue(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.midGray,
    borderBottomWidth: 1,
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
  gradientStyle: {
    height: scaledHeightValue(48),
    width: deviceW - 40,
    marginTop: scaledValue(73),
  },
  buttonText: {
    fontSize: scaledValue(19),
    fontFamily: fonts.SUSE_MEDIUM,
    lineHeight: scaledValue(22.8),
    letterSpacing: 19 * -0.03,
  },
});
