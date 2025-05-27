import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../../../assets/colors';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import fonts from '../../../utils/fonts';
const deviceW = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    paddingHorizontal: scaledValue(20),
  },
  arrow: {
    tintColor: colors.themeColor,
    height: scaledHeightValue(40),
    width: scaledValue(40),
    marginLeft: scaledValue(20),
  },
  forgotText: {
    fontSize: scaledValue(19),
    color: colors.black,
    letterSpacing: scaledValue(19 * -0.003),
    lineHeight: scaledHeightValue(22.8),
  },
  headerText: {
    fontSize: scaledValue(19),
    fontFamily: fonts.SUSE_MEDIUM,
  },
  upcomingMeetingText: {
    fontFamily: fonts.BE_VIETNAM_MEDIUM,
    fontSize: 19,
    lineHeight: scaledHeightValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    color: colors.black,
  },
  pastMeetingText: {
    fontFamily: fonts.BE_VIETNAM_MEDIUM,
    fontSize: scaledValue(19),
    lineHeight: scaledHeightValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    color: colors.black,
    marginBottom: scaledHeightValue(12),
  },
  noOfMeetings: {
    color: colors.themeColor,
  },
  contentView: {
    width: deviceW - 40,
    alignSelf: 'center',
  },
  flatlistMain: {
    color: 'red',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: '#FFFAFA',
    borderRadius: scaledValue(16),
    paddingHorizontal: scaledHeightValue(20),
    paddingBottom: scaledHeightValue(20),
    marginBottom: scaledHeightValue(12),
    shadowColor: '#47382726', // Shadow color
    shadowOffset: {width: 0, height: 2}, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
    elevation: 4, // Android shadow
  },
  pastMeetingsImage: {
    height: scaledValue(40),
    width: scaledValue(40),
    borderRadius: scaledValue(20),
    marginRight: scaledValue(8),
  },
  pastMeetingsName: {
    fontSize: 16,
    lineHeight: scaledHeightValue(19.2),
    letterSpacing: scaledValue(16 * -0.03),
    color: colors.black,
  },
  trashImage: {
    height: scaledValue(16),
    width: scaledValue(16),
  },
  flatlistTopView: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: scaledValue(20),
    justifyContent: 'space-between',
  },
  profileView: {
    flexDirection: 'row',
    width: '30%',
  },
  trashView: {
    // width: '70%',
    // alignItems: 'flex-end',
  },
  specialityText: {
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
    color: colors.charcoal,
    marginTop: scaledValue(12),
    marginBottom: scaledValue(16),
  },
  textStyle: {
    fontSize: scaledValue(12),
    lineHeight: scaledHeightValue(15.6),
    color: colors.charcoal,
  },
  iconStyle: {
    height: scaledValue(12),
    width: scaledValue(12),
    marginRight: scaledValue(5),
  },
  dayView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaledValue(10),
  },
  timeView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaledValue(10),
  },
  modeView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradientButton: {
    height: scaledHeightValue(48),
    borderRadius: scaledValue(12),
    marginBottom: scaledHeightValue(40),
  },
  textStyle: {
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
    paddingHorizontal: scaledValue(10),
    marginHorizontal: scaledValue(30),
  },
});
