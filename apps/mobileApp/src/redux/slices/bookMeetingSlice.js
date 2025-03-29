import API from '../../services/API';
import {setLoading} from './loadingSlice';
import {showToast} from '../../components/Toast';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState = {
  upComingMeetingList: [],
};

export const get_available_slots = createAsyncThunk(
  '/api/profile/getAvailableSlots',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/getAvailableSlots`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'getAvailableSlots_response=>>',
        JSON.stringify(response?.data),
      );
      console.log(
        'getAvailableSlots_responses=>>',
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

export const get_upComing_meeting_list = createAsyncThunk(
  '/api/profile/getUpcomingMeetings',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/getUpcomingMeetings`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'getUpcomingMeetings_response=>>',
        JSON.stringify(response?.data),
      );
      console.log(
        'getUpcomingMeetings_responses=>>',
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
export const book_meeting = createAsyncThunk(
  '/api/profile/bookMeeting',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/bookMeeting`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('bookMeeting_response=>>', JSON.stringify(response?.data));
      console.log('bookMeeting_responses=>>', JSON.stringify(response?.status));
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

export const cancel_meeting = createAsyncThunk(
  '/api/profile/cancelMeeting',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/cancelMeeting`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('cancelMeeting_response=>>', JSON.stringify(response?.data));
      console.log(
        'cancelMeeting_responses=>>',
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

export const reschedule_meeting = createAsyncThunk(
  '/api/profile/editMeeting',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/editMeeting`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('editMeeting_response=>>', JSON.stringify(response?.data));
      console.log('editMeeting_responses=>>', JSON.stringify(response?.status));
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

export const delete_past_meeting = createAsyncThunk(
  '/api/profile/deletePastMeeting',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/deletePastMeeting`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log(
        'deletePastMeeting_response=>>',
        JSON.stringify(response?.data),
      );
      console.log(
        'deletePastMeeting_responses=>>',
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

export const send_user_feedback = createAsyncThunk(
  '/api/profile/sendFeedBack',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `profile/sendFeedBack`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('sendFeedBack_response=>>', JSON.stringify(response?.data));
      console.log(
        'sendFeedBack_responses=>>',
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

export const join_meeting = createAsyncThunk(
  '/api/meeting/createMeeting',
  async (credentials, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await API({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        route: `meeting/createMeeting`,
        body: credentials,
        method: 'POST',
      });
      dispatch(setLoading(false));
      console.log('createMeetinge=>>', JSON.stringify(response?.data));
      console.log('createMeetinges=>>', JSON.stringify(response?.status));
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

const meetingSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    setUpComingMeetingList: (state, action) => {
      state.upComingMeetingList = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(book_meeting.pending, state => {
      state.loadingUser = true;
    });
    builder.addCase(book_meeting.rejected, state => {
      state.loadingUser = false;
    });
    builder.addCase(book_meeting.fulfilled, (state, action) => {
      state.loadingUser = false;
      state.upComingMeetingList = [
        action.payload,
        ...state.upComingMeetingList,
      ];
    });

    builder.addCase(get_upComing_meeting_list.pending, state => {
      state.loadingUser = true;
    });
    builder.addCase(get_upComing_meeting_list.rejected, state => {
      state.loadingUser = false;
    });
    builder.addCase(get_upComing_meeting_list.fulfilled, (state, action) => {
      state.loadingUser = false;
      state.upComingMeetingList = action.payload;
    });
  },
});

export const {setUpComingMeetingList} = meetingSlice.actions;
// export const userAvailability = state => state.profile.availability;
export default meetingSlice.reducer;
