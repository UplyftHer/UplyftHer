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

const NewPassword = ({navigation, route}) => {
  const {responseData} = route?.params;
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);

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
          iconStyle={styles.arrow}
          style={{paddingHorizontal: scaledValue(20)}}
        />
      ),
      headerTitle: () => (
        <GText text="Set new Password" medium style={styles.headerText} />
      ),
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <GText text="Create a New Password" medium style={styles.emailText} />
      <GText
        text={`Choose a strong password to secure \nyour account.`}
        beVietnamRegular
        style={styles.content}
      />
      <View style={{marginTop: scaledValue(20), gap: scaledValue(20)}}>
        <Input
          placeholder={'Enter New Password'}
          placeholderTextColor={colors.inputPlaceholder}
          rightIcon={visiblePassword ? openEye : closeEye}
          iconRightStyle={styles.rightIcon}
          onPressRightIcon={() => togglePasswordVisibility('password')}
          secureTextEntry={!visiblePassword}
          style={styles.input}
        />

        <Input
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
          title={'Submit'}
          gradientstyle={styles.gradientStyle}
          textstyle={styles.buttonText}
          onPress={() => navigation.navigate('BasicInfo')}
        />
      </View>
    </View>
  );
};

export default NewPassword;
