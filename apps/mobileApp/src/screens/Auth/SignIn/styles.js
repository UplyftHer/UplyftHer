import {Dimensions, Platform, StyleSheet} from 'react-native';
import {
  getFontSize,
  scaledHeightValue,
  scaledValue,
  statusBarHeight,
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
    height: scaledValue(230),
  },
  whiteLines: {
    height: scaledValue(170),
    width: '100%',
    marginTop: scaledValue(-10),
    resizeMode: 'cover',
  },
  containerView: {
    marginTop:
      Platform.OS === 'ios'
        ? scaledValue(-75) + statusBarHeight
        : scaledValue(-75),
    flex: 1,
    backgroundColor: colors.offWhite,
    borderTopLeftRadius: scaledValue(32),
    borderTopRightRadius: scaledValue(32),
  },
  input: {
    width: '100%',
    height: scaledHeightValue(48),
    marginBottom: scaledValue(15),
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  contentView: {
    height: scaledHeightValue(357),
    width: scaledValue(355),
    alignItems: 'center',

    alignSelf: 'center',
    // marginHorizontal: scaledValue(20),
    width: deviceW - 40,

    marginTop: 80,
  },
  rightIcon: {
    resizeMode: 'contain',
    height: scaledValue(20),
    width: scaledValue(20),
    tintColor: colors.themeColor,
  },
  forgotText: {
    color: colors.themeColor,
    fontSize: scaledValue(14),
    lineHeight: scaledHeightValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
  },
  gradientButton: {
    height: scaledHeightValue(48),
    borderRadius: scaledValue(12),
    marginBottom: scaledHeightValue(40),
  },
  imageStyle: {
    height: scaledValue(18),
    width: scaledValue(14),
  },
  textStyle: {
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
    paddingHorizontal: scaledValue(10),
    marginHorizontal: scaledValue(30),
  },
  customButton: {
    backgroundColor: colors.azure,
    height: scaledHeightValue(48),
    width: scaledValue(228),
    borderRadius: scaledValue(12),
    marginBottom: scaledHeightValue(50),
  },
  iconStyle: {
    resizeMode: 'contain',
    height: scaledValue(17),
    width: scaledValue(17),
  },
  buttonText: {
    fontSize: getFontSize(19),
    fontFamily: fonts.SUSE_MEDIUM,
    paddingLeft: scaledValue(10),
  },
  buttonView: {
    alignItems: 'center',
    marginTop: scaledHeightValue(30),
  },
  signInText: {
    color: colors.white,
    fontSize: scaledValue(33),
    lineHeight: scaledHeightValue(39.6),
    letterSpacing: scaledValue(33 * -0.03),
    position: 'absolute',
    alignSelf: 'center',
    fontFamily: fonts.SUSE_MEDIUM,
    top: scaledValue(93),
  },

  arrow: {
    height: scaledValue(40),
    width: scaledValue(40),
  },
  forgotPasswordText: {
    marginTop: scaledValue(-10),
    width: '100%',
    alignItems: 'flex-end',
  },
  loginViaText: {
    color: colors.darkPurple,
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(19.2),
    letterSpacing: scaledValue(16 * -0.01),
    paddingLeft: scaledValue(20),
    paddingRight: scaledValue(20),
    opacity: 0.4,
  },

  line: {
    width: scaledValue(80),
    height: scaledValue(1),
    backgroundColor: colors.darkPurple,
    opacity: 0.4,
  },
  lineView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaledHeightValue(32),
    alignSelf: 'center',
    marginBottom: scaledHeightValue(40),
  },
});
