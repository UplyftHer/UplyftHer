import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderButton from '../../../../components/HeaderButton';
import {Images} from '../../../../utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {scaledValue} from '../../../../utils/design.utils';
import {styles} from './styles';
import GText from '../../../../components/GText';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import GradientButton from '../../../../components/GradientButton';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../redux/store/storeUtils';
import {verify_edit_user_email} from '../../../../redux/slices/profileSlice';

const CELL_COUNT = 6;

const VerifyEditEMail = ({navigation, route}) => {
  useEffect(() => {
    configureHeader();
  }, []);
  const configureHeader = () => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          icon={Images.leftArrow}
          onPress={() => navigation.goBack()}
          tintColor={'#966B9D'}
          iconStyle={styles.headerIconStyle}
          style={{paddingHorizontal: 0}}
        />
      ),
    });
  };

  const {newEmail} = route?.params;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const dispatch = useAppDispatch();
  const loggedUserData = useAppSelector(state => state.auth.user);

  const confirm_otp_hit = () => {
    const api_credential = {
      email: newEmail,
      confirmationCode: value,
    };

    dispatch(verify_edit_user_email(api_credential)).then(res => {
      if (verify_edit_user_email.fulfilled.match(res)) {
        navigation?.goBack();
      }
    });
  };

  return (
    <KeyboardAwareScrollView
      style={styles.scrollView}
      extraHeight={Platform.OS == 'ios' ? scaledValue(100) : ''}>
      <GText text="Check your inbox" medium style={styles.emailText} />

      <GText
        text={`We’ve sent a One-Time Password (OTP) \nto your email ${newEmail}. \nEnter it below to verify your account.`}
        beVietnamRegular
        style={styles.content}
      />
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <View
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}>
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
      <GradientButton
        style={{opacity: value.length >= 6 ? 1 : 0.5}}
        title={'Submit'}
        onPress={confirm_otp_hit}
        gradientstyle={styles.gradientStyle}
        textstyle={styles.buttonText}
        disabled={value.length != 6}
      />
    </KeyboardAwareScrollView>
  );
};

export default VerifyEditEMail;
