import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import GText from '../GText';
import { scaledValue } from '../../utils/design.utils';
import { colors } from '../../../assets/colors';
import { Images } from '../../utils';


const ContactOption = ({icon, title, onPress, titleStyle}) => {
  return (
    <TouchableOpacity style={styles.touchableStyle} onPress={onPress}>
      <Image source={icon} style={styles.iconStyle} />
      <GText GrMedium text={title} style={[styles.title, titleStyle]} />
    </TouchableOpacity>
  );
};

export default ContactOption;

const styles = StyleSheet.create({
  touchableStyle: {
    flexDirection: 'row',
    alignItems:'center',
    marginBottom:scaledValue(12),
  },
  iconStyle: {
    width: scaledValue(16),
    height: scaledValue(16),
    marginRight: scaledValue(6),
    resizeMode:'contain',
  },
  title: {
    fontSize: scaledValue(16),
    lineHeight: scaledValue(19.2),
    letterSpacing: scaledValue(16 * -0.02),
    color: colors.appRed,
  },
});
