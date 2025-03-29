import {Dimensions, StyleSheet} from 'react-native';
import {
  getFontSize,
  scaledHeightValue,
  scaledValue,
} from '../../../utils/design.utils';

import {colors} from '../../../../assets/colors';
import fonts from '../../../utils/fonts';
const deviceW = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBg: {
    width: '100%',
    height: scaledValue(309),
  },
  whiteLines: {
    height: scaledValue(180),
    width: '100%',
  },
  containerView: {
    flex: 1,
    backgroundColor: colors.offWhite,
    borderTopLeftRadius: scaledValue(32),
    borderTopRightRadius: scaledValue(32),
    paddingVertical: scaledValue(10),
  },

  rightIcon: {
    resizeMode: 'contain',
    height: scaledValue(20),
    width: scaledValue(20),
    tintColor: colors.themeColor,
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
  },

  headerText: {
    color: colors.white,
    fontSize: scaledValue(23),
    lineHeight: scaledHeightValue(27.6),
    letterSpacing: scaledValue(33 * -0.03),
    fontFamily: fonts.SUSE_MEDIUM,
  },
  flatListImage: {
    height: scaledValue(92),
    width: scaledValue(80),
    borderRadius: scaledValue(16),
  },
  contentView: {
    width: deviceW - 40,
    alignSelf: 'center',
  },
  newConversationText: {
    fontSize: scaledValue(19),
    lineHeight: scaledValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    color: colors.themeColor,
    marginTop: scaledValue(19),
  },

  leftArrowStyle: insets => ({
    tintColor: 'white',
    height: scaledValue(40),
    width: scaledValue(40),
  }),
  newConvoImage: {
    height: scaledValue(48),
    width: scaledValue(48),
    borderRadius: scaledValue(200),
  },
  newConvoFlatList: {
    flexDirection: 'row',
    alignItems: 'center',
    width: deviceW - 40,
    alignSelf: 'center',

    justifyContent: 'space-between',
    borderBottomWidth: scaledValue(1),
    borderColor: colors.borderColor,
    height: scaledValue(72),
    marginBottom: scaledValue(12),
  },
  textView: {
    width: scaledValue(214),
  },
  nameStyle: {
    fontSize: scaledValue(16),
    fontFamily: fonts.SUSE_SEMIBOLD,
    lineHeight: scaledValue(19.2),
    letterSpacing: scaledValue(16 * -0.03),
    color: colors.charcoal,
  },
  messageStyle: {
    fontSize: 12,
    fontFamily: fonts.BE_VIETNAM_REGULAR,
    lineHeight: scaledValue(15.6),
    letterSpacing: scaledValue(12 * -0.02),
    color: colors.charcoal,
  },
  timingStyle: {
    fontSize: scaledValue(12),
    fontFamily: fonts.BE_VIETNAM_BOLD,
    lineHeight: scaledValue(15.6),
    color: colors.lightCharcoal,
  },
  gradientButton: {
    borderRadius: scaledValue(4),
    alignItems: 'center',
    justifyContent: 'center',
    height: scaledValue(20),
    width: scaledValue(42),
    marginBottom: scaledValue(12),
  },
  buttonTextStyle: {
    fontFamily: fonts.BE_VIETNAM_BOLD,
    fontSize: getFontSize(12),
  },
  oldConvoText: {
    marginLeft: scaledValue(20),
    marginTop: scaledValue(43),
    lineHeight: scaledValue(19.2),
    letterSpacing: scaledValue(19.2 * -0.03),
    marginBottom: scaledValue(14),
  },
  daysView: {
    height: '100%',
  },
  daysStyle: {
    fontSize: scaledValue(12),
    fontFamily: fonts.BE_VIETNAM_BOLD,
    lineHeight: scaledValue(15.6),
    color: colors.lightCharcoal,
    marginTop: scaledValue(12),
  },
  subHeaderText: {
    fontSize: scaledValue(19),
    lineHeight: scaledValue(22.8),
    color: colors.offWhite,
    fontFamily: fonts.SUSE_MEDIUM,
    letterSpacing: scaledValue(19 * -0.03),
    marginHorizontal: scaledValue(20),
  },
});
