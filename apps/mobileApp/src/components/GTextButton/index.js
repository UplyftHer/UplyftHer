import React, {useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import GText from '../GText';

const GTextButton = props => {
  const {title, style, titleStyle, onPress, disabled, hitSlop} = props;
  return (
    <TouchableOpacity
      hitSlop={hitSlop}
      disabled={disabled}
      style={style}
      onPress={onPress}>
      <GText
        style={[
          // {color: Colors.icon, fontFamily: fonts.MANROPE_BOLD},
          titleStyle,
        ]}
        text={title}
      />
    </TouchableOpacity>
  );
};

export default GTextButton;
