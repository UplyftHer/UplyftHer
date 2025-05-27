import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {scaledValue} from '../../../utils/design.utils';
import GText from '../../../components/GText';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../../assets/colors';

const TimeButton = props => {
  const gradientColors = ['#DA7575', '#A45EB0'];
  return (
    <TouchableOpacity
      disabled={
        props?.meetingData?.slot === props?.item?.slotname
          ? false
          : props?.item?.isBooked === '1'
      }
      activeOpacity={0.5}
      style={styles.buttonTouchableView}
      onPress={props.onPress}>
      <LinearGradient
        colors={props.linearColor ? props.linearColor : gradientColors}
        start={{x: 0.5, y: 1}}
        end={{x: 0.5, y: 0}}
        style={[
          styles.timeContainerGradient,
          {
            opacity:
              props?.meetingData?.slot === props?.item?.slotname
                ? 1
                : props?.item?.isBooked === '1'
                ? 0.4
                : 1,
          },
        ]}>
        <View style={styles.timeContainer}>
          <GText
            beVietnamSemiBold
            text={props?.item?.slotname}
            style={[styles.timeText, props?.textStyle]}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default TimeButton;

const styles = StyleSheet.create({
  buttonTouchableView: {
    elevation: 10,
    shadowColor: colors.inputPlaceholder,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    backgroundColor: colors.offWhite,
    shadowRadius: scaledValue(8),
    borderRadius: scaledValue(8),
  },
  timeContainerGradient: {
    borderRadius: scaledValue(8),
  },
  timeContainer: {
    paddingHorizontal: scaledValue(13),
    paddingVertical: scaledValue(12),
    alignItems: 'center',
    borderRadius: scaledValue(8),
  },
  timeText: {
    color: colors.offWhite,
    fontSize: scaledValue(14),
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
  },
});
