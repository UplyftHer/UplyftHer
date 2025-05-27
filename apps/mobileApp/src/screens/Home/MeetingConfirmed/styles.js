import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../../../assets/colors';
import {
  getFontSize,
  scaledHeightValue,
  scaledValue,
} from '../../../utils/design.utils';
import fonts from '../../../utils/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slightlyPink,
  },
  lineImageView: {
    backgroundColor: colors.slightlyPink,
  },
  whiteLines: {
    height: scaledHeightValue(180),
    width: '100%',
  },

  headerText: {
    color: colors.white,
    fontSize: getFontSize(28),
    lineHeight: scaledHeightValue(33.6),
    letterSpacing: scaledValue(28 * -0.03),
    alignSelf: 'center',
    textAlign: 'center',
  },

  meetingCardMainContainer: insets => ({
    backgroundColor: colors.offWhite,
    marginTop: scaledHeightValue(-76),
    marginHorizontal: scaledValue(20),
    borderRadius: scaledValue(20),
    height: scaledHeightValue(545),
  }),
  profileCardMainView: {
    backgroundColor: colors.creamyTan,
    borderTopLeftRadius: scaledValue(20),
    borderTopRightRadius: scaledValue(20),
  },
  profileCardView: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: scaledValue(59.5),
    marginVertical: scaledHeightValue(56),
    // justifyContent: 'space-evenly',
    justifyContent: 'center',
  },
  userProfileView: {
    alignItems: 'center',
    position: 'absolute',
    left: scaledValue(30),
  },
  userDetailView: {
    backgroundColor: '#FFF4EC80',
    width: scaledValue(68),
    height: scaledHeightValue(68),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaledValue(34),
  },
  userImage: {
    width: scaledValue(60),
    height: scaledHeightValue(60),
    borderRadius: scaledValue(30),
    color: colors.charcoal,
  },

  userName: {
    fontSize: scaledValue(23),
    lineHeight: scaledHeightValue(27.6),
    letterSpacing: scaledValue(23 * -0.03),
  },

  asteriskImage: {
    width: scaledValue(40),
    height: scaledHeightValue(40),
    // marginRight: scaledValue(24),
    alignItems: 'center',
  },
  centerCircleView: {
    width: scaledValue(36),
    height: scaledHeightValue(36),
    backgroundColor: colors.offWhite,
    borderRadius: scaledValue(50),
    alignSelf: 'center',
    marginTop: scaledHeightValue(-18),
  },
  meetingDetailsMainView: {
    paddingHorizontal: scaledValue(20),
    paddingVertical: scaledHeightValue(8),
    marginBottom: scaledHeightValue(10),
  },
  meetingDetailsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailView: {width: scaledValue(135)},
  detailText: {
    fontSize: scaledValue(12),
    lineHeight: scaledHeightValue(15.6),
    color: colors.charcoal,
    opacity: scaledValue(0.5),
  },
  subDetailText: {
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(19.2),
    color: colors.Gray,
  },
  textStyle: {
    fontSize: scaledValue(19),
    fontFamily: fonts.SUSE_MEDIUM,
    letterSpacing: scaledValue(19 * -0.03),
    marginHorizontal: scaledValue(20),
  },
  gradientStyle: {
    height: scaledHeightValue(48),
    width: scaledValue(295),
    alignSelf: 'center',
  },
  scannerMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaledHeightValue(10),
  },
  scanTextView: {
    paddingLeft: scaledValue(32),
    paddingRight: scaledValue(36),
    marginRight: scaledValue(36),
  },
  scanText: {
    fontSize: scaledValue(14),
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
    color: colors.Gray,
  },
  qrcodeImage: {
    width: scaledValue(100),
    height: scaledHeightValue(100),
  },
  dottedLineView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaledHeightValue(10),
  },
  leftCircleView: {
    backgroundColor: colors.slightlyPink,
    width: scaledValue(36),
    height: scaledHeightValue(36),
    borderRadius: scaledValue(50),
    marginLeft: scaledValue(-18),
  },
  dottedImage: {
    width: scaledValue(275),
    height: scaledHeightValue(16),
  },
  rightCircleView: {
    backgroundColor: colors.slightlyPink,
    width: scaledValue(36),
    height: scaledHeightValue(36),
    borderRadius: scaledValue(50),
    marginRight: scaledValue(-18),
  },
  headerTitileView: insets => ({
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

  imageStyle: {
    height: scaledHeightValue(18),
    width: scaledValue(14),
  },

  line: {
    width: scaledValue(80),
    height: scaledHeightValue(1),
    backgroundColor: colors.darkPurple,
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
    lineHeight: scaledHeightValue(33.6),
  },
  subtitleStyle: {
    color: colors.white,
    fontSize: getFontSize(28),
    lineHeight: scaledHeightValue(33.6),
    letterSpacing: scaledValue(28 * -0.03),
    alignSelf: 'center',
    textAlign: 'center',
  },
});
