import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../../../../assets/colors';
import {scaledHeightValue, scaledValue} from '../../../../utils/design.utils';
import fonts from '../../../../utils/fonts';
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
  upcomingMeetingText: {
    fontFamily: fonts.BE_VIETNAM_MEDIUM,
    fontSize: 19,
    lineHeight: scaledHeightValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    color: colors.black,
  },
  titleView: {
    marginTop: scaledValue(25),
    marginBottom: scaledValue(12),
    paddingHorizontal: scaledValue(20),
    marginLeft: scaledValue(12),
  },
});
