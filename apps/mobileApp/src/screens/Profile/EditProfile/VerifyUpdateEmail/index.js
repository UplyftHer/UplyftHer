import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
import {
  edit_user_email,
  verify_edit_user_email,
} from '../../../../redux/slices/profileSlice';
import {colors} from '../../../../../assets/colors';
import fonts from '../../../../utils/fonts';

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
  const [timerCount, setTimer] = useState(30);
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

  const edit_email = () => {
    const api_credential = {
      oldEmail: loggedUserData?.email,
      newEmail: newEmail,
    };

    dispatch(edit_user_email(api_credential)).then(res => {
      if (edit_user_email.fulfilled.match(res)) {
        setTimer(30);
      }
    });
  };

  const maskEmail = email => {
    const [local, domain] = email.split('@');

    // Mask local part: keep first 3 characters, add *
    const maskedLocal =
      local.length > 3 ? local.slice(0, 3) + '*' : local + '*';

    // Mask domain part: just show `.com` (or last part)
    const domainParts = domain.split('.');
    const tld = domainParts.pop(); // get the last part like 'com'
    const maskedDomain = '*'.repeat(7) + '.' + tld;

    return `${maskedLocal}@${maskedDomain}`;
  };

  useEffect(() => {
    if (timerCount > 0) {
      let interval = setInterval(() => {
        setTimer(lastTimerCount => {
          lastTimerCount <= 1 && clearInterval(interval);
          return lastTimerCount - 1;
        });
      }, 1000); //each count lasts for a second

      //cleanup the interval on complete
      return () => clearInterval(interval);
    }
  }, [timerCount]);

  return (
    <KeyboardAwareScrollView
      style={styles.scrollView}
      extraHeight={Platform.OS == 'ios' ? scaledValue(100) : ''}>
      <GText text="Check your inbox" medium style={styles.emailText} />

      <GText
        text={`We’ve sent a One-Time Password (OTP) \nto your email ${maskEmail(
          newEmail,
        )}. \nEnter it below to verify your account.`}
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: scaledValue(21),
          justifyContent: 'center',
        }}>
        <Text style={styles.bottomText1}>Didn’t received OTP?</Text>
        <TouchableOpacity
          disabled={timerCount > 0}
          style={{
            alignSelf: 'center',
          }}
          onPress={edit_email}>
          <Text
            style={{
              color: colors.themeColor,
              fontSize: scaledValue(16),
              lineHeight: scaledValue(16),
              marginTop: scaledValue(5),
              fontFamily: fonts.BE_VIETNAM_SEMIBOLD,
              letterSpacing: scaledValue(19 * -0.04),
            }}>
            {timerCount > 0
              ? ` Resend OTP in ${timerCount} sec`
              : ' Send again'}
          </Text>
        </TouchableOpacity>
      </View>
      <GradientButton
        title={'Submit'}
        onPress={confirm_otp_hit}
        gradientstyle={styles.gradientStyle}
        textstyle={styles.buttonText}
      />
    </KeyboardAwareScrollView>
  );
};

export default VerifyEditEMail;
