import {Dimensions, StyleSheet} from 'react-native';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {colors} from '../../../../assets/colors';
import fonts from '../../../utils/fonts';

export const styles = StyleSheet.create({
  headerIconStyle: {width: scaledValue(40), height: scaledValue(40)},
  headerTitleStyle: {
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
    lineHeight: scaledHeightValue(22.8),
    color: colors.charcoal,
  },
  renderView: {
    // marginBottom: scaledValue(24),
  },
  textInputIcon: {width: scaledValue(20), height: scaledValue(20)},
  inputStyle: isBio => ({
    borderRadius: scaledValue(12),
    borderColor: colors.themeColor,
    height: scaledValue(isBio ? 166 : 48), // Specific height for bio
    backgroundColor: 'transparent',
    fontSize: scaledValue(16),
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(18 * -0.02),
    width: '100%',
    color: '#3E3E3E',
    fontFamily: fonts.BE_VIETNAM_REGULAR,
  }),
  wordCountText: {
    marginTop: scaledValue(8), // Space between input and word count
    alignItems: 'flex-end', // Align word count text to the right
  },
  countingText: {
    fontSize: scaledValue(12),
    color: colors.charcoal,
  },
  labelStyle: isBio => ({
    flexWrap: 'wrap',
    textAlign: isBio ? 'left' : 'center',
    fontFamily: fonts.BE_VIETNAM_BOLD,
  }),
  labelTextStyle: isFocused => ({
    color: isFocused ? '#7E7E7E' : '#383838',
    fontFamily: isFocused ? fonts?.BE_VIETNAM_BOLD : fonts?.BE_VIETNAM_REGULAR,
    fontSize: scaledValue(14),
    letterSpacing: scaledValue(14 * -0.03),
  }),
  interestsView: {
    borderRadius: scaledValue(8),
    borderWidth: scaledValue(1),
    borderColor: colors.themeColor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaledValue(12),
  },
  interestsTextStyle: {
    fontSize: scaledValue(16),
    fontFamily: fonts.SUSE_MEDIUM,
    color: colors.themeColor,
    lineHeight: scaledValue(19.2),
    letterSpacing: scaledValue(16 * -0.03),
    paddingVertical: scaledValue(8),
  },
  crossIconStyle: {
    resizeMode: 'contain',
    height: scaledValue(20),
    width: scaledValue(20),
    marginLeft: scaledValue(4),
  },
  scrollView: {flexGrow: 1, backgroundColor: '#FFF4EC'},
  userImgStyle: {
    width: scaledValue(80),
    height: scaledValue(80),
    borderRadius: scaledValue(40),
  },
  cameraPickerViewStyle: {
    backgroundColor: '#FFF4EC',
    width: scaledValue(32),
    height: scaledValue(32),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaledValue(16),
    position: 'absolute',
    bottom: scaledValue(-5),
    alignSelf: 'flex-end',
    shadowColor: '#000', // Shadow color
    shadowOffset: {width: 0, height: 2}, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
    elevation: 4, // Android shadow
  },
  cameraIconStyle: {
    width: scaledValue(14.86),
    height: scaledValue(13.14),
  },
  inputViewStyle: {
    marginHorizontal: scaledValue(20),
    marginTop: scaledValue(40),
    gap: scaledValue(24),
  },
  interestsTitleStyle: {
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(20.8),
    letterSpacing: scaledValue(16 * -0.03),
    color: '#3E3E3E',
    marginBottom: scaledValue(20),
    marginLeft: scaledValue(20),
  },
  interestMainView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: scaledValue(20),
    columnGap: scaledValue(8),
    gap: scaledValue(16),
  },
  buttonView: {
    marginTop: scaledValue(58),
    marginHorizontal: scaledValue(20),
    marginBottom: scaledValue(43),
  },
  gradientButtonStyle: {height: scaledValue(48)},
  gradientTitleStyle: {
    fontSize: scaledValue(19),
    lineHeight: scaledHeightValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    color: '#FFFFFF',
    fontFamily: fonts?.SUSE_MEDIUM,
  },
  rightIcon: {
    resizeMode: 'contain',
    height: scaledHeightValue(20),
    width: scaledValue(20),
    tintColor: colors.black,
  },
  organizationButton: {
    height: scaledValue(48),
    borderWidth: scaledValue(0.75),
    borderColor: '#312943',
    borderRadius: scaledValue(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaledValue(16),
    top: scaledValue(24),
  },
  organizationText: {
    color: '#3E3E3E',
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(20.8),
    letterSpacing: scaledValue(16 * -0.02),
  },
  labelStyling: (isFocused, fields) => ({
    color: isFocused || fields?.name !== '' ? colors.themeColor : colors.Gray,
    fontFamily:
      isFocused || fields?.name !== ''
        ? fonts.BE_VIETNAM_BOLD
        : fonts.BE_VIETNAM_REGULAR,
    fontSize: scaledValue(14),
    letterSpacing: scaledValue(14 * -0.02),
  }),
  rightIcon: {
    resizeMode: 'contain',
    height: scaledHeightValue(20),
    width: scaledValue(20),
    tintColor: colors.themeColor,
  },
});
