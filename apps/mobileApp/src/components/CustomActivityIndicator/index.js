import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React from 'react';
import {colors} from '../../../assets/colors';

const CustomActivityIndicator = props => {
  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        props?.style,
      ]}>
      <ActivityIndicator size={'large'} color={colors.themeColor} />
    </View>
  );
};

export default CustomActivityIndicator;

const styles = StyleSheet.create({});
