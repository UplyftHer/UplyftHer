import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import fonts from '../../utils/fonts';
import {colors} from '../../../assets/colors';
import {scaledValue} from '../../utils/design.utils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const BottomSheet = props => {
  const insets = useSafeAreaInsets();
  return (
    <RBSheet
      ref={props.logoutRBSheetRef}
      draggable={true}
      height={200}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        draggableIcon: {
          backgroundColor: colors.midGray,
          width: scaledValue(48),
        },
        container: {
          borderTopRightRadius: scaledValue(24),
          borderTopLeftRadius: scaledValue(24),
          backgroundColor: colors.offWhite,
          marginBottom: insets.bottom === 0 ? -30 : 0,
        },
      }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 30,
          paddingVertical: 10,
          justifyContent: 'space-between',
        }}>
        <View>
          <Text
            style={{
              marginBottom: 5,
              fontSize: 16,

              fontFamily: fonts.BE_VIETNAM_SEMIBOLD,
              color: colors.themeColor,
            }}>
            {props.headerText}
          </Text>
          <Text
            style={{
              marginBottom: 5,
              fontSize: 14,
              fontFamily: fonts.BE_VIETNAM_MEDIUM,
              color: colors.charcoal,
            }}>
            {props.contentText}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingVertical: 30,
          }}>
          <TouchableOpacity
            onPress={() => props.logoutRBSheetRef.current.close()}
            style={{paddingHorizontal: 30}}>
            <Text
              style={{
                fontFamily: fonts.BE_VIETNAM_SEMIBOLD,
                color: colors.black,
              }}>
              {props.firstButtonTitle}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.onPress}>
            <Text
              style={{
                fontFamily: fonts.BE_VIETNAM_SEMIBOLD,
                color: colors.themeColor,
              }}>
              {props.secondButtonTitle}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </RBSheet>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({});
