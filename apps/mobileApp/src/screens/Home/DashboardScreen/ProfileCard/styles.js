import {StyleSheet} from 'react-native';
import {scaledValue} from '../../../../utils/design.utils';
import {colors} from '../../../../../assets/colors';
import fonts from '../../../../utils/fonts';

export const styles = StyleSheet.create({
  linearGradientBg: {
    paddingHorizontal: scaledValue(20),
    paddingVertical: scaledValue(20),
    shadowColor: '#B235C64D', // Shadow color
    shadowOffset: {width: 0, height: 20}, // Shadow offset
    shadowOpacity: 0.5, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
    elevation: 4, // Android shadow
  },
  gradientContainer: {
    borderRadius: scaledValue(16),
    overflow: 'hidden',
    borderWidth: scaledValue(1.5),
    borderColor: colors.lightLavender,
    // marginBottom: scaledValue(72),
    marginHorizontal: scaledValue(20),
  },
  profileMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileView: {flexDirection: 'row', alignItems: 'center'},
  userImage: {
    width: scaledValue(40),
    height: scaledValue(40),
    borderRadius: scaledValue(100),
  },
  userName: {
    fontSize: scaledValue(16),
    lineHeight: scaledValue(19.2),
    color: colors.offWhite,
    letterSpacing: scaledValue(16 * -0.03),
  },
  menuIcon: {
    width: scaledValue(16),
    height: scaledValue(16),
  },
  contentStyle: {
    fontSize: scaledValue(19),
    lineHeight: scaledValue(22.8),
    color: colors.offWhite,
    letterSpacing: scaledValue(19 * -0.03),
    marginBottom: scaledValue(12),
    marginTop: scaledValue(8),
  },
  dateView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaledValue(6),
  },
  bottomIcon: {
    width: scaledValue(12),
    height: scaledValue(12),
    marginRight: scaledValue(4),
  },
  bottomContent: {
    fontSize: scaledValue(12),
    lineHeight: scaledValue(15.6),
    color: colors.offWhite,
    alignSelf: 'center',
    fontFamily: fonts.BE_VIETNAM_BOLD,
  },
  timeView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaledValue(6),
  },
  buttonStyle: {
    alignItems: 'center',
    borderWidth: scaledValue(1),
    borderColor: colors.offWhite,
    borderRadius: scaledValue(10),
    marginTop: scaledValue(10),
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: scaledValue(10),
    gap: scaledValue(4),
  },
  iconStyle: {width: scaledValue(20), height: scaledValue(20)},
  buttonTextStyle: {
    color: colors.offWhite,
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
  },
  userDetailStyle: {
    marginRight: scaledValue(8),
    width: scaledValue(50),
    height: scaledValue(50),
    borderRadius: scaledValue(100),
    backgroundColor: '#FFF4EC80',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
