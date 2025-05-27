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
  headerIconStyle: {width: scaledValue(40), height: scaledValue(40)},
  headerTitleStyle: {
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
    lineHeight: scaledHeightValue(22.8),
    color: colors.charcoal,
  },
  buttonText: {
    fontFamily: fonts.SUSE_MEDIUM,
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
  },
  buttonStyle: {
    marginTop: scaledValue(20),
    borderRadius: scaledValue(12),
    marginBottom: scaledHeightValue(10),
    height: scaledHeightValue(44),
  },
  careerCardTouchable: {
    height: scaledHeightValue(35),
    borderRadius: scaledValue(24),
    justifyContent: 'center',
    borderWidth: scaledValue(1),
    paddingHorizontal: scaledValue(12),
    borderColor: '#4B164C33',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledValue(5),
  },
  careerListView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: scaledValue(6),
    gap: scaledValue(7),
    marginTop: scaledValue(12),
    marginBottom: scaledValue(40),
  },
  skillText: {
    fontSize: scaledValue(16),
    letterSpacing: scaledValue(16 * -0.03),
    color: '#4B164C',
  },
  userProfileStyle: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').width - 40,
    marginTop: scaledValue(11),
    alignSelf: 'center',
  },
  dotsView: {
    marginTop: scaledValue(10),
    alignSelf: 'flex-end',
    right: scaledValue(12),
  },
  dotsImgStyle: {
    width: scaledValue(32),
    height: scaledValue(32),
  },
});
