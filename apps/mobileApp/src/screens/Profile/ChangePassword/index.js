import {StatusBar, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import {Images} from '../../../utils';

import GText from '../../../components/GText';
import {closeEye, openEye} from '../../../utils/Images';
import {colors} from '../../../../assets/colors';
import {scaledValue} from '../../../utils/design.utils';
import Input from '../../../components/Input';
import GradientButton from '../../../components/GradientButton';
import HeaderButton from '../../../components/HeaderButton';
import {useAppDispatch} from '../../../redux/store/storeUtils';
import {change_user_password} from '../../../redux/slices/profileSlice';

const ChangePassword = ({navigation}) => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const dispatch = useAppDispatch();

  const togglePasswordVisibility = field => {
    if (field === 'password') {
      setVisiblePassword(prev => !prev);
    } else if (field === 'confirmPassword') {
      setVisibleConfirmPassword(prev => !prev);
    }
  };

  useEffect(() => {
    configureHeader();
  }, []);

  const configureHeader = () => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          icon={Images.leftArrow}
          onPress={() => navigation.goBack()}
          style={{paddingHorizontal: 0}}
          iconStyle={styles.arrow}
        />
      ),
      headerTitle: () => (
        <GText text="Change Password" medium style={styles.headerText} />
      ),
    });
  };

  const changePassword = () => {
    const input = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    dispatch(change_user_password(input));
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <GText
        text={`Your new password must be different \nfrom previous used passwords`}
        beVietnamRegular
        style={styles.content}
      />
      <View style={{marginTop: scaledValue(32), gap: scaledValue(20)}}>
        <Input
          value={oldPassword}
          onChangeText={val => setOldPassword(val)}
          placeholder={'Enter Old Password'}
          placeholderTextColor={colors.inputPlaceholder}
          rightIcon={visibleConfirmPassword ? openEye : closeEye}
          iconRightStyle={styles.rightIcon}
          style={styles.input}
          onPressRightIcon={() => togglePasswordVisibility('confirmPassword')}
          secureTextEntry={!visibleConfirmPassword}
        />
        <Input
          value={newPassword}
          onChangeText={val => setNewPassword(val)}
          placeholder={'Enter New Password'}
          placeholderTextColor={colors.inputPlaceholder}
          rightIcon={visiblePassword ? openEye : closeEye}
          iconRightStyle={styles.rightIcon}
          onPressRightIcon={() => togglePasswordVisibility('password')}
          secureTextEntry={!visiblePassword}
          style={styles.input}
        />
      </View>
      <View style={styles.gradientView}>
        <GradientButton
          disabled={!oldPassword || !newPassword}
          title={'💾  Change Password'}
          gradientstyle={styles.gradientStyle}
          textstyle={styles.buttonText}
          onPress={changePassword}
        />
      </View>
    </View>
  );
};

export default ChangePassword;
