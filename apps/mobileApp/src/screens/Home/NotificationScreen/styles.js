import {Dimensions, StyleSheet} from 'react-native';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {colors} from '../../../../assets/colors';
import fonts from '../../../utils/fonts';
const deviceW = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: (statusBarHeight, insets) => ({
    borderBottomLeftRadius: scaledValue(35),
    borderBottomRightRadius: scaledValue(35),
    paddingHorizontal: scaledValue(20),

    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaledValue(24),
  }),

  headerLeftArrowImage: {width: scaledValue(40), height: scaledValue(40)},
  contentContainer: {
    width: deviceW - 40,
    alignSelf: 'center',
  },
  Header: {
    fontSize: scaledValue(14),
    lineHeight: scaledValue(18.2),
    letterSpacing: 14 * -0.02,
    color: colors.charcoal,
  },
  ProfilePic: {
    height: scaledValue(40),
    width: scaledValue(40),
    borderRadius: scaledValue(50),
  },
  Content: {
    fontFamily: fonts.BE_VIETNAM_REGULAR,
    fontSize: scaledValue(14),
    lineHeight: scaledHeightValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
    color: colors.black,
    marginBottom: scaledValue(8),
    width: deviceW - 90,
    // backgroundColor: 'red',
  },
  Timing: {
    fontSize: scaledValue(12),
    color: colors.charcoal,
    fontFamily: fonts.BE_VIETNAM_MEDIUM,
    lineHeight: scaledHeightValue(15.6),
  },
  newFlatlist: {
    marginTop: scaledHeightValue(8),
    flexDirection: 'row',
    padding: scaledValue(8),
  },
  ImageView: {
    paddingRight: scaledValue(8),
  },
  lineView: {
    width: deviceW - 40,
    alignSelf: 'center',
    height: scaledValue(0.5),
    backgroundColor: '#C3C3C3',
    // marginBottom: scaledValue(16),
    marginVertical: scaledValue(16),
  },

  lastWeekFlatlist: {
    marginTop: scaledHeightValue(8),
    flexDirection: 'row',
    padding: scaledValue(8),
  },
  earlierFlatlist: {
    marginTop: scaledHeightValue(8),
    flexDirection: 'row',
    padding: scaledValue(8),
  },
  mainHeader: {
    color: colors.offWhite,
    fontSize: scaledValue(19),
    lineHeight: scaledHeightValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    marginLeft: scaledValue(76),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: scaledValue(18),
    paddingHorizontal: scaledValue(20),
  },
  emptyPlaceHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: scaledValue(15),
    gap: scaledValue(10),
  },
  innerStyle: {
    backgroundColor: '#FFF4EC',
    paddingHorizontal: scaledValue(15),
  },
  buttonTextStyle: {
    lineHeight: scaledHeightValue(19),
  },
  buttonStyle: {
    height: scaledValue(30),
  },
});
