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
    backgroundColor: colors.offWhite,
  },
  headerIconStyle: {width: scaledValue(40), height: scaledValue(40)},
  headerTitleStyle: {
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
    lineHeight: scaledHeightValue(22.8),
    color: colors.charcoal,
  },

  headerText: {
    fontSize: scaledValue(23),
    alignSelf: 'center',
    lineHeight: scaledHeightValue(27.6),
    letterSpacing: scaledValue(23 * -0.03),
    marginTop: scaledHeightValue(51),
    marginBottom: scaledHeightValue(16),
  },
  subHeaderText: {
    fontSize: scaledValue(16),
    letterSpacing: scaledValue(16 * -0.02),
    lineHeight: scaledHeightValue(20.8),
  },
  optionsHeading: {
    fontSize: getFontSize(19),

    lineHeight: scaledHeightValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    marginBottom: scaledHeightValue(20),
  },
  contentContainer: {
    width: deviceW - 40,
    alignSelf: 'center',
    flex: 1,
  },
  submitRequestView: (index, submitRequestList) => ({
    flexDirection: 'row',
    marginBottom: index == submitRequestList.length - 1 ? 0 : scaledValue(16),
    gap: scaledValue(8),
    // backgroundColor: 'red',
    width: '92%',
  }),
  submitRequestItemName: (selectedSubmitRequest, item) => ({
    color: selectedSubmitRequest ? colors.themeColor : colors.black,
    fontSize: getFontSize(16),
    lineHeight: scaledValue(16),
    fontFamily: selectedSubmitRequest
      ? fonts.BE_VIETNAM_SEMIBOLD
      : fonts.BE_VIETNAM_REGULAR,
  }),
  radioButton: {
    width: scaledValue(16),
    height: scaledValue(16),
    resizeMode: 'contain',
  },
  iconRightStyle: {
    height: scaledValue(20),
    width: scaledValue(20),
    tintColor: colors.black,
  },
  submittingRequestToText: {
    fontSize: scaledValue(19),

    lineHeight: scaledHeightValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    marginBottom: scaledHeightValue(20),
  },
  textInputStyle: {
    borderWidth: scaledValue(0.5),
    height: scaledValue(114),
    marginTop: scaledValue(20),
    borderRadius: scaledValue(16),
    borderColor: '#312943',
    paddingHorizontal: scaledValue(18),
    paddingTop: scaledValue(12),
    textAlignVertical: 'top',
    fontSize: scaledValue(16),
    color: colors.darkPurple,
  },
  gradientButtonText: {
    fontSize: scaledValue(19),
    fontFamily: fonts.SUSE_MEDIUM,
    letterSpacing: scaledValue(19 * -0.03),
    lineHeight: scaledHeightValue(22.8),
    paddingVertical: scaledHeightValue(17.5),
  },
  gradientButton: {
    marginTop: scaledHeightValue(64),
    marginBottom: scaledValue(40),
  },
  checkButton: {
    width: scaledValue(20),
    height: scaledValue(20),
    resizeMode: 'contain',
  },
});
