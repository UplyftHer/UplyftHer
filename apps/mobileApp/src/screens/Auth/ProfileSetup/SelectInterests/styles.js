import {Dimensions, StyleSheet} from 'react-native';
import fonts from '../../../../utils/fonts';
import {colors} from '../../../../../assets/colors';
import {scaledHeightValue, scaledValue} from '../../../../utils/design.utils';
const deviceW = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.offWhite,
  },

  headerText1: {
    color: colors.black,
    fontFamily: fonts.SUSE_SEMIBOLD,
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(19.2),
    letterSpacing: scaledHeightValue(16 * -0.03),
    // textAlign: 'center',
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
    letterSpacing: scaledHeightValue(23 * -0.02),
  },
  contentText: {
    textAlign: 'center',
    marginTop: scaledHeightValue(14),
    fontFamily: fonts.BE_VIETNAM_REGULAR,
    lineHeight: scaledHeightValue(18.2),
    letterSpacing: scaledHeightValue(14 * -0.02),
    fontSize: scaledValue(14),
    color: colors.Gray,
    marginBottom: scaledHeightValue(31),
  },
  gradientStyle: {
    height: scaledHeightValue(48),
    width: deviceW - 40,
    // marginBottom: scaledHeightValue(40),
    // marginTop: scaledHeightValue(121),
    alignSelf: 'center',
  },
  textStyle: {
    fontSize: scaledValue(19),
    fontFamily: fonts.SUSE_MEDIUM,
    lineHeight: scaledValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
  },
  flatListText: {
    fontSize: scaledValue(16),
    fontFamily: fonts.SUSE_MEDIUM,
    color: colors.themeColor,
    lineHeight: scaledValue(19.2),
    letterSpacing: scaledValue(16 * -0.03),
    paddingVertical: scaledHeightValue(8),
  },
  flatListMain: {
    borderRadius: scaledValue(8),
    borderWidth: scaledValue(1),
    borderColor: colors.themeColor,
    marginLeft: scaledValue(8),
    marginBottom: scaledHeightValue(16),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaledValue(12),
  },
  crossIcon: {
    resizeMode: 'contain',
    height: 20,
    width: 20,
    marginLeft: scaledValue(4),
  },
});
