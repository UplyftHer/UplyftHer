import API from '../../services/API';
import {setLoading} from './loadingSlice';
import {showToast} from '../../components/Toast';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export const send_user_message = createAsyncThunk(
  '/api/profile/sendMessage',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      // dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/sendMessage`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('sendMessage_response=>>', JSON.stringify(response?.data));
      console.log('sendMessage_responses=>>', JSON.stringify(response?.status));
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

export const edit_user_message = createAsyncThunk(
  '/api/profile/editMessage',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      // dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/editMessage`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('editMessage_response=>>', JSON.stringify(response?.data));
      console.log('editMessage_responses=>>', JSON.stringify(response?.status));
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
