import {Dimensions, StyleSheet} from 'react-native';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {colors} from '../../../../assets/colors';
import {Colors} from 'react-native/Libraries/NewAppScreen';
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
  contentView: {
    width: deviceW - 40,
    alignSelf: 'center',
  },
  newMatchesLabel: {
    letterSpacing: scaledValue(16 * -0.02),
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(20.8),
  },
  setAvailabilityText: {
    color: colors.grayishBlue,
    lineHeight: scaledHeightValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
    fontSize: scaledValue(14),
    marginTop: scaledHeightValue(8),
  },
  availabilityWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scaledHeightValue(53),
  },
  preferencesHeader: {
    marginTop: scaledHeightValue(48),
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(20.8),
    letterSpacing: scaledValue(16 * -0.02),
    marginBottom: scaledHeightValue(16),
  },
  preferenceText: {
    fontSize: scaledValue(16),
    color: colors.charcoal,
    fontFamily: fonts.BE_VIETNAM_SEMIBOLD,
    letterSpacing: scaledValue(16 * -0.02),
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  availabilityText: {
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(20.8),
    letterSpacing: scaledValue(16 * -0.02),
  },
  availabilityMinText: {
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(20.8),
    letterSpacing: scaledValue(16 * -0.02),
    color: '#A6A6A6',
  },
  setByText: {
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(19.2),
    letterSpacing: scaledValue(16 * -0.03),
    color: colors.Gray,
    marginTop: scaledValue(28),
  },
  gradientUpdateStyle: {
    height: scaledValue(48),
    marginBottom: scaledValue(50),
  },
  gradientStyle: {
    height: scaledValue(40),
  },
  weekText: {
    fontSize: scaledValue(19),
    lineHeight: scaledHeightValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    color: colors.themeColor,
    marginLeft: scaledValue(6),
  },
  slotText: {
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(20.8),
    letterSpacing: scaledValue(16 * -0.02),
    color: colors.themeColor,
    marginLeft: scaledValue(6),
  },
  threeDotText: {
    fontSize: scaledValue(18),
    lineHeight: scaledHeightValue(21.6),
    letterSpacing: scaledValue(18 * -0.02),
    color: '#312943',
  },
  timeText: (selectId, id) => ({
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(20.8),
    letterSpacing: scaledValue(16 * -0.02),
    color: selectId === id ? colors.themeColor : colors.charcoal,
    fontFamily:
      selectId === id ? fonts?.BE_VIETNAM_SEMIBOLD : fonts?.BE_VIETNAM_REGULAR,
  }),
  availabilityView: {
    flexDirection: 'row',
    marginTop: scaledHeightValue(48),
    alignItems: 'center',
  },
  filterView: {
    flexDirection: 'row',
    marginTop: scaledHeightValue(16),
    gap: scaledValue(8),
  },
  weekArrayView: {
    marginTop: scaledValue(20),
    gap: scaledValue(24),
    marginBottom: scaledHeightValue(117),
  },
  tileView: {
    borderWidth: scaledValue(0.5),
    borderColor: '#C3C3C3',
    borderRadius: scaledValue(16),
    paddingHorizontal: scaledValue(12),
    paddingBottom: scaledHeightValue(16),
    backgroundColor: '#FFF8F4',
  },
  upperInnerView: {marginTop: scaledValue(18)},
  weekTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkWeekTitleView: {
    flexDirection: 'row',
  },
  hitSlop: {top: 20, bottom: 20, left: 50, right: 50},
  checkImg: {
    width: scaledValue(20.4),
    height: scaledHeightValue(20),
  },
  slotView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slotMainView: {
    flexDirection: 'row',
    marginTop: scaledHeightValue(20),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scaledValue(26),
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledValue(5),
  },
  inputStyle: {
    borderWidth: scaledValue(0.5),
    width: scaledValue(40),
    borderRadius: scaledValue(4),
    borderColor: '#7E7E7E',
    textAlign: 'center',
    color: colors.charcoal,
    fontFamily: fonts?.BE_VIETNAM_SEMIBOLD,
    fontSize: scaledValue(16),
    // lineHeight: scaledHeightValue(20.8),
    paddingVertical: scaledValue(5),
  },
  timeFormatView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledValue(5),
    marginLeft: scaledValue(12),
  },
  trashView: {marginRight: scaledValue(4)},
  trashImg: {
    width: scaledValue(24),
    height: scaledHeightValue(24),
  },
  preferenceView: {gap: scaledValue(20)},
  buttonStyle: {width: scaledValue(80)},
  touchableButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#A45EB0',
    height: scaledValue(44),
    marginBottom: scaledHeightValue(28),
    borderRadius: scaledValue(12),
    justifyContent: 'center',
    gap: scaledValue(8),
  },
  addButtonText: {
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
    color: colors.themeColor,
  },
  buttonText: {
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
    color: colors.themeColor,
  },
  dateButtonText: {
    fontSize: scaledValue(14),
    letterSpacing: scaledValue(14 * -0.02),
    marginHorizontal: scaledValue(24),
    // color: colors.themeColor,
  },
  dateTile: {
    borderWidth: scaledValue(0.5),
    borderColor: '#C3C3C3',
    borderRadius: scaledValue(16),
    backgroundColor: '#FFF8F4',
    paddingBottom: scaledValue(20),
  },
  dateInnerTileView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scaledValue(20),
    paddingHorizontal: scaledValue(16),
  },
  dayText: {
    fontSize: scaledValue(12),
    color: '#656565',
    lineHeight: scaledHeightValue(15.6),
    opacity: 0.7,
  },
  currentDayText: {
    fontSize: scaledValue(19),
    color: colors.themeColor,
    lineHeight: scaledHeightValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    marginTop: scaledHeightValue(5),
  },
  datePickerView: {
    backgroundColor: '#966B9D29',
    paddingVertical: scaledHeightValue(11.5),
    paddingHorizontal: scaledValue(11),
    borderRadius: scaledValue(6),
  },
  currentDateText: {
    fontSize: scaledValue(16),
    color: colors.themeColor,
    lineHeight: scaledHeightValue(20.8),
    letterSpacing: scaledValue(16 * -0.02),
  },
  radioImg: {
    width: scaledValue(16),
    height: scaledValue(16),
  },
});
