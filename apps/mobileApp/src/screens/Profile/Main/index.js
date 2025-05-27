import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef} from 'react';
import {Images} from '../../../utils';
import GText from '../../../components/GText';
import GradientButton from '../../../components/GradientButton';
import {styles} from './styles';
import {
  logout,
  logout_user,
  setOnBoarding,
  setUserData,
} from '../../../redux/slices/authSlice';
import BottomSheet from '../../../components/BottomSheet';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setNotifications} from '../../../redux/slices/notificationSlice';
import GImage from '../../../components/GImage';
import {setUpComingMeetingList} from '../../../redux/slices/bookMeetingSlice';
import {
  delete_user_account,
  setPreviousInteractedMatches,
  setSavedProfile,
} from '../../../redux/slices/profileSlice';
import useMatchingProfiles from '../../../hooks/useMatchingProfiles';
import {
  ABOUT_US,
  PRIVACY_POLICY_URL,
  TERMS_CONDITIONS_URL,
} from '../../../constants';
import OptionMenuSheet from '../../../components/OptionMenuSheet';
import {colors} from '../../../../assets/colors';

const Profile = ({navigation}) => {
  const logoutRBSheetRef = useRef();
  const userData = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const refRBReasonsSheet = useRef();
  const {setMatchingProfileData} = useMatchingProfiles();
  const arrList = [
    userData?.userType === 1
      ? {
          id: 1,
          title: 'Manage Availability',
          icon: Images.Manage,
        }
      : {},
    userData?.registerWith === 0
      ? {
          id: 2,
          title: 'Change Password',
          icon: Images.asterisk,
        }
      : {},
    {
      id: 3,
      title: 'Invitation Code',
      icon: Images.codeIcon,
    },
    // {
    //   id: 4,
    //   title: 'FAQs',
    //   icon: Images.FAQ,
    // },
    {
      id: 15,
      title: 'Blocked Users',
      icon: Images.BlockedUser,
    },
    {
      id: 5,
      title: 'About Us',
      icon: Images.About_us,
    },
    {
      id: 6,
      title: 'Terms and Conditions',
      icon: Images.Terms,
    },
    {
      id: 7,
      title: 'Privacy Policy',
      icon: Images.Policy,
    },
    {
      id: 8,
      title: 'Contact Us',
      icon: Images.Contact_us,
    },
    {
      id: 9,
      title: 'Delete Account',
      icon: Images.DeleteAccount,
    },
  ];
  const navigateFunction = index => {
    if (index === 0) {
      navigation.navigate('StackScreens', {screen: 'ManageAvailability'});
    } else if (index === 1) {
      navigation.navigate('StackScreens', {screen: 'ChangePassword'});
    } else if (index === 2) {
      navigation.navigate('StackScreens', {screen: 'InvitationCode'});
    } else if (index === 7) {
      navigation.navigate('StackScreens', {screen: 'ContactUs'});
    } else if (index === 3) {
      navigation.navigate('StackScreens', {screen: 'BlockedUsers'});
    } else if (index === 4) {
      navigation.navigate('StackScreens', {
        screen: 'TermsPrivacy',
        params: {
          url: ABOUT_US,
          screen: 'About Us',
          type: 'about',
        },
      });
    } else if (index === 5) {
      navigation.navigate('StackScreens', {
        screen: 'TermsPrivacy',
        params: {
          url: TERMS_CONDITIONS_URL,
          screen: 'Terms and Conditions',
          type: 'terms',
        },
      });
    } else if (index === 6) {
      navigation.navigate('StackScreens', {
        screen: 'TermsPrivacy',
        params: {
          url: PRIVACY_POLICY_URL,
          screen: 'Privacy Policy',
          type: 'privacy',
        },
      });
    } else if (index === 8) {
      refRBReasonsSheet?.current?.open();
    }
  };

  const OptionItem = ({item, isLast, index}) => {
    return (
      <>
        {item?.id && (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigateFunction(index)}
              style={styles.optionItem}>
              <View style={styles.optionLeft}>
                <Image source={item?.icon} style={styles.optionIcon} />
                <GText semiBold text={item?.title} style={styles.optionText} />
              </View>
              <Image source={Images.RightArrow} style={styles.arrowIcon} />
            </TouchableOpacity>
            {!isLast && <View style={styles.divider} />}
          </>
        )}
      </>
    );
  };

  const deleteAccount = reason => {
    refRBReasonsSheet?.current?.close();
    const api_credentials = {
      reason: reason,
    };

    dispatch(delete_user_account(api_credentials)).then(res => {
      if (delete_user_account.fulfilled.match(res)) {
        dispatch(logout());
        dispatch(setNotifications([]));
        dispatch(setUpComingMeetingList([]));
        dispatch(setSavedProfile([]));
        dispatch(setPreviousInteractedMatches([]));
        setMatchingProfileData([]);
      }
    });
  };

  // const deleteAccountReasons = [
  //   {
  //     id: 1,
  //     title: 'Lack of relevant mentors or mentees',
  //     textColor: colors.themeColor,
  //     action: () => {
  //       Alert.alert(
  //         'Delete account!',
  //         'Are you sure you want to delete your account? This will permanently erase your account and information.',
  //         [
  //           {
  //             text: "Yes! I'm",
  //             onPress: async () => {
  //               deleteAccount('Lack of relevant mentors or mentees');
  //             },
  //             style: 'destructive',
  //           },
  //           {
  //             text: 'No',
  //             onPress: () => console.log('Cancel Pressed'),
  //             style: 'cancel',
  //           },
  //         ],
  //         {
  //           cancelable: false,
  //         },
  //       );
  //       // deleteAccount('Lack of relevant mentors or mentees');
  //     },
  //   },
  //   {
  //     id: 2,
  //     title: 'Poor matchmaking or compatibility issues',
  //     textColor: colors.themeColor,
  //     action: () => deleteAccount('Poor matchmaking or compatibility issues'),
  //   },
  //   {
  //     id: 3,
  //     title: 'Limited communication features',
  //     textColor: colors.themeColor,
  //     action: () => deleteAccount('Limited communication features'),
  //   },
  //   {
  //     id: 4,
  //     title: 'Inactive or unresponsive users',
  //     textColor: colors.themeColor,
  //     action: () => deleteAccount('Inactive or unresponsive users'),
  //   },
  //   {
  //     id: 5,
  //     title: 'Privacy concerns regarding personal information',
  //     textColor: colors.themeColor,
  //     action: () =>
  //       deleteAccount('Privacy concerns regarding personal information'),
  //   },
  //   {
  //     id: 6,
  //     title: 'Lack of progress or value from mentorship',
  //     textColor: colors.themeColor,
  //     action: () => deleteAccount('Lack of progress or value from mentorship'),
  //   },
  //   {
  //     id: 7,
  //     title: 'Difficulty in scheduling sessions',
  //     textColor: colors.themeColor,
  //     action: () => deleteAccount('Difficulty in scheduling sessions'),
  //   },
  //   {
  //     id: 8,
  //     title: 'Poor user experience or app performance',
  //     textColor: colors.themeColor,
  //     action: () => deleteAccount('Poor user experience or app performance'),
  //   },
  // ];

  const confirmDelete = reason => {
    Alert.alert(
      'Delete account!',
      'Are you sure you want to delete your account? This will permanently erase your account and information.',
      [
        {
          text: "Yes! I'm",
          onPress: async () => {
            deleteAccount(reason);
          },
          style: 'destructive',
        },
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  const deleteAccountReasons = [
    {
      id: 1,
      title: 'Lack of relevant mentors or mentees',
      textColor: colors.themeColor,
      action: () => confirmDelete('Lack of relevant mentors or mentees'),
    },
    {
      id: 2,
      title: 'Poor matchmaking or compatibility issues',
      textColor: colors.themeColor,
      action: () => confirmDelete('Poor matchmaking or compatibility issues'),
    },
    {
      id: 3,
      title: 'Limited communication features',
      textColor: colors.themeColor,
      action: () => confirmDelete('Limited communication features'),
    },
    {
      id: 4,
      title: 'Inactive or unresponsive users',
      textColor: colors.themeColor,
      action: () => confirmDelete('Inactive or unresponsive users'),
    },
    {
      id: 5,
      title: 'Privacy concerns regarding personal information',
      textColor: colors.themeColor,
      action: () =>
        confirmDelete('Privacy concerns regarding personal information'),
    },
    {
      id: 6,
      title: 'Lack of progress or value from mentorship',
      textColor: colors.themeColor,
      action: () => confirmDelete('Lack of progress or value from mentorship'),
    },
    {
      id: 7,
      title: 'Difficulty in scheduling sessions',
      textColor: colors.themeColor,
      action: () => confirmDelete('Difficulty in scheduling sessions'),
    },
    {
      id: 8,
      title: 'Poor user experience or app performance',
      textColor: colors.themeColor,
      action: () => confirmDelete('Poor user experience or app performance'),
    },
  ];

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      style={styles.scrollView}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={Images.profile_background}
        style={styles.imageBackground}>
        <View style={styles.profileImageWrapper}>
          <GImage image={userData?.profilePic} style={styles.profileImage} />
        </View>
      </ImageBackground>
      <GText medium text={userData?.fullName} style={styles.profileName} />
      <GText
        beVietnamRegular
        text={userData?.email}
        style={styles.profileEmail}
      />
      <GradientButton
        onPress={() => {
          navigation?.navigate('StackScreens', {
            screen: 'EditProfile',
          });
        }}
        title={'Edit Profile'}
        textstyle={styles.editProfileText}
        gradientstyle={styles.editProfileButton}
      />
      <View style={styles.optionsList}>
        {arrList.map((item, index) => (
          <OptionItem
            key={item.id}
            index={index}
            item={item}
            isLast={item.id === arrList[arrList.length - 1].id}
          />
        ))}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            logoutRBSheetRef.current.open();
          }}
          style={styles.logoutButton}>
          <Image source={Images.Logout} style={styles.logoutIcon} />
          <GText semiBold text={'Logout'} style={styles.logoutText} />
        </TouchableOpacity>
      </View>
      <BottomSheet
        logoutRBSheetRef={logoutRBSheetRef}
        contentText={
          'You are about to logout from the UplyftHer. Please confirm to continue.'
        }
        headerText={'Are you sure?'}
        firstButtonTitle={'Cancel'}
        secondButtonTitle={'Logout'}
        onPress={async () => {
          logoutRBSheetRef?.current?.close();
          // dispatch(logout());
          setTimeout(async () => {
            dispatch(
              logout_user({
                deviceToken: (await AsyncStorage.getItem('fcmToken')) || '1234',
              }),
            ).then(res => {
              if (logout_user.fulfilled.match(res)) {
                dispatch(setNotifications([]));
                dispatch(setUpComingMeetingList([]));
                dispatch(setSavedProfile([]));
                dispatch(setPreviousInteractedMatches([]));
                setMatchingProfileData([]);
              }
            });
          }, 300);
        }}
      />
      <OptionMenuSheet
        refRBSheet={refRBReasonsSheet}
        options={deleteAccountReasons}
        title={'Select Reason'}
        onChoose={val => {
          val.action();
          refRBReasonsSheet.current.close();
        }}
        onPressCancel={() => refRBReasonsSheet.current.close()}
      />
    </ScrollView>
  );
};

export default Profile;
