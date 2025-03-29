import {getFontSize, scaledValue} from '../../../utils/design.utils';
import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../../../assets/colors';
import fonts from '../../../utils/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    width: Dimensions.get('window'),
    alignItems: 'center',
  },
  cardView: insets => ({
    backgroundColor: '#fff',
    paddingHorizontal: scaledValue(20),
    paddingTop: scaledValue(40),
    width: scaledValue(355),
    position: 'absolute',
    bottom: insets.bottom + scaledValue(10),
    borderRadius: scaledValue(32),
    paddingBottom: scaledValue(35),
    alignItems: 'center',
    alignSelf: 'center',
  }),
  titleText: {
    fontSize: getFontSize(32),
    lineHeight: getFontSize(40.32),
    fontFamily: fonts.SUSE_MEDIUM,
    color: colors.charcoal,
    marginBottom: scaledValue(23),
  },
  descriptions: {
    textAlign: 'center',
    fontSize: scaledValue(16),
    lineHeight: scaledValue(20.8),
    color: colors.Gray,
    marginBottom: scaledValue(34),
  },
  nextButtonText: buttonTitle => ({
    fontSize: getFontSize(19),
    lineHeight: getFontSize(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    fontFamily:
      buttonTitle == 'Get started' ? fonts.SUSE_SEMIBOLD : fonts.SUSE_MEDIUM,
    color: colors.white,
  }),
  nextButton: buttonColor => ({
    backgroundColor: buttonColor?.buttonColor,
    width: scaledValue(134),
    height: scaledValue(buttonColor?.height),
    borderRadius: scaledValue(12),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: scaledValue(buttonColor?.marginBottom),
  }),
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    width: scaledValue(22.86),
    height: scaledValue(10),
    borderRadius: scaledValue(8),
    marginHorizontal: scaledValue(7),
  },
});
