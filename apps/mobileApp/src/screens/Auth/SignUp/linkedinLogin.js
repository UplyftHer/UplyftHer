import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {
  LINKEDIN_CALLBACK_URL,
  LINKEDIN_LOGIN_PAGE_URL,
} from '../../../constants';

const LinkedinLogin = ({navigation, route}) => {
  const [linkedinWeb, setLinkedinWeb] = useState(false);
  const {linkedInLogin} = route?.params;
  const [found, setFound] = useState(false);
  const listenURL = LINKEDIN_CALLBACK_URL;

  const linkedinLoginPage = LINKEDIN_LOGIN_PAGE_URL;

  const handleChange = ({nativeEvent: stage}) => {
    console.log(stage);
    console.log('linkedIn Code Urls=>', stage.url);
    let url = stage.url.split('?')[0];
    if (url === listenURL && !found) {
      setFound(true);
      setLinkedinWeb(false);
      const regex = /[?&]code=([^&]*)/;
      const match = url.match(regex);
      const code = match ? match[1] : null;

      if (
        stage?.url?.split('error=')[1]?.split('$')[0]?.split('&')[0] ==
        'user_cancelled_login'
      ) {
        navigation?.goBack();
      } else {
        if (stage?.url?.split('code=')[1].split('&')[0]) {
          linkedInLogin(stage?.url?.split('code=')[1].split('&')[0]);
          navigation?.goBack();
        } else {
          navigation?.goBack();
        }
      }
    }
  };
  return (
    <View style={{flex: 1}}>
      <WebView onLoadEnd={handleChange} source={{uri: linkedinLoginPage}} />
    </View>
  );
};

export default LinkedinLogin;

const styles = StyleSheet.create({});
