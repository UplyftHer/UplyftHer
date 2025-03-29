import React from 'react';
import {Text} from 'react-native';
import fonts from '../../utils/fonts';

const GText = props => {
  const {text, style, componentProps} = props;
  return (
    <Text
      {...componentProps}
      style={[
        {
          fontSize: fontSize(props),
          color: color(props),
          fontFamily: fontFamily(props),
        },
        style,
      ]}>
      {text}
    </Text>
  );
};

const fontSize = props => {
  if (props.g1) {
    return 17;
  } else if (props.g2) {
    return 15;
  } else if (props.g3) {
    return 13;
  } else if (props.g4) {
    return 11;
  }
  return 15;
};

const fontFamily = props => {
  if (props.bold) {
    return fonts.SUSE_BOLD;
  }
  if (props.light) {
    return fonts.SUSE_LIGHT;
  }
  if (props.medium) {
    return fonts.SUSE_MEDIUM;
  }
  if (props.semiBold) {
    return fonts.SUSE_SEMIBOLD;
  }
  if (props.extraBold) {
    return fonts.SUSE_EXTRABOLD;
  }
  if (props.satoshiRegular) {
    return fonts.SATOSHI_REGULAR;
  }
  if (props.satoshiMedium) {
    return fonts.SATOSHI_MEDIUM;
  }
  if (props.satoshiBold) {
    return fonts.SATOSHI_BOLD;
  }
  if (props.beVietnamRegular) {
    return fonts.BE_VIETNAM_REGULAR;
  }
  if (props.beVietnamMedium) {
    return fonts.BE_VIETNAM_MEDIUM;
  }
  if (props.beVietnamSemiBold) {
    return fonts.BE_VIETNAM_SEMIBOLD;
  }
  if (props.beVietnamBold) {
    return fonts.BE_VIETNAM_BOLD;
  }
  return fonts.SUSE_REGULAR;
};

const italic = props => {
  if (props.italic) {
    return true;
  }
  return false;
};

const color = props => {
  if (props.light) {
    return '#999';
  }
  return '#222';
};

export default GText;
