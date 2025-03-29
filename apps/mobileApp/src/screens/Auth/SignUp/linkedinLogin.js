import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import {LINKEDIN_CALLBACK_URL, LINKEDIN_CLIENT_ID} from '../../../constants';

const LinkedinLogin = ({navigation, route}) => {
  const [linkedinWeb, setLinkedinWeb] = useState(false);
  const {linkedInLogin} = route?.params;
  const [found, setFound] = useState(false);
  const listenURL = LINKEDIN_CALLBACK_URL;

  const linkedinLoginPage = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=https%3A%2F%2Fdevapi.uplyfther.com%2Fapi%2Fauth%2Flinkedin%2Fcallback&scope=profile%2Cemail%2Copenid`;

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
