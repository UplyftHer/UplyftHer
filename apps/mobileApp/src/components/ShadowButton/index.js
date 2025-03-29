import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {scaledValue} from '../../utils/design.utils';
import fonts from '../../utils/fonts';



const ShadowButton = props => {
  return (
    <>
      {props.isShadowButton && (
        <TouchableOpacity
          disabled={props.disabled}
          style={[styles.headerButtonView, props.style]}
          onPress={props.onPress}>
          {props?.icon && <Image source={props?.icon} style={styles.icon} />}
         
        </TouchableOpacity>
      )}
      {!props.isShadowButton && (
        <TouchableOpacity
          style={[styles.borderButton, props.borderButtonView]}
          onPress={props.onPress}>
          <Text
            style={[styles.borderButtonText, props.borderButtonStyle]}
            allowFontScaling={true}
            maxFontSizeMultiplier={1.15}>
            {' '}
            {props?.title}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default ShadowButton;

const styles = StyleSheet.create({
  headerButtonView: {
    borderRadius: scaledValue(12),
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scaledValue(14),
    paddingVertical: scaledValue(8),
  },
  borderButton: {
    borderRadius: scaledValue(12),
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#BDBDBD',
  },

  gradientText: {
    fontSize: scaledValue(13),
    lineHeight: scaledValue(18),
    fontFamily: fonts.GILMER_MEDIUM,
  },

  borderButtonText: {
    fontSize: scaledValue(13),
    lineHeight: scaledValue(18),
    fontFamily: fonts.GILMER_REGULAR,
    marginHorizontal: scaledValue(14),
    marginVertical: scaledValue(8),
    color: '#9D9D9D',
  },
  icon: {
    width: scaledValue(16),
    height: scaledValue(16),
    marginRight: scaledValue(1),
  },
});
