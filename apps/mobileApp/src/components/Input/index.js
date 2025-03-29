import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {HelperText, TextInput, useTheme} from 'react-native-paper';
import {
  getFontSize,
  scaledHeightValue,
  scaledValue,
} from '../../utils/design.utils';
import {colors} from '../../../assets/colors';
import GText from '../GText';
import {Images} from '../../utils';
import fonts from '../../utils/fonts';

const Input = props => {
  const theme = useTheme();
  const inputRef = useRef(null); // Create a ref for the TextInput
  const [isFocused, setIsFocused] = useState(false); // State to manage focus
  const {isShowPhone, setCountryCode, countryCode, formValue} = props;
  const [showCountry, setShowCountry] = useState(false);
  const [countryDialCode, setCountryDialCode] = useState(countryCode);
  const [countryFlag, setCountryFlag] = useState('🇺🇸');
  const [focus, setFocus] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur();
  };

  return (
    <TextInput
      placeholder={props.placeholder}
      error={props?.error}
      placeholderTextColor={colors.darkPurple || props.placeholderTextColor}
      ref={props.ref}
      onPress={props?.onPress}
      onFocus={handleFocus}
      onBlur={handleBlur}
      // label={props?.label}
      // labelStyle={props?.labelStyle}
      returnKeyType={props?.returnKeyType}
      disabled={props.disabled}
      numberOfLines={props.numberOfLines}
      multiline={props.multiline}
      editable={props.editable}
      mode={'outlined'}
      keyboardType={props.keyboardType}
      autoCapitalize={props.autoCapitalize}
      value={props.value}
      onChangeText={props.onChangeText}
      style={[styles.inputField, props.style]}
      contentStyle={[styles.content, props.contentStyle]}
      underlineColor={colors.Gray}
      secureTextEntry={props.secureTextEntry}
      activeOutlineColor={colors.Gray}
      outlineColor={colors.Gray}
      label={
        props?.showLabel && (
          <GText
            text={props?.label}
            style={{
              fontSize:
                isFocused || props.value ? scaledValue(14) : scaledValue(16),
              fontFamily:
                isFocused || props.value
                  ? fonts?.BE_VIETNAM_BOLD
                  : fonts?.BE_VIETNAM_REGULAR,
              // lineHeight: scaledHeightValue(16),
              letterSpacing: scaledValue(16 * -0.03),
              color: isFocused || props.value ? '#966B9D' : '#312943',
            }}
          />
        )
      }
      outlineStyle={
        props.outlineStyle
          ? props.outlineStyle
          : {
              borderWidth:
                isFocused || props.value ? scaledValue(1) : scaledValue(0.5),
            }
      }
      cursorColor="black"
      theme={{
        roundness: props.roundness || scaledValue(12),
        colors: {
          primary: colors.darkPurple,
        },
      }}
      left={
        props.leftIcon ? (
          <TextInput.Icon
            icon={() => (
              <Image source={props.leftIcon} style={props.iconLeftStyle} />
            )}
          />
        ) : null
      }
      right={
        props?.rightIcon ? (
          <TextInput.Icon
            icon={props.rightIcon}
            size={20}
            style={{top: 0}}
            onPress={props.onPressRightIcon}
            // icon={() => (
            //   <TouchableOpacity onPress={props.onPressRightIcon}>
            //     <Image
            //       source={props.rightIcon}
            //       tintColor={props.tintColor}
            //       style={props.iconRightStyle}
            //       resizeMode="contain"
            //     />
            //   </TouchableOpacity>
            // )}
          />
        ) : null
      }
    />
  );
};

export default Input;

const styles = StyleSheet.create({
  inputField: {
    height: scaledValue(48),
    color: colors.black,
    fontFamily: fonts.BE_VIETNAM_REGULAR,
  },
  helperTextStyle: {
    fontSize: getFontSize(12),
    lineHeight: scaledHeightValue(16),
  },
  content: {
    color: '#383838',
    fontFamily: fonts.BE_VIETNAM_REGULAR,
    fontSize: scaledValue(16),
    lineHeight: scaledValue(20.08),
    letterSpacing: scaledValue(16 * -0.02),
    // borderWidth: scaledValue(0.5),
    // borderRadius: scaledValue(12),
    // borderColor: '#312943',
  },
});
