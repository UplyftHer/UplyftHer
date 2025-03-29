import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../../../assets/colors';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
const deviceW = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  contentContainer: {
    width: deviceW - 40,
    alignSelf: 'center',
  },
  headerIconStyle: {width: scaledValue(40), height: scaledValue(40)},
  headerTitleStyle: {
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
    lineHeight: scaledHeightValue(22.8),
    color: colors.charcoal,
  },
  cardContainer: index => ({
    width: scaledValue(160),
    height: scaledValue(120),
    alignItems: 'center',
    borderRadius: scaledValue(16),
    marginRight: index % 2 !== 0 ? scaledValue(0) : 16,
  }),
  gradient: {
    position: 'absolute',
    height: '50%',
    width: '100%',
    borderBottomLeftRadius: scaledValue(16),
    borderBottomRightRadius: scaledValue(16),
    bottom: 0,
    alignItems: 'center',
    overflow: 'hidden',
  },
  userImage: {
    borderRadius: scaledValue(16),
    width: scaledValue(160),
    height: scaledValue(120),
  },
  userDetailsView: {
    alignItems: 'center',
    position: 'absolute',
    bottom: scaledValue(13),
  },
  userName: {
    fontSize: scaledValue(14),
    color: colors.white,
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
  },
  age: {
    fontSize: scaledValue(14),
    color: colors.white,
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
  },
  userLocation: {
    fontSize: scaledValue(12),
    color: colors.white,
    textTransform: 'uppercase',
    lineHeight: scaledValue(15.6),
    opacity: scaledValue(0.5),
  },
  labelView: {
    position: 'absolute',
    bottom: 0,
    paddingVertical: scaledValue(4),
    borderTopRightRadius: scaledValue(8),
    borderTopLeftRadius: scaledValue(8),
    width: scaledValue(80),
    alignItems: 'center',
  },
  labelText: {
    fontSize: scaledValue(11),
    lineHeight: scaledValue(14.3),
    color: colors.white,
  },
  circularView: {
    height: scaledValue(27.6),
    width: scaledValue(27.6),
    borderRadius: scaledValue(50),
    backgroundColor: colors.themeColor,
    position: 'absolute',
    top: scaledValue(8),
    right: scaledValue(7.4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saved: {
    height: scaledValue(13.8),
    width: scaledValue(13.8),
  },
  emptyPlaceHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Dimensions.get('window').height / 4,
  },
});
