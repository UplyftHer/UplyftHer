import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from '../../services/API';
import {setLoading} from './loadingSlice';
import {showToast} from '../../components/Toast';
import {setUserData} from './authSlice';
import {navigationContainerRef} from '../../../App';

const initialState = {
  savedProfile: [],
  previousInteractedMatches: [],
};
export const manageAvailability = createAsyncThunk(
  '/api/profile/availibiltyNewMatches',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/availibiltyNewMatches`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'manageAvailability_response=>>',
        JSON.stringify(response?.data),
      );
      console.log(
        'manageAvailability_responses=>>',
        JSON.stringify(response?.status),
      );
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

export const communicationPreference = createAsyncThunk(
  '/api/profile/communicationPreferences',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    const authData = getState()?.auth?.user;
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/communicationPreferences`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'communicationPreference_response=>>',
        JSON.stringify(response?.data),
      );
      console.log(
        'communicationPreference_responses=>>',
        JSON.stringify(response?.status),
      );
      showToast(response?.data?.status, response?.data?.message);
      if (response.data.status === 1) {
        dispatch(setUserData({...authData, ...response.data.data}));
      }
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
export const getSingleUserData = createAsyncThunk(
  '/api/profile/getProfile',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    console.log(getState()?.auth?.user);
    const authData = getState()?.auth?.user;

    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          // 'Content-Type': 'multipart/form-data',
        },
        route: `profile/getProfile`,
        body: {},
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'getSingleUserData_response=>>',
        JSON.stringify(response?.data),
      );
      console.log(
        'getSingleUserData_responses=>>',
        JSON.stringify(response?.status),
      );

      if (response.data.status === 1) {
        dispatch(setUserData({...authData, ...response.data.data}));
      }
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

