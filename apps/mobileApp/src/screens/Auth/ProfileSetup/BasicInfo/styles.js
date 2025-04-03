import {Dimensions, StyleSheet} from 'react-native';
import fonts from '../../../../utils/fonts';
import {colors} from '../../../../../assets/colors';
import {scaledHeightValue, scaledValue} from '../../../../utils/design.utils';
const deviceW = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    paddingHorizontal: scaledValue(20),
  },
  headerText1: {
    color: colors.black,
    fontFamily: fonts.SUSE_SEMIBOLD,
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(19.2),
    letterSpacing: scaledValue(16 * -0.03),
    textAlign: 'center',
  },
  headerText2: {
    color: colors.inputPlaceholder,
  },
  basicInfoText: {
    marginTop: scaledHeightValue(33),
    textAlign: 'center',
    fontSize: scaledValue(23),
    fontFamily: fonts.SUSE_MEDIUM,
    color: colors.themeColor,
    letterSpacing: scaledValue(23 * -0.02),
  },
  contentText: {
    textAlign: 'center',
    marginTop: scaledHeightValue(16),
    fontFamily: fonts.BE_VIETNAM_REGULAR,
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
    fontSize: scaledValue(14),
    color: colors.Gray,
  },
  input: {
    width: deviceW - 40,
    height: scaledHeightValue(48),
    backgroundColor: 'transparent',
    marginBottom: scaledHeightValue(16),
    color: '#5A5A5A',
    fontSize: scaledValue(16),
  },
  gradientStyle: {
    height: scaledHeightValue(48),
    width: deviceW - 40,
    alignSelf: 'center',
  },
  textStyle: {
    fontSize: scaledValue(19),
    fontFamily: fonts.SUSE_MEDIUM,
    lineHeight: scaledHeightValue(22.8),
    letterSpacing: 19 * -0.03,
  },
  rightIcon: {
    resizeMode: 'contain',
    height: scaledHeightValue(20),
    width: scaledValue(20),
    tintColor: colors.themeColor,
  },
  organizationText: {
    color: '#3E3E3E',
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(20.8),
    letterSpacing: scaledValue(16 * -0.02),
  },
});
