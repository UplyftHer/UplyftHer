import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../../../../assets/colors';
import HeaderButton from '../../../components/HeaderButton';
import {Images} from '../../../utils';
import GText from '../../../components/GText';
import {styles} from './styles';
import WebView from 'react-native-webview';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';
import {get_content_detail} from '../../../redux/slices/profileSlice';
import {scaledValue} from '../../../utils/design.utils';

const TermsPrivacy = ({navigation, route}) => {
  const {screen, url, type} = route?.params;
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.loading?.loading);
  const [data, setData] = useState({});
  useEffect(() => {
    configureHeader();
    getContent();
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
        <GText text={screen} semiBold style={styles.headerTitleStyle} />
      ),
    });
  };

  const getContent = () => {
    let input = {
      type: type,
    };
    dispatch(get_content_detail(input)).then(res => {
      if (get_content_detail.fulfilled.match(res)) {
        console.log(res.payload?.status);
        if (res.payload.status === 1) {
          setData(res.payload.data);
        }
      }
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.offWhite,
        paddingHorizontal: scaledValue(20),
      }}>
      {!loading && (
        <WebView
          source={{
            html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              background-color: #FFF4EC; /* Replace with your desired color */
              margin: 0;
              padding: 0;
               height: 100%;
              margin: 0;
              padding: 0;
              -webkit-user-select: none;
              -webkit-touch-callout: none;
              touch-action: manipulation;
            }
          </style>
        </head>
        <body>
          ${data}
        </body>
      </html>
    `,
          }}
          style={{backgroundColor: colors.offWhite}}
          showsVerticalScrollIndicator={false}
          scalesPageToFit={false} // Android support
          injectedJavaScript={`document.body.style.zoom = '1.0';`} // iOS backup
        />
      )}

      {/* <WebView
        onError={val => console.log('WebViewError', val)}
        source={{uri: url}}
      /> */}
    </View>
  );
};

export default TermsPrivacy;
