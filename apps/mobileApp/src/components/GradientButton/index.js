import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '../../utils/fonts';
import {colors} from '../../../assets/colors';
import {scaledValue} from '../../utils/design.utils';

const GradientButton = ({
  title,
  onPress,
  style,
  imageSource,
  imagestyle,
  gradientstyle,
  textstyle,
  disabled,
  gradientColor,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.button, style]}
      disabled={disabled}>
      <LinearGradient
        colors={
          disabled
            ? [colors.inputPlaceholder, colors.inputPlaceholder]
            : gradientColor
            ? gradientColor
            : ['#DA7575', '#A45EB0']
        }
        start={{x: 0.5, y: 1}}
        end={{x: 0.5, y: 0}}
        style={[
          {
            flexDirection: 'row',
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            gap: scaledValue(10),
          },
          gradientstyle,
        ]}>
        {imageSource && <Image source={imageSource} style={imagestyle} />}
        <Text
          style={[
            textstyle,
            {fontFamily: fonts.SUSE_MEDIUM, color: colors.white},
          ]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default GradientButton;