export const get_my_availability = createAsyncThunk(
  '/api/profile/myAvailibilty',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    console.log(getState()?.auth?.user);
    const authData = getState()?.auth?.user;

    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          // 'Content-Type': 'multipart/form-data',
        },
        route: `profile/myAvailibilty`,
        body: {},
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'get_my_availability_response=>>',
        JSON.stringify(response?.data),
      );

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
export const get_matching_profile = createAsyncThunk(
  '/api/profile/getMatchingProfile',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    console.log(getState()?.auth?.user);
    const authData = getState()?.auth?.user;

    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          // 'Content-Type': 'multipart/form-data',
        },
        route: `profile/getMatchingProfile`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'getMatchingProfile_response=>>',
        JSON.stringify(response?.data),
      );

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
export const saved_profile = createAsyncThunk(
  '/api/profile/saveProfile',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    console.log(getState()?.auth?.user);
    const authData = getState()?.auth?.user;

    try {
      dispatch(setLoading(true));
      const response = await API({
        // headers: {
        //   // 'Content-Type': 'multipart/form-data',
        // },
        route: `profile/saveProfile`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('saved_Profile_response=>>', JSON.stringify(response?.data));

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
export const get_saved_profile = createAsyncThunk(
  '/api/profile/getSavedProfile',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    console.log(getState()?.auth?.user);
    const authData = getState()?.auth?.user;

    try {
      dispatch(setLoading(true));
      const response = await API({
        // headers: {
        //   // 'Content-Type': 'multipart/form-data',
        // },
        route: `profile/getSavedProfile`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'get_saved_Profiles_response=>>',
        JSON.stringify(response?.data),
      );

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
export const send_connect_request = createAsyncThunk(
  'api/profile/sendConnectRequest',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    console.log(getState()?.auth?.user);
    const authData = getState()?.auth?.user;

    try {
      dispatch(setLoading(true));
      const response = await API({
        route: `profile/sendConnectRequest`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'send_connect_request_response=>>',
        JSON.stringify(response?.data),
      );
      if (response?.data?.status === 1) {
        showToast(1, 'Request sent successfully!');
      } else if (response?.data?.status === 0) {
        showToast(0, response?.data?.message);
      }
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

export const send_unconnect_request = createAsyncThunk(
  'api/profile/sendUnConnectRequest',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    console.log(getState()?.auth?.user);
    const authData = getState()?.auth?.user;

    try {
      dispatch(setLoading(true));
      const response = await API({
        route: `profile/sendUnConnectRequest`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'send_connect_request_response=>>',
        JSON.stringify(response?.data),
      );
      // if (response?.data?.status === 1) {
      //   showToast(1, 'Request sent successfully!');
      // } else if (response?.data?.status === 0) {
      showToast(response?.data?.status, response?.data?.message);
      // }
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

export const change_user_password = createAsyncThunk(
  'api/profile/changePassword',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    console.log(getState()?.auth?.user);
    const authData = getState()?.auth?.user;

    try {
      dispatch(setLoading(true));
      const response = await API({
        // headers: {
        //   // 'Content-Type': 'multipart/form-data',
        // },
        route: `profile/changePassword`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('changePassword_response=>>', JSON.stringify(response?.data));
      if (response?.data?.status === 1) {
        showToast(1, response?.data?.message);
        navigationContainerRef?.goBack();
      } else {
        showToast(0, response?.data?.message);
      }
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

export const get_previous_interacted_matches = createAsyncThunk(
  '/api/profile/getPreviouslyInteracted',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/getPreviouslyInteracted`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'getPreviouslyInteracted_response=>>',
        JSON.stringify(response?.data),
      );
      console.log(
        'getPreviouslyInteracted_responses=>>',
        JSON.stringify(response?.status),
      );
      // showToast(response?.data?.status, response?.data?.message);
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

export const add_Availability = createAsyncThunk(
  'User/addAvailibilty',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    const authState = getState()?.auth;

    console.log('add_Availability_api_credentials', credentials);
    try {
      dispatch(setLoading(true));

      const response = await API({
        headers: {
          'Content-Type': 'application/json',
        },
        route: 'profile/addAvailibilty',
        body: credentials,
        method: 'POST',
      });

      dispatch(setLoading(false));
      showToast(response?.data?.status, response?.data?.message);

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

export const delete_Availability_forDay = createAsyncThunk(
  'User/deleteAvailibiltyForDay',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    const authState = getState()?.auth;

    console.log('add_Availability_api_credentials', credentials);
    try {
      dispatch(setLoading(true));

      const response = await API({
        headers: {
          'Content-Type': 'application/json',
        },
        route: 'profile/deleteAvailibiltyForDay',
        body: credentials,
        method: 'POST',
      });

      dispatch(setLoading(false));
      showToast(response?.data?.status, response?.data?.message);

      if (response?.data?.status !== 1) {
        return rejectWithValue(response?.data);
      }
      console.log('response?.data?.data', response?.data?.data);

      return response?.data?.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log('deleteAvailibiltyForDay_error==>', error?.message);
      if (error?.message === 'Network Error') {
        showToast(0, validationError[error?.message]);
      }

      showToast(0, validationError[error.response.data?.message]);

      return rejectWithValue(error.response.data);
    }
  },
);

export const delete_Availability_forSlots = createAsyncThunk(
  'User/deleteAvailibilty',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    const authState = getState()?.auth;

    console.log('add_Availability_api_credentials', credentials);
    try {
      dispatch(setLoading(true));

      const response = await API({
        headers: {
          'Content-Type': 'application/json',
        },
        route: 'profile/deleteAvailibilty',
        body: credentials,
        method: 'POST',
      });

      dispatch(setLoading(false));
      showToast(response?.data?.status, response?.data?.message);

      if (response?.data?.status !== 1) {
        return rejectWithValue(response?.data);
      }
      console.log('response?.data?.data', response?.data?.data);

      return response?.data?.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log('deleteAvailibilty_error==>', error?.message);
      if (error?.message === 'Network Error') {
        showToast(0, validationError[error?.message]);
      }

      showToast(0, validationError[error.response.data?.message]);

      return rejectWithValue(error.response.data);
    }
  },
);

export const contact_us = createAsyncThunk(
  'User/contactUs',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    const authState = getState()?.auth;

    console.log('add_Availability_api_credentials', credentials);
    try {
      dispatch(setLoading(true));

      const response = await API({
        headers: {
          'Content-Type': 'application/json',
        },
        route: 'profile/contactUs',
        body: credentials,
        method: 'POST',
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
      console.log('contactUs_error==>', error?.message);
      if (error?.message === 'Network Error') {
        showToast(0, validationError[error?.message]);
      }

      showToast(0, validationError[error.response.data?.message]);

      return rejectWithValue(error.response.data);
    }
  },
);
export const get_users_feedback = createAsyncThunk(
  'User/getFeedbackDetails',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    const authState = getState()?.auth;

    console.log('add_Availability_api_credentials', credentials);
    try {
      dispatch(setLoading(true));

      const response = await API({
        headers: {
          'Content-Type': 'application/json',
        },
        route: 'profile/getFeedbackDetails',
        body: credentials,
        method: 'POST',
      });

      dispatch(setLoading(false));
      // showToast(response?.data?.status, response?.data?.message);
      console.log(
        'getFeedbackDetails_response=>>',
        JSON.stringify(response?.data),
      );
      if (response?.data?.status !== 1) {
        return rejectWithValue(response?.data);
      }

      return response?.data?.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log('getFeedbackDetails_error==>', error?.message);
      if (error?.message === 'Network Error') {
        showToast(0, validationError[error?.message]);
      }

      showToast(0, validationError[error.response.data?.message]);

      return rejectWithValue(error.response.data);
    }
  },
);

export const block_unblock_user = createAsyncThunk(
  'User/blockUser',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    console.log('add_Availability_api_credentials', credentials);
    try {
      dispatch(setLoading(true));

      const response = await API({
        headers: {
          'Content-Type': 'application/json',
        },
        route: 'profile/blockUser',
        body: credentials,
        method: 'POST',
      });

      dispatch(setLoading(false));
      console.log('blockUser_response=>>', JSON.stringify(response?.data));
      if (response?.data?.status !== 1) {
        return rejectWithValue(response?.data);
      }

      return response?.data?.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log('blockUser_error==>', error?.message);
      if (error?.message === 'Network Error') {
        showToast(0, validationError[error?.message]);
      }

      showToast(0, validationError[error.response.data?.message]);

      return rejectWithValue(error.response.data);
    }
  },
);

export const delete_user_account = createAsyncThunk(
  'api/profile/deleteUser',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    console.log(getState()?.auth?.user);
    const authData = getState()?.auth?.user;

    try {
      dispatch(setLoading(true));
      const response = await API({
        // headers: {
        //   // 'Content-Type': 'multipart/form-data',
        // },
        route: `profile/deleteUser`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('deleteUser_response=>>', JSON.stringify(response?.data));
      if (response?.data?.status === 1) {
        showToast(1, response?.data?.message);
      } else {
        showToast(0, response?.data?.message);
      }
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

export const edit_user_email = createAsyncThunk(
  'api/profile/editEmail',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    console.log(getState()?.auth?.user);
    const authData = getState()?.auth?.user;

    try {
      dispatch(setLoading(true));
      const response = await API({
        route: `profile/editEmail`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('editEmail_response=>>', JSON.stringify(response?.data));
      if (response?.data?.status === 1) {
        showToast(1, response?.data?.message);
      } else {
        showToast(0, response?.data?.message);
      }
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

export const verify_edit_user_email = createAsyncThunk(
  'api/profile/confirmNewEmail',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    console.log(getState()?.auth?.user);
    const authData = getState()?.auth?.user;

    try {
      dispatch(setLoading(true));
      const response = await API({
        route: `profile/confirmNewEmail`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'confirmNewEmail_response=>>',
        JSON.stringify(response?.data),
      );
      if (response?.data?.status === 1) {
        showToast(1, response?.data?.message);
        dispatch(setUserData({...authData, ...response.data.data}));
      } else {
        showToast(0, response?.data?.message);
      }
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

export const get_company_names = createAsyncThunk(
  'auth/getOrganizations',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    console.log(getState()?.auth?.user);
    const authData = getState()?.auth?.user;

    try {
      dispatch(setLoading(true));
      const response = await API({
        route: `auth/getOrganizations`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('auth/getOrganizations=>>', JSON.stringify(response?.data));
      if (response?.data?.status === 1) {
        showToast(1, response?.data?.message);
      } else {
        showToast(0, response?.data?.message);
      }
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

export const get_users_detail = createAsyncThunk(
  'profile/getUserProfile',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    const authState = getState()?.auth;

    console.log('add_Availability_api_credentials', credentials);
    try {
      dispatch(setLoading(true));

      const response = await API({
        headers: {
          'Content-Type': 'application/json',
        },
        route: 'profile/getUserProfile',
        body: credentials,
        method: 'POST',
      });

      dispatch(setLoading(false));
      console.log('getUserProfile_response=>>', JSON.stringify(response?.data));
      if (response?.data?.status !== 1) {
        return rejectWithValue(response?.data);
      }

      return response?.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log('getUserProfile_error==>', error?.message);
      if (error?.message === 'Network Error') {
        showToast(0, validationError[error?.message]);
      }

      showToast(0, validationError[error.response.data?.message]);

      return rejectWithValue(error.response.data);
    }
  },
);

export const get_content_detail = createAsyncThunk(
  'admin/get-admin-content',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    const authState = getState()?.auth;

    try {
      dispatch(setLoading(true));

      const response = await API({
        headers: {
          'Content-Type': 'application/json',
        },
        route: 'admin/get-admin-content',
        body: credentials,
        method: 'POST',
      });

      dispatch(setLoading(false));
      console.log('content_response=>>', JSON.stringify(response?.data));
      if (response?.data?.status !== 1) {
        return rejectWithValue(response?.data);
      }

      return response?.data;
    } catch (error) {
      dispatch(setLoading(false));
      console.log('content_error==>', error?.message);
      if (error?.message === 'Network Error') {
        showToast(0, validationError[error?.message]);
      }

      showToast(0, validationError[error.response.data?.message]);

      return rejectWithValue(error.response.data);
    }
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setSavedProfile: (state, action) => {
      state.savedProfile = action.payload;
    },
    setPreviousInteractedMatches: (state, action) => {
      state.previousInteractedMatches = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(get_saved_profile.pending, state => {
      state.loadingUser = true;
    });
    builder.addCase(get_saved_profile.rejected, state => {
      state.loadingUser = false;
    });
    builder.addCase(get_saved_profile.fulfilled, (state, action) => {
      state.loadingUser = false;
      console.log('savedProfilestates', action.payload);
      state.savedProfile = action.payload;
    });
    builder.addCase(get_previous_interacted_matches.pending, state => {
      state.loadingUser = true;
    });
    builder.addCase(get_previous_interacted_matches.rejected, state => {
      state.loadingUser = false;
    });
    builder.addCase(
      get_previous_interacted_matches.fulfilled,
      (state, action) => {
        state.loadingUser = false;
        console.log('previousInteractedMatches=>>>', action.payload);
        state.previousInteractedMatches = action.payload;
      },
    );
  },
});

export const {setSavedProfile, setPreviousInteractedMatches} =
  profileSlice.actions;
// export const userAvailability = state => state.profile.availability;
export default profileSlice.reducer;
