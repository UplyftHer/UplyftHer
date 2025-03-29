import API from '../../services/API';
import {setLoading} from './loadingSlice';
import {showToast} from '../../components/Toast';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export const get_recent_matches = createAsyncThunk(
  '/api/profile/recentMatches',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/recentMatches`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('recentMatches_response=>>', JSON.stringify(response?.data));
      console.log(
        'recentMatches_responses=>>',
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

export const get_new_conversation = createAsyncThunk(
  '/api/profile/getNewCoversations',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/getNewCoversations`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'getNewCoversations_response=>>',
        JSON.stringify(response?.data),
      );
      console.log(
        'getNewCoversations_responses=>>',
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

export const start_conversation = createAsyncThunk(
  '/api/profile/startConversation',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/startConversation`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'startConversation_response=>>',
        JSON.stringify(response?.data),
      );
      console.log(
        'getNewCoversations_responses=>>',
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

export const enable_meeting = createAsyncThunk(
  '/api/profile/enableMeeting',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/enableMeeting`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('enableMeeting_response=>>', JSON.stringify(response?.data));
      console.log(
        'getNewCoversations_responses=>>',
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

export const enable_first_session = createAsyncThunk(
  '/api/profile/enableFirstSession',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/enableFirstSession`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'enableFirstSession_response=>>',
        JSON.stringify(response?.data),
      );
      console.log(
        'getNewCoversations_responses=>>',
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
