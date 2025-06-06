import {
  Platform,
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
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {useAppDispatch} from '../../../redux/store/storeUtils';
import {
  confirm_forgot_password,
  confirm_signup,
  forgot_password,
  resend_confirmation_code,
} from '../../../redux/slices/authSlice';
import Input from '../../../components/Input';
import {colors} from '../../../../assets/colors';
import {closeEye, openEye} from '../../../utils/Images';
import {showToast} from '../../../components/Toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const CELL_COUNT = 6;

const CheckInbox = ({navigation, route}) => {
  const {responseData} = route?.params;

  const dispatch = useAppDispatch();
  const [value, setValue] = useState('');
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  useEffect(() => {
    configureHeader();
  }, []);

  const togglePasswordVisibility = field => {
    if (field === 'password') {
      setVisiblePassword(prev => !prev);
    } else if (field === 'confirmPassword') {
      setVisibleConfirmPassword(prev => !prev);
    }
  };

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
        <GText text="Set new Password" medium style={styles.headerText} />
      ),
    });
  };

  const confirm_otp_hit = () => {
    if (password != confirmPassword) {
      showToast(0, 'Password and confirm password does not match');
    } else if (password === confirmPassword) {
      let input = {
        email: responseData?.data?.email,
        confirmationCode: value,
        newPassword: password,
      };
      dispatch(confirm_forgot_password(input));
    }
  };

  const resend_code_hit = () => {
    let input = {
      email: responseData?.data?.email,
    };
    dispatch(forgot_password(input));
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

  return (
    <KeyboardAwareScrollView
      extraHeight={Platform.OS == 'ios' ? scaledValue(100) : ''}
      style={styles.container}>
      <ScrollView>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <GText text="Check your inbox" medium style={styles.emailText} />

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
        <TouchableOpacity
          style={{
            marginTop: scaledValue(21),
            alignSelf: 'center',
          }}
          onPress={resend_code_hit}>
          <Text style={styles.bottomText1}>
            Didn’t receive OTP?
            <Text style={styles.bottomText2}> {' Send again'}.</Text>
          </Text>
        </TouchableOpacity>
        <View
          style={{
            marginTop: scaledValue(35),
            marginHorizontal: scaledValue(20),
            backgroundColor: colors.themeColor,
            opacity: 0.7,
            height: scaledValue(1),
          }}
        />
        <GText
          text="Create a New Password"
          medium
          style={[styles.emailText, {marginTop: scaledValue(40)}]}
        />
        <GText
          text={`Choose a strong password to secure\nyour account.`}
          beVietnamRegular
          style={styles.content}
        />
        <View
          style={{
            marginTop: scaledValue(25),
            gap: scaledValue(20),
            alignSelf: 'center',
          }}>
          <Input
            value={password}
            onChangeText={val => setPassword(val)}
            placeholder={'Enter New Password'}
            placeholderTextColor={colors.inputPlaceholder}
            rightIcon={visiblePassword ? openEye : closeEye}
            iconRightStyle={styles.rightIcon}
            onPressRightIcon={() => togglePasswordVisibility('password')}
            secureTextEntry={!visiblePassword}
            style={styles.input}
          />

          <Input
            value={confirmPassword}
            onChangeText={val => setConfirmPassword(val)}
            placeholder={'Confirm Password'}
            placeholderTextColor={colors.inputPlaceholder}
            rightIcon={visibleConfirmPassword ? openEye : closeEye}
            iconRightStyle={styles.rightIcon}
            style={styles.input}
            onPressRightIcon={() => togglePasswordVisibility('confirmPassword')}
            secureTextEntry={!visibleConfirmPassword}
          />
        </View>

        <View style={styles.gradientView}>
          <GradientButton
            style={{opacity: value.length >= 6 ? 1 : 0.5}}
            title={'Submit'}
            onPress={confirm_otp_hit}
            gradientstyle={styles.gradientStyle}
            textstyle={styles.buttonText}
            disabled={value.length != 6 || !password || !confirmPassword}
          />
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default CheckInbox;
