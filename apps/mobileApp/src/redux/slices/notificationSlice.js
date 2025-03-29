import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from '../../services/API';
import {setLoading} from './loadingSlice';
import {showToast} from '../../components/Toast';
import {setUserData} from './authSlice';

const initialState = {
  notificationsList: [],
};

export const get_notifications = createAsyncThunk(
  '/api/profile/getNotifications',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    console.log(getState()?.auth?.user);
    const authData = getState()?.auth?.user;

    try {
      dispatch(setLoading(true));
      const response = await API({
        // headers: {
        //   // 'Content-Type': 'multipart/form-data',
        // },
        route: `profile/getNotifications`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'get_notifications_response=>>',
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

export const accept_decline_request = createAsyncThunk(
  '/api/profile/acceptDeclineConnectRequest',
  async (credentials, {rejectWithValue, dispatch, getState}) => {
    console.log(getState()?.auth?.user);
    const authData = getState()?.auth?.user;

    try {
      dispatch(setLoading(true));
      const response = await API({
        // headers: {
        //   // 'Content-Type': 'multipart/form-data',
        // },
        route: `profile/acceptDeclineConnectRequest`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'get_notifications_response=>>',
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

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notificationsList = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(get_notifications.pending, state => {
      state.loadingUser = true;
    });
    builder.addCase(get_notifications.rejected, state => {
      state.loadingUser = false;
    });
    builder.addCase(get_notifications.fulfilled, (state, action) => {
      state.loadingUser = false;
      console.log('getNotificationststates', action.payload);
      state.notificationsList = action.payload;
    });
  },
});

export const {setNotifications} = notificationSlice.actions;
// export const userAvailability = state => state.profile.availability;
export default notificationSlice.reducer;
