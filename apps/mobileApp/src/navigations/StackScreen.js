import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import getScreenOptions from '../helpers/screenOptions';
import ProfileScreen from '../screens/Home/ProfileScreen';
import MatchScreen from '../screens/Home/MatchScreen';
import Conversations from '../screens/Home/Conversations';
import BookSession from '../screens/Home/BookSession';
import ChatScreen from '../screens/Home/ChatScreen';
import MeetingConfirmed from '../screens/Home/MeetingConfirmed';
import BookMeeting from '../screens/Home/BookMeeting';
import FeedbackScreen from '../screens/Home/FeedbackScreen';
import SessionLocked from '../screens/Home/SessionLocked';
import EditProfile from '../screens/Profile/EditProfile';
import ManageAvailability from '../screens/Profile/ManageAvailability';
import ChangePassword from '../screens/Profile/ChangePassword';
import ReviewAndFeedback from '../screens/Meetings/ReviewAndFeedback';
import ContactUs from '../screens/Profile/ContactUs';
import SavedProfiles from '../screens/Home/SavedProfiles';
import NotificationScreen from '../screens/Home/NotificationScreen';
import SearchScreen from '../screens/Home/SearchScreen';
import InvitationCode from '../screens/Profile/InvitationCode';
import Inbox from '../screens/Inbox/Main';
import UpComingMeetings from '../screens/Home/DashboardScreen/UpComingMeetings';
import TermsPrivacy from '../screens/Profile/TermsPrivacy';
import PublicReviewScreen from '../screens/Home/PublicReviewScreen';
import BlockedUsers from '../screens/Profile/BlockedUsers';
import ChangeEmail from '../screens/Profile/EditProfile/ChangeEmail';
import VerifyEditEMail from '../screens/Profile/EditProfile/VerifyUpdateEmail';

const screens = [
  {
    name: 'BookMeeting',
    component: BookMeeting,
    title: '',
    headerBackVisible: false,
  },
  {
    name: 'ProfileScreen',
    component: ProfileScreen,
    title: '',
    headerShown: false,
  },
  {name: 'MatchScreen', component: MatchScreen, title: '', headerShown: false},
  {name: 'ChatScreen', component: ChatScreen, title: '', headerShown: false},
  {
    name: 'Conversations',
    component: Conversations,
    title: '',
    headerShown: false,
  },
  {
    name: 'BookSession',
    component: BookSession,
    title: '',
    headerShown: false,
  },
  {
    name: 'MeetingConfirmed',
    component: MeetingConfirmed,
    title: '',
    headerShown: false,
  },
  {
    name: 'FeedbackScreen',
    component: FeedbackScreen,
    title: '',
    headerShown: false,
  },
  {
    name: 'SessionLocked',
    component: SessionLocked,
    title: '',
    headerShown: false,
  },
  {
    name: 'EditProfile',
    component: EditProfile,
    title: '',
  },
  {
    name: 'ManageAvailability',
    component: ManageAvailability,

    title: '',
  },
  {
    name: 'ChangePassword',
    component: ChangePassword,

    title: '',
  },
  {
    name: 'ReviewAndFeedback',
    component: ReviewAndFeedback,
    headerShown: false,

    title: '',
  },
  {
    name: 'ContactUs',
    component: ContactUs,

    title: '',
  },
  {
    name: 'SavedProfiles',
    component: SavedProfiles,
    title: '',
  },

  {
    name: 'UpComingMeetings',
    component: UpComingMeetings,
    title: '',
  },
  {
    name: 'NotificationScreen',
    component: NotificationScreen,
    title: '',
    headerShown: false,
  },
  {
    name: 'SearchScreen',
    component: SearchScreen,
    title: '',
    headerShown: false,
  },
  {
    name: 'InvitationCode',
    component: InvitationCode,
    title: '',
    headerShown: false,
  },
  {
    name: 'Inbox',
    component: Inbox,
    title: '',
    headerShown: false,
  },
  {
    name: 'TermsPrivacy',
    component: TermsPrivacy,
    title: '',
  },
  {
    name: 'PublicReviewScreen',
    component: PublicReviewScreen,
    title: '',
  },
  {
    name: 'BlockedUsers',
    component: BlockedUsers,
    title: 'Blocked Users',
  },
  {
    name: 'ChangeEmail',
    component: ChangeEmail,
    title: 'Change Email',
  },
  {
    name: 'VerifyEditEMail',
    component: VerifyEditEMail,
    title: 'Verify Email',
  },
];

const StackScreens = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      {screens.map(({name, component, title, headerShown}) => (
        <Stack.Screen
          key={name}
          name={name}
          component={component}
          options={props =>
            getScreenOptions({
              ...props,
              title: title || '',
              headerShown: headerShown !== undefined ? headerShown : true,
            })
          }
        />
      ))}
    </Stack.Navigator>
  );
};

export default StackScreens;
