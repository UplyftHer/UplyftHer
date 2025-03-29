import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import GText from '../../../components/GText';
import {scaledValue} from '../../../utils/design.utils';
import fonts from '../../../utils/fonts';
import {colors} from '../../../../assets/colors';

const DashboardTitle = props => {
  return (
    <View style={[styles.yourInterestsTitleView, props?.style]}>
      <GText text={props?.title} style={styles.screenTitles} />
      {props.rightText && (
        <TouchableOpacity onPress={props.onPress}>
          <GText
            beVietnamSemiBold
            text={props.rightText}
            style={styles.rightText}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DashboardTitle;

const styles = StyleSheet.create({
  yourInterestsTitleView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scaledValue(20),
    marginBottom: scaledValue(15),
  },
  screenTitles: {
    fontSize: scaledValue(19),
    lineHeight: scaledValue(22.8),
    letterSpacing: scaledValue(19 * -0.03),
    fontFamily: fonts.SUSE_MEDIUM,
    color: colors.charcoal,
  },
  rightText: {
    fontSize: scaledValue(14),
    color: colors.themeColor,
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
  },
});
