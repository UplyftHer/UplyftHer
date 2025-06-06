import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {scaledValue} from '../../utils/design.utils';
import {colors} from '../../../assets/colors';
import fonts from '../../utils/fonts';

const GradientBorderButton = ({
  title,
  onPress,
  buttonTextStyle,
  buttonStyle,
  inner,
  imageSource,
  imgStyle,
  disabled,
  ...props
}) => {
  return (
    <LinearGradient
      colors={['#A45EB0', '#DA7575']}
      style={[styles.gradientBorder, buttonStyle]}>
      <TouchableOpacity
        disabled={disabled}
        style={[styles.button, inner]}
        onPress={onPress}
        {...props}>
        {imageSource && <Image source={imageSource} style={imgStyle} />}
        <Text style={[styles.buttonText, buttonTextStyle]}>{title}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBorder: {
    // width: scaledValue(107),
    height: scaledValue(40),
    borderRadius: scaledValue(12),
    // borderWidth: scaledValue(1),
  },

  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.offWhite,
    borderRadius: scaledValue(11),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledValue(4),
    margin: scaledValue(1.2),
  },
  buttonText: {
    fontSize: scaledValue(14),
    color: colors.charcoal,
    fontFamily: fonts.BE_VIETNAM_SEMIBOLD,
    lineHeight: Platform.OS == 'android' ? scaledValue(18.2) : null,
  },
});

export default GradientBorderButton;
