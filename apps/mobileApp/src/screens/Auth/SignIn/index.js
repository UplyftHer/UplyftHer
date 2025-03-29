import {
  ImageBackground,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {styles} from './styles';
import {Images} from '../../../utils';
import Input from '../../../components/Input';
import {colors} from '../../../../assets/colors';
import {closeEye, openEye} from '../../../utils/Images';
import GText from '../../../components/GText';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import GradientButton from '../../../components/GradientButton';
import GButton from '../../../components/GButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppDispatch} from '../../../redux/store/storeUtils';
import {linkedIn_sign_up, sign_in} from '../../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import LinkedInModal from '@gcou/react-native-linkedin'

const SignIn = ({navigation}) => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const dispatch = useAppDispatch();
  const linkedRef = useRef();
  const insets = useSafeAreaInsets();
  const togglePasswordVisibility = () => {
    setVisiblePassword(!visiblePassword);
  };

  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
  });

  const sign_up_hit = async () => {
    let input = {
      email: formValue?.email,
      password: formValue?.password,
      deviceToken: (await AsyncStorage.getItem('fcmToken')) || '1234',
    };

    dispatch(sign_in(input));
  };

  const sign_in_linkedin = async token => {
    let input = {
      linkedinAccessToken: token,
      invitationCode: '',
      deviceToken: await AsyncStorage.getItem('fcmToken'),
      type: 'signin',
    };

    dispatch(linkedIn_sign_up(input));
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={Images.gradientRect}
        resizeMode="cover"
        style={styles.imgBg}>
        <Image source={Images.whiteLines} style={styles.whiteLines} />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            top: insets.top + scaledValue(13),
            marginLeft: scaledValue(20),
          }}>
          <Image
            source={Images.leftArrow}
            tintColor={colors.white}
            style={styles.arrow}
          />
        </TouchableOpacity>
        <Text style={styles.signInText}>Sign in</Text>
      </ImageBackground>
      <View style={styles.containerView}>
        <View style={styles.contentView}>
          <Input
            value={formValue?.email}
            onChangeText={value => setFormValue({...formValue, email: value})}
            placeholder={'Email Address'}
            placeholderTextColor={colors.inputPlaceholder}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            value={formValue?.password}
            onChangeText={value =>
              setFormValue({...formValue, password: value})
            }
            placeholder={'Password'}
            placeholderTextColor={colors.inputPlaceholder}
            rightIcon={visiblePassword ? openEye : closeEye}
            iconRightStyle={styles.rightIcon}
            onPressRightIcon={() => togglePasswordVisibility('password')}
            style={styles.input}
            secureTextEntry={!visiblePassword}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPasswordText}>
            <GText
              text="Forgot Password?"
              beVietnamSemiBold
              style={styles.forgotText}
            />
          </TouchableOpacity>
          <View style={styles.buttonView}>
            <GradientButton
              disabled={!formValue?.email || !formValue?.password}
              title={'Sign in'}
              onPress={sign_up_hit}
              style={styles.gradientButton}
              gradientstyle={styles.gradientButton}
              textstyle={styles.textStyle}
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
              title="Sign in with Linkedin"
              onPress={() =>
                navigation?.navigate('LinkedinLogin', {
                  linkedInLogin: sign_in_linkedin,
                })
              }
              icon={Images.linkedin}
              iconStyle={styles.iconStyle}
              textStyle={styles.buttonText}
              style={styles.customButton}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignIn;
