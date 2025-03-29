import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {scaledValue} from '../../utils/design.utils';

const HeaderButton = ({icon, tintColor, onPress, style, iconStyle}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={style ? style : styles.headerButton}
      onPress={onPress}>
      <Image
        source={icon}
        tintColor={tintColor}
        style={[styles.headerIcon, iconStyle]}
      />
    </TouchableOpacity>
  );
};

export default HeaderButton;

const styles = StyleSheet.create({
  headerIcon: {
    width: scaledValue(28),
    height: scaledValue(28),
  },
  headerButton: {
    // marginHorizontal: scaledValue(20),
  },
});
