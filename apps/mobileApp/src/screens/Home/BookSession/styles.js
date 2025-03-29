import {Dimensions, StyleSheet} from 'react-native';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {colors} from '../../../../assets/colors';
import fonts from '../../../utils/fonts';
const deviceW = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBg: {
    flex: 1,
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
  },
  headerTitle: {
    fontSize: scaledValue(28),
    letterSpacing: scaledValue(28 * -0.03),
    lineHeight: scaledHeightValue(33.6),
    textAlign: 'center',
    marginTop: scaledHeightValue(19),
    color: colors.offWhite,
  },
  whiteLines: {
    marginTop: scaledHeightValue(71),
    width: '100%',

    height: scaledValue(180),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  backgroundView: {
    height: scaledValue(140),
    width: scaledValue(140),
    borderRadius: scaledValue(70),
    backgroundColor: colors.lightPeach,
    position: 'absolute',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: scaledHeightValue(16),
  },
  matchImageFirst: {
    height: scaledValue(120),
    width: scaledValue(120),
    borderRadius: scaledValue(60),
  },
  matchImageSecond: {
    height: scaledValue(120),
    width: scaledValue(120),
    borderRadius: scaledValue(60),
  },
  titleText: {
    fontSize: scaledValue(28),
    color: colors.offWhite,
    textAlign: 'center',
    lineHeight: scaledValue(33.6),
    letterSpacing: scaledValue(28 * -0.03),
    marginBottom: scaledHeightValue(20),
  },
  subtitle: {
    fontSize: scaledValue(14),
    color: colors.offWhite,
    textAlign: 'center',
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
  },
  buttonText: {
    fontSize: scaledValue(19),
    fontFamily: fonts.SUSE_MEDIUM,
    lineHeight: scaledHeightValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
  },
  buttonStyle: {
    borderWidth: scaledValue(1.5),
    borderColor: colors.offWhite,
    width: deviceW - 40,
    alignSelf: 'center',
    height: scaledHeightValue(48),
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: scaledHeightValue(40),
  },
  leftArrowStyle: insets => ({
    tintColor: 'white',
    height: scaledHeightValue(40),
    width: scaledValue(40),
    marginTop: insets.top + scaledHeightValue(13),
    marginLeft: scaledValue(24.06),
  }),
});
