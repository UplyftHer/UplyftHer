import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {setLoading} from './loadingSlice';
import API from '../../services/API';
import {navigationContainerRef} from '../../../App';
import {showToast} from '../../components/Toast';
import {setNotifications} from './notificationSlice';
import store from '../store';
import {setUpComingMeetingList} from './bookMeetingSlice';
import {setPreviousInteractedMatches, setSavedProfile} from './profileSlice';

const initialState = {
  user: null,
  error: null,
  onBoarding: false,
  industryList: [],
  interestsList: [],
  showTutorial: true,
  isNewNotification: false,
};

export const sign_up = createAsyncThunk(
  'auth/signup',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `auth/signup`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('sign_up_response=>>', JSON.stringify(response));
      showToast(response?.data?.status, response?.data?.message);
      if (response?.data?.status === 1) {
        navigationContainerRef?.navigate('ConfirmSignUp', {
          responseData: response?.data,
        });
      }
      if (response.status !== 200) {
        return rejectWithValue(response?.data);
      }

      return response?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

export const linkedIn_sign_up = createAsyncThunk(
  'auth/signupWithLinkedIn',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `auth/signupWithLinkedIn`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('signupWithLinkedIn_response=>>', JSON.stringify(response));
      showToast(response?.data?.status, response?.data?.message);
      if (response?.data?.status === 1) {
        navigationContainerRef?.navigate('BasicInfo', {
          responseData: response?.data?.data,
        });
      }
      if (response?.data?.status !== 1) {
        return rejectWithValue(response?.data);
      }
      if (response.status !== 200) {
        return rejectWithValue(response?.data);
      }

      return response?.data?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

export const sign_in = createAsyncThunk(
  'auth/login',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `auth/login`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('sign_in_response=>>', JSON.stringify(response?.data));
      console.log('sign_in_responses=>>', JSON.stringify(response?.status));
      if (response?.data?.status === 1) {
        navigationContainerRef?.navigate('BasicInfo', {
          responseData: response?.data,
        });
      }
      showToast(response?.data?.status, response?.data?.message);
      if (response?.data?.status !== 1) {
        return rejectWithValue(response?.data);
      }

      return response?.data?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

export const forgot_password = createAsyncThunk(
  'auth/forgotPassword',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `auth/forgotPassword`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('forgotPassword_response=>>', JSON.stringify(response?.data));
      showToast(response?.data?.status, response?.data?.message);
      // if (response?.data?.status === 1) {
      //   navigationContainerRef?.navigate('CheckInbox', {
      //     responseData: response?.data,
      //   });
      // }

      if (response.status !== 200) {
        return rejectWithValue(response?.data);
      }

      return response?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

export const confirm_signup = createAsyncThunk(
  'auth/confirmSignup',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `auth/confirmSignup`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('confirmSignup_response=>>', JSON.stringify(response?.data));
      showToast(response?.data?.status, response?.data?.message);

      if (response?.data?.status === 1) {
        navigationContainerRef?.navigate('BasicInfo', {
          responseData: response?.data,
        });
      }
      if (response.status !== 200) {
        return rejectWithValue(response?.data);
      }

      return response?.data?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);
export const resend_confirmation_code = createAsyncThunk(
  'auth/resendConfirmationCode',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `auth/resendConfirmationCode`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'resendConfirmationCode_response=>>',
        JSON.stringify(response?.data),
      );
      showToast(response?.data?.status, response?.data?.message);

      if (response.status !== 200) {
        return rejectWithValue(response?.data);
      }

      return response?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

export const confirm_forgot_password = createAsyncThunk(
  'auth/confirmForgotPassword',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `auth/confirmForgotPassword`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'confirmForgotPassword_response=>>',
        JSON.stringify(response?.data),
      );
      showToast(response?.data?.status, response?.data?.message);
      if (response?.data?.status === 1) {
        navigationContainerRef?.navigate('SignIn');
      }

      if (response.status !== 200) {
        return rejectWithValue(response?.data);
      }

      return response?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

export const edit_user_profile = createAsyncThunk(
  'User/editProfile',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    const authState = getState()?.auth;

    console.log('edit_profile_api_credentials', credentials);
    try {
      dispatch(setLoading(true));

      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: 'profile/editProfile',
        body: credentials,
        method: 'POST',
        multiPart: true,
      });

      dispatch(setLoading(false));
      showToast(response?.data?.status, response?.data?.message);
      if (response?.data?.status === 1) {
        navigationContainerRef?.goBack();
      }

      if (response?.data?.status !== 1) {
        return rejectWithValue(response?.data);
      }
      console.log('response?.data?.data', response?.data?.data);

      return response?.data?.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log('edit_profile_response_error==>', error?.message);
      if (error?.message === 'Network Error') {
        showToast(0, validationError[error?.message]);
      }

      showToast(0, validationError[error.response.data?.message]);

      return rejectWithValue(error.response.data);
    }
  },
);

export const edit_user_location = createAsyncThunk(
  'User/editProfile',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    const authState = getState()?.auth;

    console.log('edit_profile_api_credentials', credentials);
    try {
      dispatch(setLoading(true));

      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: 'profile/editProfile',
        body: credentials,
        method: 'POST',
        multiPart: true,
      });

      dispatch(setLoading(false));
      if (response?.data?.status === 1) {
        showToast(response?.data?.status, 'Location changed successfully!');
      } else if (response?.data?.status === 0) {
        showToast(response?.data?.status, response?.data?.message);
      }

      if (response?.data?.status !== 1) {
        return rejectWithValue(response?.data);
      }
      console.log('response?.data?.data', response?.data?.data);

      return response?.data?.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log('edit_profile_response_error==>', error?.message);
      if (error?.message === 'Network Error') {
        showToast(0, validationError[error?.message]);
      }

      showToast(0, validationError[error.response.data?.message]);

      return rejectWithValue(error.response.data);
    }
  },
);

