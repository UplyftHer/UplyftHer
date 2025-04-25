import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Images} from '../../../utils';
import {styles} from './styles';
import GText from '../../../components/GText';
import HeaderButton from '../../../components/HeaderButton';
import GradientButton from '../../../components/GradientButton';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {scaledValue} from '../../../utils/design.utils';
import {useAppDispatch} from '../../../redux/store/storeUtils';
import {
  confirm_forgot_password,
  confirm_signup,
  resend_confirmation_code,
} from '../../../redux/slices/authSlice';
import Input from '../../../components/Input';
import {colors} from '../../../../assets/colors';
import {closeEye, openEye} from '../../../utils/Images';
import {showToast} from '../../../components/Toast';
import fonts from '../../../utils/fonts';

const CELL_COUNT = 6;

const ConfirmSignUp = ({navigation, route}) => {
  const {responseData} = route?.params;
  console.log('responseDatass', responseData);

  const dispatch = useAppDispatch();
  const [value, setValue] = useState('');
  const [timerCount, setTimer] = useState(30);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  useEffect(() => {
    configureHeader();
  }, []);

  const configureHeader = () => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          icon={Images.leftArrow}
          onPress={() => navigation.goBack()}
          iconStyle={styles.arrow}
          style={{paddingHorizontal: scaledValue(20)}}
        />
      ),
      headerTitle: () => (
        <GText text="Verify Your Account" medium style={styles.headerText} />
      ),
    });
  };

  const confirm_otp_hit = () => {
    let input = {
      email: responseData?.data?.email,
      confirmationCode: value,
    };
    dispatch(confirm_signup(input));
  };

  const resend_code_hit = () => {
    let input = {
      email: responseData?.data?.email,
    };
    dispatch(resend_confirmation_code(input));
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
    <View style={styles.container}>
      <ScrollView>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        {/* <GText text="Create a New Password" medium style={styles.emailText} /> */}
        <GText
          text={`We’ve sent a One-Time Password (OTP) \nto your email ${maskEmail(
            responseData?.data?.email,
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
            marginTop: scaledValue(32),
            justifyContent: 'center',
          }}>
          <Text style={styles.bottomText1}>Didn’t received OTP?</Text>
          <TouchableOpacity
            disabled={timerCount > 0}
            style={{
              alignSelf: 'center',
            }}
            onPress={resend_code_hit}>
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

        {/* <TouchableOpacity
          style={{
            marginTop: scaledValue(32),
            alignSelf: 'center',
          }}
          onPress={resend_code_hit}>
          <Text style={styles.bottomText1}>
            Didn’t receive OTP?
            <Text style={styles.bottomText2}> {' Send again'}.</Text>
          </Text>
        </TouchableOpacity> */}
        <View style={styles.gradientView}>
          <GradientButton
            style={{opacity: value.length >= 6 ? 1 : 0.5}}
            title={'Submit'}
            onPress={confirm_otp_hit}
            gradientstyle={styles.gradientStyle}
            textstyle={styles.buttonText}
            disabled={value.length != 6}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ConfirmSignUp;
