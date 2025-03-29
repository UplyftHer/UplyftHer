import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import Input from '../../../components/Input';
import GradientButton from '../../../components/GradientButton';
import GButton from '../../../components/GButton';
import {ScrollView} from 'react-native-gesture-handler';
import {Images} from '../../../utils';
import {scaledValue} from '../../../utils/design.utils';
import {colors} from '../../../../assets/colors';
import {closeEye, openEye} from '../../../utils/Images';
import GText from '../../../components/GText';
import {
  linkedIn_sign_up,
  setUserData,
  sign_up,
} from '../../../redux/slices/authSlice';
import {useDispatch} from 'react-redux';
import {useAppDispatch} from '../../../redux/store/storeUtils';
import {showToast} from '../../../components/Toast';
import {
  notificationListener,
  requestUserPermission,
} from '../../../helpers/notificationServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PRIVACY_POLICY_URL, TERMS_CONDITIONS_URL} from '../../../constants';

const SignUp = ({navigation}) => {
  const dispatch = useAppDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(true);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(true);
  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
    invitationCode: '',
    confirmPassword: '',
  });

  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    requestUserPermission();
    notificationListener();
    const getToken = async () => {
      try {
        let token = await AsyncStorage.getItem('fcmToken');
        setFcmToken(token);
      } catch (e) {
        console.log('fcmerror', e);
      }
    };
    getToken();
  }, [fcmToken]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);
  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        PermissionsAndroid.check('android.permission.POST_NOTIFICATIONS')
          .then(response => {
            if (!response) {
              PermissionsAndroid.request(
                'android.permission.POST_NOTIFICATIONS',
                {
                  title: 'Notification',
                  message:
                    'Uplyfther needs access to your notification ' +
                    'so you can get Updates',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                },
              );
            }
          })
          .catch(err => {
            console.log('Notification Error=====>', err);
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };
  const togglePasswordVisibility = field => {
    if (field === 'password') {
      setVisiblePassword(prev => !prev);
    } else if (field === 'confirmPassword') {
      setVisibleConfirmPassword(prev => !prev);
    }
  };

  const sign_up_hit = async () => {
    if (formValue?.password != formValue?.confirmPassword) {
      showToast(0, 'Password and confirm password does not match');
    } else if (formValue?.password == formValue?.confirmPassword) {
      let input = {
        email: formValue?.email?.toLowerCase(),
        password: formValue?.password,
        invitationCode: formValue?.invitationCode,
        deviceToken: await AsyncStorage.getItem('fcmToken'),
      };

      dispatch(sign_up(input));
    }
  };

  const linkedInLogin = async token => {
    let input = {
      linkedinAccessToken: token,
      invitationCode: formValue?.invitationCode,
      deviceToken: await AsyncStorage.getItem('fcmToken'),
      type: 'signup',
    };

    dispatch(linkedIn_sign_up(input));
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingStyle}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ImageBackground source={Images.threeLines} style={styles.ThreeLines}>
            <Text style={styles.signupText}>Sign up</Text>
          </ImageBackground>
          <View style={{bottom: scaledValue(12)}}>
            <View style={{paddingHorizontal: scaledValue(20)}}>
              <Input
                value={formValue?.invitationCode}
                onChangeText={value =>
                  setFormValue({...formValue, invitationCode: value})
                }
                placeholder={'Invitation Code'}
                placeholderTextColor={colors.inputPlaceholder}
                // rightIcon={Images.scanner}
                // iconRightStyle={styles.rightIcon}
                style={styles.input}
              />
              <Input
                value={formValue?.email}
                onChangeText={value =>
                  setFormValue({...formValue, email: value})
                }
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder={'Email Address'}
                placeholderTextColor={colors.inputPlaceholder}
                style={styles.input}
              />
              <Input
                value={formValue?.password}
                onChangeText={value =>
                  setFormValue({...formValue, password: value})
                }
                autoCapitalize="none"
                placeholder={'Password'}
                keyboardType="default"
                placeholderTextColor={colors.inputPlaceholder}
                rightIcon={!visiblePassword ? openEye : closeEye}
                iconRightStyle={styles.rightIcon}
                onPressRightIcon={() => {
                  if (visiblePassword) {
                    setVisiblePassword(false);
                  } else {
                    setVisiblePassword(true);
                  }
                }}
                style={styles.input}
                secureTextEntry={visiblePassword}
              />

              <Input
                value={formValue?.confirmPassword}
                onChangeText={value =>
                  setFormValue({...formValue, confirmPassword: value})
                }
                keyboardType="default"
                placeholder={'Confirm Password'}
                placeholderTextColor={colors.inputPlaceholder}
                rightIcon={!visibleConfirmPassword ? openEye : closeEye}
                iconRightStyle={styles.rightIcon}
                style={styles.input}
                onPressRightIcon={() => {
                  if (visibleConfirmPassword) {
                    setVisibleConfirmPassword(false);
                  } else {
                    setVisibleConfirmPassword(true);
                  }
                }}
                secureTextEntry={visibleConfirmPassword}
              />
            </View>

            <View style={styles.termsView}>
              <TouchableOpacity onPress={() => handleToggle()}>
                <Image
                  source={isChecked ? Images.checked : Images.unchecked}
                  style={[
                    styles.checkBoxIcon,
                    isChecked && {tintColor: colors.darkPurple},
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <View style={styles.agreeTextView}>
                <Text style={styles.agreeText}>
                  <Text style={styles.agreePart1}>
                    I agree to Uplyft Her’s{' '}
                  </Text>

                  <Text
                    onPress={() => {
                      navigation?.navigate('TermsPrivacy', {
                        url: TERMS_CONDITIONS_URL,
                        screen: 'Terms and Conditions',
                      });
                    }}
                    style={styles.agreePart2}>
                    Terms and {'\n'} Conditions
                  </Text>

                  <Text style={styles.agreePart1}> and </Text>
                  <Text
                    onPress={() => {
                      navigation?.navigate('TermsPrivacy', {
                        url: PRIVACY_POLICY_URL,
                        screen: 'Privacy Policy',
                      });
                    }}
                    style={styles.agreePart2}>
                    Privacy Policy
                  </Text>
                </Text>
              </View>
            </View>

            <GradientButton
              title={'Sign up'}
              disabled={!formValue?.email || !formValue?.password || !isChecked}
              style={styles.gradientButton}
              imageSource={Images.power}
              imagestyle={styles.imageStyle}
              textstyle={styles.textStyle}
              onPress={() => {
                sign_up_hit();
              }}
            />
            <View style={styles.lineView}>
              <View style={styles.line} />
              <GText
                text="Login Via"
                beVietnamMedium
                style={styles.loginViaText}
              />
              <View style={styles.line} />
            </View>
            <GButton
              onPress={() => {
                if (!formValue?.invitationCode) {
                  showToast(0, 'Please enter invitation code before sign up');
                } else {
                  navigation?.navigate('LinkedinLogin', {
                    linkedInLogin: linkedInLogin,
                  });
                }
              }}
              title="Sign up with Linkedin"
              icon={Images.linkedin}
              iconStyle={styles.iconStyle}
              textStyle={styles.buttonText}
              style={styles.customButton}
            />
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.already}>
                Already a member?
                <Text style={styles.signIn}> Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUp;