export const logout_user = createAsyncThunk(
  '/api/profile/logout',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/logout`,
        method: 'POST',
        body: credentials,
      });
      dispatch(setLoading(false));
      console.log('logout_user_response=>>', response?.data);
      if (response.status !== 200) {
        return rejectWithValue(response?.data);
      }
      if (response?.data?.status === 1) {
        console.log('hehdsbjkfs');

        dispatch(logout());
        dispatch(setNotifications([]));
        dispatch(setUpComingMeetingList([]));
        dispatch(setSavedProfile([]));
        dispatch(setPreviousInteractedMatches([]));
        // setMatchingProfileData([]);
      }
      return response?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

export const search_location = createAsyncThunk(
  '/api/google/searchGooglePlaces',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      // dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `google/searchGooglePlaces`,
        method: 'POST',
        body: credentials,
      });
      dispatch(setLoading(false));
      console.log('searchGooglePlaces_response=>>', response?.data);
      if (response.status !== 200) {
        return rejectWithValue(response?.data);
      }
      return response?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

export const get_industry_api = createAsyncThunk(
  '/api/profile/getIndustries',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      // dispatch(setLoading(true));
      const response = await API({
        route: `profile/getIndustries`,
        method: 'POST',
        body: credentials,
      });
      dispatch(setLoading(false));
      console.log('getIndustries_response=>>', response?.data);
      if (response.status !== 200) {
        return rejectWithValue(response?.data);
      }
      return response?.data?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);
export const get_interests_api = createAsyncThunk(
  '/api/profile/getInterests',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      // dispatch(setLoading(true));
      const response = await API({
        route: `profile/getInterests`,
        method: 'POST',
        body: credentials,
      });
      dispatch(setLoading(false));
      console.log('getInterests_response=>>', response?.data);
      if (response.status !== 200) {
        return rejectWithValue(response?.data);
      }
      return response?.data?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

export const get_cities_api = createAsyncThunk(
  '/api/auth/getCities',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      // dispatch(setLoading(true));
      const response = await API({
        route: `auth/getCities`,
        method: 'POST',
        body: credentials,
      });
      dispatch(setLoading(false));
      // console.log('auth/getCities=>>', response?.data);
      if (response.status !== 200) {
        return rejectWithValue(response?.data);
      }
      return response?.data?.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
    },
    updateUser: (state, action) => {
      state.user = action?.payload;
    },

    setUserData: (state, action) => {
      state.user = action.payload;
      // console.log('action.payload', action.payload);
    },
    setOnBoarding: (state, action) => {
      state.onBoarding = action.payload;
      // console.log('setOnBoarding =>', action.payload);
    },
    setShowTutorial: (state, action) => {
      state.showTutorial = action.payload;
    },
    setNewNotification: (state, action) => {
      state.isNewNotification = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(sign_in.pending, state => {
      state.loadingUser = true;
    });
    builder.addCase(sign_in.rejected, state => {
      state.loadingUser = false;
    });
    builder.addCase(sign_in.fulfilled, (state, action) => {
      state.loadingUser = false;
      console.log(' extraReducers action.payload: ', action.payload);
      // if (action.payload?.isCreateProfile === 1) {
      state.user = action.payload;
      // }
    });

    builder.addCase(confirm_signup.pending, state => {
      state.loadingUser = true;
    });
    builder.addCase(confirm_signup.rejected, state => {
      state.loadingUser = false;
    });
    builder.addCase(confirm_signup.fulfilled, (state, action) => {
      state.loadingUser = false;
      console.log(' extraReducers action.payload: ', action.payload);
      state.user = action.payload;
    });

    builder.addCase(linkedIn_sign_up.pending, state => {
      state.loadingUser = true;
    });
    builder.addCase(linkedIn_sign_up.rejected, state => {
      state.loadingUser = false;
    });
    builder.addCase(linkedIn_sign_up.fulfilled, (state, action) => {
      state.loadingUser = false;
      console.log(' extraReducers action.payload: ', action.payload);
      state.user = action.payload;
    });

    builder.addCase(edit_user_profile.pending, state => {
      state.loadingUser = true;
    });
    builder.addCase(edit_user_profile.rejected, state => {
      state.loadingUser = false;
    });
    builder.addCase(edit_user_profile.fulfilled, (state, action) => {
      state.loadingUser = false;
      console.log(' extraReducers action.payload: ', action.payload);
      const mergedData = {
        ...state.user,
        ...action.payload,
      };

      state.user = mergedData;
    });

    builder.addCase(get_industry_api.pending, state => {
      // state.loadingUser = true;
    });
    builder.addCase(get_industry_api.rejected, state => {
      state.loadingUser = false;
    });
    builder.addCase(get_industry_api.fulfilled, (state, action) => {
      state.loadingUser = false;
      console.log(' extraReducers action.payload: ', action.payload);
      const filtered = action.payload.filter(item => item.status === 1);
      state.industryList = filtered;
    });

    builder.addCase(get_interests_api.pending, state => {
      // state.loadingUser = true;
    });
    builder.addCase(get_interests_api.rejected, state => {
      state.loadingUser = false;
    });
    builder.addCase(get_interests_api.fulfilled, (state, action) => {
      state.loadingUser = false;
      console.log(' extraReducers action.payload: ', action.payload);
      const filtered = action.payload.filter(item => item.status === 1);
      state.interestsList = filtered;
    });
  },
});

export const {
  logout,
  updateUser,
  setAppLangauage,
  setUserData,
  setOnBoarding,
  setShowTutorial,
  setNewNotification,
} = authSlice.actions;
export default authSlice.reducer;
