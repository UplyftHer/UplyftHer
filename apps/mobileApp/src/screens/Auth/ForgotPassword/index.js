import {
  ScrollView,
  StatusBar,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import GText from '../../../components/GText';
import HeaderButton from '../../../components/HeaderButton';
import Input from '../../../components/Input';
import {colors} from '../../../../assets/colors';
import GradientButton from '../../../components/GradientButton';
import {Images} from '../../../utils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scaledValue} from '../../../utils/design.utils';
import {forgot_password} from '../../../redux/slices/authSlice';
import {useAppDispatch} from '../../../redux/store/storeUtils';

const ForgotPassword = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
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
        <GText text="Forgot Password" style={styles.headerText} />
      ),
    });
  };

  useEffect(() => {
    configureHeader();
  }, [navigation]);

  const forgot_password_hit = () => {
    let input = {
      email: email?.toLocaleLowerCase(),
    };
    dispatch(forgot_password(input)).then(res => {
      if (forgot_password.fulfilled.match(res)) {
        console.log('154564', res);

        if (res?.payload?.status === 1) {
          navigation?.navigate('CheckInbox', {
            responseData: res?.payload,
          });
        }
      }
    });
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: colors.offWhite}}
      behavior={Platform.OS === 'ios' ? 'padding' : ''}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <View>
          <GText text="Your email address" style={styles.emailText} />
          <GText
            text={`Please enter your email address to get\nstarted. Make sure it’s valid so we can send\nyou the next steps.`}
            style={styles.content}
          />
          <View style={{paddingHorizontal: scaledValue(20)}}>
            <Input
              value={email}
              onChangeText={value => setEmail(value)}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email Address"
              placeholderTextColor={colors.Gray}
              style={styles.input}
            />
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.buttonContainer,
          keyboardVisible && styles.keyboardVisible,
        ]}>
        <GradientButton
          onPress={forgot_password_hit}
          // onPress={() => {
          //   navigation?.navigate('CheckInbox', {
          //     responseData: '',
          //   });
          // }}
          disabled={!email}
          title="Submit"
          gradientstyle={styles.gradientStyle}
          textstyle={styles.buttonText}
          // onPress={() => navigation.navigate('CheckInbox')}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
