import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../../../assets/colors';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import fonts from '../../../utils/fonts';
const deviceW = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.offWhite,
  },

  headerText: {
    fontSize: scaledValue(19),
    lineHeight: scaledValue(22.8),
  },

  headerLeftArrowImage: {
    width: scaledValue(40),
    height: scaledValue(40),
  },

  titleText: {
    marginLeft: scaledValue(20),
    fontSize: scaledValue(16),
    letterSpacing: scaledValue(16 * -0.03),
    marginBottom: scaledValue(16),
  },
  maplistContainer: {
    height: scaledValue(),
  },
  modeText: {
    fontSize: 16,
    color: 'red',
  },

  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaledValue(20),
    marginBottom: scaledHeightValue(40),
  },

  buttonStyle: {
    padding: scaledValue(1),
    borderRadius: scaledValue(12),
  },
  buttonTextStyle: {
    color: colors.black,
    fontSize: scaledValue(14),
    letterSpacing: scaledValue(14 * -0.02),
    fontFamily: fonts.BE_VIETNAM_REGULAR,
    paddingHorizontal: scaledValue(10),
    paddingVertical: scaledValue(15),
  },
  innerButton: {
    backgroundColor: colors.offWhite,
    borderRadius: scaledValue(11),
  },
  sliderView: {
    width: scaledValue(189),
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: scaledValue(16),
  },
  circleArrow: {
    height: scaledValue(24),
    width: scaledValue(25),
  },
  sliderText: {
    fontSize: scaledValue(16),
    letterSpacing: scaledValue(16 * -0.03),
    color: colors.themeColor,
  },
  timingText: {
    fontSize: scaledValue(14),
    fontFamily: fonts.BE_VIETNAM_SEMIBOLD,
    letterSpacing: scaledValue(14 * -0.02),
    color: colors.Gray,
  },
  gradient: {
    height: scaledHeightValue(40),
    width: scaledValue(79),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaledValue(12),
  },
  timingTextGradient: {
    color: colors.offWhite,
    fontSize: scaledValue(14),
    fontFamily: fonts.BE_VIETNAM_SEMIBOLD,
    letterSpacing: scaledValue(14 * -0.02),
  },
  whiteBackgroundView: {
    height: scaledHeightValue(40),
    width: scaledValue(79),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaledValue(12),
    backgroundColor: colors.offWhite,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
  },
  textInput: {
    borderRadius: scaledValue(12),
    borderColor: colors.themeColor,
    height: scaledValue(122),
    width: deviceW - scaledValue(40),
    backgroundColor: 'transparent',
    fontSize: scaledValue(14),
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(18 * -0.02),
    marginHorizontal: scaledValue(20),
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

  calendarContainer: {
    padding: 16,
    backgroundColor: '#fdf1e8',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#403A3E',
  },
  navigationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: 10,
  },
  navText: {
    fontSize: 24,
    color: '#C2A5B3',
  },
  flatList: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  dateItem: {
    backgroundColor: '#f0e8e0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedDateItem: {
    backgroundColor: '#D774B1',
  },
  dayText: {
    fontSize: 14,
    color: '#666666',
  },
  selectedDayText: {
    color: '#ffffff',
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666666',
  },
  selectedDateText: {
    color: '#ffffff',
  },
  monthText: {
    fontSize: 14,
    color: '#666666',
  },
  selectedMonthText: {
    color: '#ffffff',
  },
  dateContentContainer: {
    gap: 8,
    paddingLeft: scaledValue(20),
    paddingBottom: scaledHeightValue(40),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
  },
  timeContentContainer: {
    gap: scaledValue(8),
    marginBottom: scaledHeightValue(16),
    paddingHorizontal: scaledValue(20),
  },
  wordCountText: {
    marginHorizontal: scaledValue(20),
    alignItems: 'flex-end',
    marginBottom: scaledValue(40),
  },
  gradientStyle: {
    height: scaledHeightValue(48),
    width: '100%',
    alignSelf: 'center',
  },

  textStyle: {
    fontSize: scaledValue(19),
    fontFamily: fonts.SUSE_MEDIUM,
    lineHeight: scaledValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
  },
});
