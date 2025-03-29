import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {colors} from '../../../../assets/colors';
import HeaderButton from '../../../components/HeaderButton';
import {Images} from '../../../utils';
import GText from '../../../components/GText';
import {styles} from './styles';
import WebView from 'react-native-webview';

const TermsPrivacy = ({navigation, route}) => {
  const {screen, url} = route?.params;
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
      headerTitle: () => (
        <GText text={screen} medium style={styles.headerTitleStyle} />
      ),
    });
  };
  return (
    <View style={{flex: 1, backgroundColor: colors.offWhite}}>
      <WebView
        onError={val => console.log('WebViewError', val)}
        source={{uri: url}}
      />
    </View>
  );
};

export default TermsPrivacy;
