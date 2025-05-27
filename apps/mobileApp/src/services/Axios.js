import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import store from '../redux/store';
import {API_BASE_URL} from '../constants';
import {logout, logout_user, updateUser} from '../redux/slices/authSlice';
import {getUser} from '../utils/constant.utils';
import {showToast} from '../components/Toast';

// ADD A REQUEST INTERCEPTOR
axios.interceptors.request.use(
  config => {
    config.baseURL = API_BASE_URL;
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

//ADD A RESPONSE INTERCEPTOR
axios.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const user = getUser();

    // const user = getUser()
    console.log(
      'Run101251s',
      error.response.status,
      originalRequest.url,
      originalRequest._retry,
      originalRequest,
    );
    console.log('originalRequest._retry', originalRequest._retry);

    if (
      error.response.status === 401 &&
      originalRequest.url === '/auth/refreshToken'
    ) {
      console.log('Run2');
      showToast(0, 'Session expired, please login again');
      store.dispatch(
        logout_user({
          deviceToken: (await AsyncStorage.getItem('fcmToken')) || '1234',
        }),
      );
      // apiLogout(userData);
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      console.log('Run355f');
      const state = store.getState();
      const userData = state.auth?.user;
      console.log('userDatauserDatass', userData);

      // console.log('user?.refreshTokenssfs', user);
      originalRequest._retry = true;
      console.log('1234564789sf');

      try {
        const res = await axios.post(
          '/auth/refreshToken',
          {
            refreshToken: userData?.refreshToken,
          },
          {
            headers: {
              // Authorization: `Bearer ${user?.accessToken}`, // replace YOUR_TOKEN_HERE with your actual token
              'Content-Type': 'application/x-www-form-urlencoded', // specify content type if needed
            },
          },
        );
        if (res.status === 200) {
          console.log('Run525f');
          console.log('tokenAPIREsponsessss', res?.data);

          if (res?.data?.status === 1) {
            store.dispatch(
              updateUser({
                ...userData,
                accessToken: res?.data?.accessToken,
                refreshToken: userData?.refreshToken,
              }),
            );
          }

          console.log('user549580f', userData);
          console.log('Here OriginalRequesfts', originalRequest);
          console.log('Runf51', res?.data);

          originalRequest.headers[
            'Authorization'
          ] = `Bearer ${res?.data?.accessToken}`;
          return axios(originalRequest);
        }
      } catch (error) {
        console.log('error in refresh token APIs=>', error?.response?.data);
      }
    }
    return Promise.reject(error);
  },
);

const apiLogout = async userData => {
  console.log('Run6');
  const routeApi = `auth/logout`;
  const token = await AsyncStorage.getItem('fcmToken');
  const input = {
    fcm_token: token,
  };
  console.log('input apiLogout', input);

  const response = await axios.post(routeApi, input);
  // const response = await API({
  //   route: routeApi,
  //   body: input,
  //   method: 'POST',
  // });
  console.log('response apiLogout0', response?.data);

  if (response) {
    if (response?.data?.status) {
      // store.dispatch(resetApp());
    }
  }

  //   const callback = (d: any) => {
  //     console.log('callback2345', d?.data?.success)
  //     if (d?.data?.success === true) {
  //       eraseWallet()
  //     }
  //   }
  //   if (response) {
  //     if (response?.data?.status) {
  //       setTimeout(() => {
  //         store.dispatch(apiService(input, 'logout', callback, 'POST'))
  //         showToast(1, t('logout'))
  //       }, 200)
  //     }
  //   }
};
