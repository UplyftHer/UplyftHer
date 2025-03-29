import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderButton from '../../../../components/HeaderButton';
import {Images} from '../../../../utils';
import GText from '../../../../components/GText';
import {styles} from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {scaledValue} from '../../../../utils/design.utils';
import Input from '../../../../components/Input';
import {colors} from '../../../../../assets/colors';
import GradientButton from '../../../../components/GradientButton';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../redux/store/storeUtils';
import {edit_user_email} from '../../../../redux/slices/profileSlice';

const ChangeEmail = ({navigation}) => {
  useEffect(() => {
    configureHeader();
  }, []);

  const [newEmail, setNewEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useAppDispatch();
  const loggedUserData = useAppSelector(state => state.auth.user);

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

  const edit_email = () => {
    const api_credential = {
      oldEmail: loggedUserData?.email,
      newEmail: newEmail,
    };

    dispatch(edit_user_email(api_credential)).then(res => {
      if (edit_user_email.fulfilled.match(res)) {
        navigation?.replace('VerifyEditEMail', {
          newEmail: newEmail,
        });
      }
    });
  };

  return (
    <KeyboardAwareScrollView
      style={styles.scrollView}
      extraHeight={Platform.OS == 'ios' ? scaledValue(100) : ''}>
      <GText
        text={`Enter your new email to update your existing one. Once submitted, you may need to verify the new email before the change takes effect.`}
        beVietnamRegular
        style={styles.content}
      />
      <Input
        showLabel
        value={newEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={val => setNewEmail(val)}
        placeholderTextColor={colors.inputPlaceholder}
        style={styles.input}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        label={
          <GText
            text={isFocused || newEmail ? 'New Email' : 'Enter New Email'}
            style={styles.labelStyling(isFocused, newEmail)}
          />
        }
      />
      <GradientButton
        title={'Submit'}
        gradientstyle={styles.gradientStyle}
        textstyle={styles.buttonText}
        onPress={edit_email}
      />
    </KeyboardAwareScrollView>
  );
};

export default ChangeEmail;
