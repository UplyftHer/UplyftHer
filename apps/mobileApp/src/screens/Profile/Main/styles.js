import {Dimensions, StyleSheet} from 'react-native';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {colors} from '../../../../assets/colors';
import fonts from '../../../utils/fonts';

export const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: colors.offWhite,
    flex: 1,
  },
  imageBackground: {
    width: '100%',
    height: scaledValue(167),
  },
  profileImageWrapper: {
    position: 'absolute',
    bottom: scaledValue(-15),
    alignSelf: 'center',
    width: scaledValue(80),
    backgroundColor: '#FFF4EC80',
    alignItems: 'center',
    height: scaledValue(80),
    justifyContent: 'center',
    borderRadius: scaledValue(40),
  },
  profileImage: {
    width: scaledValue(70),
    height: scaledValue(70),
    borderRadius: scaledValue(35),
  },
  profileName: {
    textAlign: 'center',
    marginTop: scaledValue(15),
    fontSize: scaledValue(23),
    lineHeight: scaledHeightValue(27.6),
    letterSpacing: scaledValue(23 * -0.03),
    color: colors.charcoal,
  },
  profileEmail: {
    textAlign: 'center',
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(20.8),
    color: '#7E7E7E',
    letterSpacing: scaledValue(16 * -0.02),
  },
  editProfileText: {
    fontSize: scaledValue(19),
    lineHeight: scaledHeightValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    fontFamily: fonts.SUSE_MEDIUM,
    marginHorizontal: scaledValue(24),
  },
  editProfileButton: {
    marginTop: scaledValue(20),
    height: scaledValue(40),
    alignSelf: 'center',
  },
  optionsList: {
    marginHorizontal: scaledValue(20),
    marginTop: scaledHeightValue(38),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scaledValue(10),
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: scaledValue(20),
    height: scaledHeightValue(20),
    // tintColor: colors.themeColor,
  },
  optionText: {
    marginLeft: scaledValue(10),
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(20.8),
    letterSpacing: scaledValue(16 * -0.02),
    color: '#656565',
  },
  arrowIcon: {
    width: scaledValue(20),
    height: scaledHeightValue(20),
  },
  divider: {
    marginVertical: scaledValue(8),
    height: scaledHeightValue(1),
    backgroundColor: '#aaa',
  },
  logoutButton: {
    marginTop: scaledValue(30),
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: scaledValue(30),
    height: scaledValue(26),
  },
  logoutIcon: {
    width: scaledValue(20),
    height: scaledValue(20),
  },
  logoutText: {
    marginLeft: scaledValue(10),
    fontSize: scaledValue(16),
    lineHeight: scaledHeightValue(20.8),
    letterSpacing: scaledValue(16 * -0.02),
    color: '#3E3E3E',
  },
});
