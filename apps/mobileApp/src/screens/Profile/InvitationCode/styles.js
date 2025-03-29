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

  //

  meetingCardMainContainer: insets => ({
    backgroundColor: colors.offWhite,
    marginHorizontal: scaledValue(20),
    borderRadius: scaledValue(20),
    // height: scaledHeightValue(409),
    marginTop: scaledHeightValue(27),
  }),
  profileCardMainView: {
    backgroundColor: colors.creamyTan,
    borderTopLeftRadius: scaledValue(20),
    borderTopRightRadius: scaledValue(20),
    height: scaledHeightValue(144),
  },
  profileCardView: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: scaledHeightValue(28),
    // backgroundColor: 'red',
  },

  userDetailView: {
    backgroundColor: '#FFF4EC80',
    width: scaledValue(68),
    height: scaledHeightValue(68),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaledValue(50),
  },
  userImage: {
    width: scaledValue(64),
    height: scaledHeightValue(64),
    borderRadius: scaledValue(50),
    color: colors.charcoal,
  },

  userName: {
    fontSize: scaledValue(23),

    letterSpacing: scaledValue(23 * -0.03),
  },

  centerCircleView: {
    width: scaledValue(32),
    height: scaledHeightValue(32),
    backgroundColor: colors.offWhite,
    borderRadius: scaledValue(50),
    alignSelf: 'center',
    marginTop: scaledHeightValue(-18),
  },
  meetingDetailsMainView: {
    paddingHorizontal: scaledValue(20),
    paddingVertical: scaledHeightValue(8),
    // marginBottom: scaledHeightValue(10),
  },

  gradientStyle: {
    height: scaledHeightValue(48),
    width: scaledValue(295),
    alignSelf: 'center',
    paddingHorizontal: scaledValue(20),
    marginBottom: scaledHeightValue(28),
  },

  dottedLineView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftCircleView: {
    backgroundColor: colors.slightlyPink,
    width: scaledValue(30),
    height: scaledHeightValue(30),
    borderRadius: scaledValue(50),
    marginLeft: scaledValue(-18),
  },
  dottedImage: {
    width: scaledValue(275),
    height: scaledHeightValue(16),
    alignSelf: 'center',
  },
  rightCircleView: {
    backgroundColor: colors.slightlyPink,
    width: scaledValue(30),
    height: scaledHeightValue(30),
    borderRadius: scaledValue(50),
    marginRight: scaledValue(-18),
  },
  headerTitileView: insets => ({
    flexDirection: 'row',
    alignItems: 'center',
    // position: 'absolute',
    marginTop: insets?.top + scaledHeightValue(13),
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
    fontSize: getFontSize(23),
    lineHeight: scaledHeightValue(27.6),
    letterSpacing: scaledValue(23 * -0.03),
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: scaledValue(38),
  },
  codeText: {
    fontSize: scaledValue(33),
    color: colors.Gray,
    lineHeight: scaledValue(39.6),
    letterSpacing: scaledValue(33 * -0.03),
  },
  dottedImageView: {
    marginBottom: scaledHeightValue(20),
    marginTop: scaledHeightValue(20),
  },
  codeValidText: {
    fontSize: scaledValue(14),
    color: colors.Gray,
    lineHeight: scaledHeightValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
    textAlign: 'center',
    marginBottom: scaledHeightValue(20),
  },
});
