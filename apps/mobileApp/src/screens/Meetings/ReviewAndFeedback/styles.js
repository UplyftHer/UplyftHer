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
    top: insets?.top + scaledValue(13),
    width: '100%',
    paddingHorizontal: scaledValue(20),
  }),
  keyboardAvoidingStyle: {flex: 1, backgroundColor: colors.offWhite},
  gradientRect: {
    height: scaledValue(309),
    width: '100%',
  },
  HeaderView: {
    flexDirection: 'row',
    alignItems: 'center',
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

    marginTop: scaledValue(-28),
    paddingVertical: scaledValue(10),
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
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
    fontFamily: fonts.SUSE_MEDIUM,
    marginLeft: Dimensions.get('window').width / 4,
  },
  flatlistImage: {
    height: scaledValue(92),
    width: scaledValue(80),
    borderRadius: scaledValue(16),
  },
  contentView: {
    alignSelf: 'center',
  },
  newConversationText: {
    fontSize: scaledValue(19),
    lineHeight: scaledValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    color: colors.themeColor,
    marginTop: scaledValue(19),
  },

  leftArrowStyle: {
    tintColor: 'white',
    height: scaledValue(40),
    width: scaledValue(40),
  },
  titleStyle: {
    fontSize: scaledValue(28),
    letterSpacing: scaledValue(28 * -0.03),
    textAlign: 'center',
    color: colors.offWhite,
    lineHeight: scaledHeightValue(33.6),
  },
  subtitleStyle: {
    fontSize: scaledValue(14),
    letterSpacing: scaledValue(14 * -0.02),
    textAlign: 'center',
    color: colors.white,
    opacity: 0.8,
  },
  ratingView: {
    // height: scaledValue(261),
    marginHorizontal: scaledValue(20),
    borderRadius: scaledValue(24),
    backgroundColor: colors.offWhite,
    elevation: 10,
    shadowColor: colors.inputPlaceholder,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    marginTop: scaledValue(-92),
    paddingVertical: scaledValue(23),
  },
  profileImage: {
    height: scaledValue(72),
    width: scaledValue(72),
    borderRadius: scaledValue(50),
    alignSelf: 'center',
    marginBottom: scaledValue(12),
  },
  nameText: {
    fontSize: scaledValue(19),
    letterSpacing: 19 * -0.03,
    textAlign: 'center',
  },
  placeText: {
    fontSize: scaledValue(14),
    letterSpacing: scaledValue(14 * -0.02),
    lineHeight: scaledValue(18.2),
    textAlign: 'center',
    textTransform: 'capitalize',
    opacity: 0.7,
    color: '#37223C',
  },
  ratingText: {
    fontSize: scaledValue(19),
    letterSpacing: 19 * -0.03,
    textAlign: 'center',
    marginTop: scaledValue(22),
    marginBottom: scaledValue(12),
  },
  starImage: {
    height: scaledValue(32),
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
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(18 * -0.02),
    marginBottom: scaledValue(4),
  },
  preferenceText: {
    fontSize: scaledValue(19),
    lineHeight: scaledValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    color: colors.charcoal,
  },
  textView: {
    gap: 12,
  },
  textInputView: {
    alignSelf: 'center',
    marginTop: scaledValue(40),
    marginBottom: scaledValue(72),
  },

  wordCountText: {
    marginHorizontal: scaledValue(20),
    alignItems: 'flex-end',
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
});
