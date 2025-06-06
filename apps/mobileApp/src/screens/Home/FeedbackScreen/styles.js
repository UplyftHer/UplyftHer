import {Dimensions, StyleSheet} from 'react-native';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {colors} from '../../../../assets/colors';
import fonts from '../../../utils/fonts';
const deviceW = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  headerTitleView: insets => ({
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: insets?.top + scaledHeightValue(13),
    width: '100%',
    paddingHorizontal: scaledValue(20),
  }),
  keyboardAvoidingStyle: {flex: 1, backgroundColor: colors.offWhite},
  gradientRect: {
    height: scaledHeightValue(309),
    width: '100%',
  },
  HeaderView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgBg: {
    width: '100%',
    height: scaledHeightValue(309),
  },
  whiteLines: {
    height: scaledHeightValue(180),
    width: '100%',
  },
  containerView: {
    flex: 1,
    backgroundColor: colors.offWhite,
    borderTopLeftRadius: scaledValue(32),
    borderTopRightRadius: scaledValue(32),

    marginTop: scaledHeightValue(-28),
    paddingVertical: scaledValue(10),
  },

  imageStyle: {
    height: scaledHeightValue(18),
    width: scaledValue(14),
  },
  textStyle: {
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
    padding: scaledValue(10),
  },
  line: {
    width: scaledValue(80),
    height: scaledHeightValue(1),
    backgroundColor: colors.darkPurple,
  },

  headerText: {
    color: colors.white,
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
    fontFamily: fonts.SUSE_MEDIUM,
    marginLeft: Dimensions.get('window').width / 4,
  },
  flatlistImage: {
    height: scaledHeightValue(92),
    width: scaledValue(80),
    borderRadius: scaledValue(16),
  },
  contentView: {
    alignSelf: 'center',
  },
  newConversationText: {
    fontSize: scaledValue(19),
    lineHeight: scaledHeightValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    color: colors.themeColor,
    marginTop: scaledHeightValue(19),
  },

  leftArrowStyle: {
    tintColor: 'white',
    height: scaledHeightValue(40),
    width: scaledValue(40),
  },
  titleStyle: {
    fontSize: scaledValue(28),
    letterSpacing: scaledValue(28 * -0.03),
    textAlign: 'center',
    color: colors.offWhite,
    // lineHeight: scaledHeightValue(33.6),
  },
  subtitleStyle: {
    fontSize: scaledValue(14),
    letterSpacing: scaledValue(14 * -0.02),
    textAlign: 'center',
    color: colors.white,
  },
  ratingView: {
    height: scaledHeightValue(261),
    marginHorizontal: scaledValue(20),
    borderRadius: scaledValue(24),
    backgroundColor: colors.offWhite,
    elevation: 10,
    shadowColor: colors.inputPlaceholder,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    marginTop: scaledHeightValue(-92),
  },
  profileImage: {
    height: scaledHeightValue(72),
    width: scaledValue(72),
    borderRadius: scaledValue(50),
    alignSelf: 'center',
    marginTop: scaledHeightValue(23),
    marginBottom: scaledHeightValue(12),
  },
  nameText: {
    fontSize: scaledValue(19),
    letterSpacing: 19 * -0.03,
    textAlign: 'center',
  },
  placeText: {
    fontSize: scaledValue(16),
    letterSpacing: scaledValue(16 * -0.02),
    lineHeight: scaledHeightValue(18.2),
    textAlign: 'center',
  },
  ratingText: {
    fontSize: scaledValue(19),
    letterSpacing: 19 * -0.03,
    textAlign: 'center',
    marginTop: scaledHeightValue(28),
    marginBottom: scaledValue(12),
  },
  starImage: {
    height: scaledHeightValue(32),
    width: scaledValue(32),
  },
  textInput: {
    borderRadius: scaledValue(12),
    borderColor: colors.themeColor,
    height: scaledValue(122),
    width: deviceW - 40,
    backgroundColor: 'transparent',
    marginHorizontal: scaledValue(20),
    fontSize: scaledValue(14),
    lineHeight: scaledHeightValue(18.2),
    letterSpacing: scaledValue(18 * -0.02),
    marginBottom: scaledHeightValue(4),
  },
  preferenceText: {
    fontSize: scaledValue(19),
    lineHeight: scaledHeightValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    color: colors.charcoal,
  },
  textView: {
    gap: 12,
  },
  textInputView: {
    alignSelf: 'center',
    marginTop: scaledHeightValue(40),
    marginBottom: scaledHeightValue(72),
  },
  buttonText: {
    fontFamily: fonts.SUSE_MEDIUM,
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
  },
  buttonStyle: {
    marginHorizontal: scaledValue(20),
    borderRadius: scaledValue(12),
    marginBottom: scaledHeightValue(10),
    height: scaledHeightValue(48),
  },
  wordCountText: {
    marginHorizontal: scaledValue(20),
    alignItems: 'flex-end',
  },
});
