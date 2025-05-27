import {StyleSheet} from 'react-native';
import {scaledValue} from '../../../utils/design.utils';
import {colors} from '../../../../assets/colors';

export const styles = StyleSheet.create({
  headerContainer: (statusBarHeight, insets) => ({
    height: scaledValue(136),
    borderBottomLeftRadius: scaledValue(35),
    borderBottomRightRadius: scaledValue(35),
    paddingHorizontal: scaledValue(20),
    paddingTop: insets,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }),

  calendarButton: {
    width: scaledValue(36),
    height: scaledValue(36),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaledValue(50),
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: scaledValue(48),
    height: scaledValue(48),
    borderRadius: scaledValue(25),
    borderWidth: scaledValue(4),
    borderColor: '#E2B0BC',
  },
  profileName: {
    color: '#fff',
    fontSize: scaledValue(16),
    lineHeight: scaledValue(19.2),
    letterSpacing: scaledValue(16 * -0.03),
  },
  headerLeftArrowImage: {width: scaledValue(40), height: scaledValue(40)},
  calendarImage: {width: scaledValue(16), height: scaledValue(16.2)},
  mentorCalenderImage: {width: scaledValue(20), height: scaledValue(20)},
  chatContainer: {
    flex: 1,
    marginHorizontal: scaledValue(20),
    marginTop: scaledValue(),
  },
  dayText: {
    color: '#FFFAFA',
    textAlign: 'center',
    fontSize: scaledValue(14),
    lineHeight: scaledValue(18.2),
  },
  dayTextView: {
    alignSelf: 'center',
    marginBottom: scaledValue(20),
    backgroundColor: colors.themeColor,
    paddingHorizontal: scaledValue(10),
    borderRadius: scaledValue(16),
    paddingVertical: scaledValue(6),
    position: 'absolute',
    zIndex: 1,
  },
  input: inputMessage => ({
    width: scaledValue(293),
    backgroundColor: colors.pinkishWhite,
    marginRight: scaledValue(10),
    borderRadius: scaledValue(28),
    paddingHorizontal: scaledValue(25),
    opacity: 0.8,
    // minHeight: scaledValue(48),
    textAlignVertical: 'top', // Ensures consistency
    paddingTop: scaledValue(14), // Adjusts vertical centering
    paddingBottom: scaledValue(14), // Balances padding
    maxHeight: scaledValue(100),
    height: Math.max(48, inputMessage.split('\n').length * 24),
  }),
  inputContainer: insets => ({
    backgroundColor: colors.creamyTan,
    marginBottom: scaledValue(5),
    paddingHorizontal: scaledValue(20),
    paddingTop: scaledValue(12),
    paddingBottom: scaledValue(21),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
});
