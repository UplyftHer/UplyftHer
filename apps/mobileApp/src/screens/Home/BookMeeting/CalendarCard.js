import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../../assets/colors';
import {scaledValue} from '../../../utils/design.utils';
import GText from '../../../components/GText';

const CalendarCard = props => {
  return (
    <LinearGradient
      colors={
        props?.selectedDateIndex
          ? ['#DA7575', '#A45EB0']
          : ['#FFF4EC', '#FFF4EC']
      }
      start={{x: 0.5, y: 1}}
      end={{x: 0.5, y: 0}}
      style={styles.calendarContainerGradient}>
      <TouchableOpacity
        disabled={props?.disabled}
        style={styles.calendarContainer}
        onPress={props?.onPress}>
        <GText
          beVietnamSemiBold
          text={props?.item?.day}
          style={styles.monthText(props?.selectedDateIndex)}
        />
        <GText
          medium
          text={props?.item?.date}
          style={styles.dateText(props?.selectedDateIndex)}
        />
        <GText
          medium
          text={props?.currentMonth}
          style={styles.dateText(props?.selectedDateIndex)}
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default CalendarCard;

const styles = StyleSheet.create({
  calendarContainerGradient: {
    borderRadius: scaledValue(8),
    // iOS Shadow
    shadowColor: colors.inputPlaceholder,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Android Shadow
    elevation: 10,
  },
  calendarContainer: {
    paddingHorizontal: scaledValue(8),
    paddingVertical: scaledValue(13.5),
    alignItems: 'center',
    width: scaledValue(64),
    borderRadius: scaledValue(8),
  },
  monthText: selectDate => ({
    fontSize: scaledValue(14),
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
    color: selectDate ? colors.offWhite : colors.charcoal,
    opacity: scaledValue(0.7),
    marginBottom: scaledValue(12),
  }),
  dateText: selectDate => ({
    fontSize: scaledValue(19),
    lineHeight: scaledValue(19),
    letterSpacing: scaledValue(14 * -0.03),
    color: selectDate ? colors.offWhite : colors.Gray,
    textAlign: 'center',
  }),
});
