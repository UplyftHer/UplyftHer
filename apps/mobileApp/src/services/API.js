import axios from 'axios';
import Axios from './Axios';
import {API_BASE_URL} from '../constants';
import store from '../redux/store';
import {Alert} from 'react-native';
import {logout_user} from '../redux/slices/authSlice';
import {showToast} from '../components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo'; // ✅ Import NetInfo

export default async function API(props) {
  // ✅ Check internet connection first
  const netState = await NetInfo.fetch();

  if (!netState.isConnected) {
    if (!global.networkError) {
      global.networkError = true;

      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection and try again.',
        [{text: 'OK', onPress: () => (global.networkError = false)}],
      );
    }

    return {
      status: 0,
      error: 'No internet connection',
    };
  }
  //SET URL
  let path = API_BASE_URL;
  let route = props.route;
  let url = props?.path ? props?.path : path + route;

  if (props.url) {
    url = props.url;
  }

  let method = props.method || 'GET';
  let body = props.body || {};
  if (method == 'GET') {
    let param = [];
    Object.entries(body).forEach(([key, value]) =>
      param.push(`${key}=${value}`),
    );
    if (param.length > 0) {
      url = `${url}?${param.join('&')}`;
    }
  }

  let multiPartData = props?.multiPart;
  const formData = new FormData();

  if (multiPartData) {
    Object.keys(body).forEach(key => {
      if (Array.isArray(body[key])) {
        body[key].forEach(item => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, body[key]);
      }
    });
  }

  const authState = store.getState().auth;
  let accessToken = authState?.user?.accessToken;

  let headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  if (props.headers) {
    headers = {...headers, ...props.headers};
  }

  const request = {
    method: method,
    url: url,
    headers: headers,
  };

  if (method != 'GET') {
    request.data = multiPartData ? formData : body;
  }

  try {
    let response = await axios(request);
    return response;
  } catch (error) {
    if (accessToken && error?.response?.status === 403) {
      if (!global.temporaryDelete) {
        global.temporaryDelete = true;

        store.dispatch(
          logout_user({
            deviceToken: (await AsyncStorage.getItem('fcmToken')) || '1234',
          }),
        );
        showToast(0, error?.response?.data?.message);
      }

      return {
        status: 0,
        error: error?.response?.data?.message,
      };
    }

    if (error?.code === 'ERR_NETWORK' && !global.networkError) {
      global.networkError = true;
      Alert.alert(
        'Network Error',
        'Something is temporarily wrong with your network connection. Please make sure you are connected to the internet.',
        [
          {
            text: 'OK',
            onPress: () => (global.networkError = false),
          },
        ],
      );
    }

    if (!error.response) {
      return {
        status: 26,
        error: error,
      };
    }

    return error;
  }
}
