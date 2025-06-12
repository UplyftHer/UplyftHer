import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Linking,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import {styles} from './styles';
import ProfileCard from './ProfileCard';
import UserCard from './UserCard';
import DashboardTitle from './DashboardTitle';

import {Images} from '../../../utils';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {formatDate} from '../../../utils/constant.utils';

import OptionMenuSheet from '../../../components/OptionMenuSheet';
import GText from '../../../components/GText';
import HeaderButton from '../../../components/HeaderButton';
import GImage from '../../../components/GImage';
import countriescities from '../../../../assets/countriescities.json';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';
import {
  get_previous_interacted_matches,
  get_saved_profile,
  getSingleUserData,
} from '../../../redux/slices/profileSlice';
import {
  cancel_meeting,
  end_meeting,
  get_upComing_meeting_list,
  join_meeting,
  setUpComingMeetingList,
} from '../../../redux/slices/bookMeetingSlice';

import useMatchingProfiles from '../../../hooks/useMatchingProfiles';
import Modal from 'react-native-modal';
import {colors} from '../../../../assets/colors';
import GradientButton from '../../../components/GradientButton';
import GradientBorderButton from '../../../components/GradientBorderButton';
import GOptions from '../../../components/GOptions';
import SubLocations from '../../../components/SubLocations';
import {
  edit_user_location,
  edit_user_profile,
  get_cities_api,
  setShowTutorial,
} from '../../../redux/slices/authSlice';

const DashboardScreen = ({navigation, route}) => {
  const savedProfileData = useSelector(state => state.profile.savedProfile);
  const [showModal, setShowModal] = useState(false);
  const userData = useAppSelector(state => state.auth.user);
  const newNotification = useAppSelector(state => state.auth.isNewNotification);

  const [subCity, setSubCity] = useState([]);
  const [countryId, setCountryId] = useState();
  const refRBSheetCountry = useRef();
  const refRBSheetCity = useRef();
  const dispatch = useAppDispatch();
  const refRBSheet = useRef();

  const [field, setField] = useState({
    city: '',
    country: '',
  });

  const {
    matchingProfileData,
    matchingProfileRefreshData,
    matchingProfileLoading,
  } = useMatchingProfiles();
  const previousInteractedMatches = useSelector(
    state => state.profile.previousInteractedMatches,
  );
  const upComingMeetingList = useSelector(
    state => state.meetings.upComingMeetingList,
  );

  useEffect(() => {
    configureHeader();
  }, [userData, newNotification]);

  useEffect(() => {
    // dispatch(setShowTutorial(true));
    getSaved_profile_hit();

    if (matchingProfileData?.length < 1) {
      matchingProfileRefreshData({
        limit: 1000,
      });
    }
  }, []);

  const getCitiesData = item => {
    setCountryId(item?.iso2);
    const input = {
      countryId: item?.iso2,
    };

    dispatch(get_cities_api(input)).then(res => {
      if (get_cities_api.fulfilled.match(res)) {
        console.log('res.payload', JSON.stringify(res.payload));

        setSubCity(res.payload);
      }
    });
  };

  const getSaved_profile_hit = () => {
    const input = {
      offset: 0,
    };
    dispatch(getSingleUserData());
    dispatch(get_saved_profile(input));
    dispatch(get_upComing_meeting_list(input));
    dispatch(get_previous_interacted_matches(input));
  };

  const configureHeader = () => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <HeaderButton
            icon={Images.searchIcon}
            onPress={() =>
              navigation.navigate('StackScreens', {
                screen: 'SearchScreen',
              })
            }
            iconStyle={styles.headerRightIconStyle}
          />

          <HeaderButton
            icon={newNotification ? Images.bellIcon : Images.noBellIcon}
            onPress={() => {
              navigation.navigate('StackScreens', {
                screen: 'NotificationScreen',
              });
            }}
            iconStyle={styles.bellIconStyle}
          />
        </View>
      ),
      headerLeft: () => (
        <View style={styles.headerLeftView}>
          <TouchableOpacity
            hitSlop={{top: 100, bottom: 100, left: 100, right: 100}}
            onPress={() => {
              setShowModal(true);
            }}
            activeOpacity={0.8}
            style={styles.headerTextView}>
            <Image source={Images.mapPin} style={styles.headerIcons} />
            <GText
              componentProps={{
                numberOfLines: 1,
                ellipsizeMode: 'tail',
              }}
              text={`${userData?.city || userData?.location}`}
              style={styles.locationText}
            />
            <Image source={Images.arrowDown} style={styles.headerIcons} />
          </TouchableOpacity>
          <GText text="Discover" style={styles.headerText} />
        </View>
      ),
    });
  };

  const reportAsList = [
    {
      id: 1,
      title: 'Reschedule Meeting',
      textColor: '#007AFF',
      action: () => {
        navigation?.navigate('StackScreens', {
          screen: 'BookMeeting',
          params: {
            mentorData: upComingMeetingList[0]?.userdetail,
            otherUserData: {
              cognitoUserId: upComingMeetingList[0]?.userdetail?.cognitoUserId,
            },
            meetingData: upComingMeetingList[0],
          },
        });
      },
    },
    {
      id: 2,
      title: 'Cancel Meeting',
      textColor: '#FF3B30',
      action: () => {
        cancel_meeting_hit();
      },
    },
  ];

  const renderItem = ({item, index}) => {
    console.log(item);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.cardContainer(index)}
        onPress={() => {
          navigation?.navigate('StackScreens', {
            screen: 'ProfileScreen',
            params: {
              searchUserData: {
                ...item?.cognitoUserIdSave,
                isRequestSent: item?.isRequestSent,
                isMeetingEnable: item?.isMeetingEnable,
                rating: item?.rating,
                isSaved: true,
              },
              screen: 'SavedProfile',
              itemIndex: index,
              setUserListData: {},
              userListData: '',
            },
          });
        }}>
        <GImage
          image={item?.cognitoUserIdSave?.profilePic}
          style={styles.userImage}
          resizeMode="contain"
        />
        <LinearGradient
          colors={[colors.imperialPurple, colors.darkShadeImperialPurple]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.gradient}>
          <View style={[styles.userDetailsView]}>
            <View style={{flexDirection: 'row'}}>
              <GText
                beVietnamSemiBold
                text={`${item?.cognitoUserIdSave?.fullName?.split(' ')[0]}`}
                style={styles.userName}
              />
              <GText
                beVietnamSemiBold
                text={
                  item?.cognitoUserIdSave?.age
                    ? `, ${item?.cognitoUserIdSave?.age}`
                    : ''
                }
                style={styles.userName}
              />
            </View>

            <GText
              beVietnamBold
              text={
                item?.cognitoUserIdSave?.location ||
                item?.cognitoUserIdSave.city
              }
              style={styles.userLocation}
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const cancel_meeting_hit = () => {
    const input = {
      meetingId: upComingMeetingList[0]?._id,
      cognitoUserId: upComingMeetingList[0]?.userdetail?.cognitoUserId,
    };

    const filteredData = upComingMeetingList.filter(
      item => item?._id !== upComingMeetingList[0]?._id,
    );

    dispatch(cancel_meeting(input)).then(res => {
      if (cancel_meeting.fulfilled.match(res)) {
        dispatch(setUpComingMeetingList(filteredData));
      }
    });
  };

  const joinMeeting = i => {
    console.log(i);

    const input = {
      meetingId: i?._id,
      cognitoUserId: i?.userdetail?.cognitoUserId,
      date: i?.date,
      slot: i?.slot24,
    };
    console.log(input);

    dispatch(join_meeting(input)).then(res => {
      if (join_meeting.fulfilled.match(res)) {
        console.log('4564564', res.payload);

        if (res.payload?.status === 1) {
          const updatedData = upComingMeetingList?.map(item => {
            if (item._id === i?._id) {
              return {
                ...item,
                status: 1,
              };
            }
            return item;
          });

          dispatch(setUpComingMeetingList(updatedData));
          Linking.openURL(
            userData?.userType === 1
              ? res?.payload?.data?.start_url
              : res?.payload?.data?.join_url,
          );
        }
      }
    });
  };

  const endMeeting = i => {
    console.log(i);

    const input = {
      meetingId: i?._id,
      cognitoUserId: i?.userdetail?.cognitoUserId,
    };
    console.log(input);
    const filteredData = upComingMeetingList.filter(
      item => item?._id !== i?._id,
    );
    dispatch(end_meeting(input)).then(res => {
      if (end_meeting.fulfilled.match(res)) {
        if (res.payload?.status === 1) {
          dispatch(setUpComingMeetingList(filteredData));
        }
      }
    });
  };
  const edit_user_profile_hit = () => {
    const api_credential = {
      fullName: userData?.fullName,
      age: userData?.age,
      country: field?.country,
      city: field?.city,
      occupation: userData?.occupation,
      industry: userData?.industry,
      organizationName: userData?.organizationName,
      interests: JSON.stringify(userData?.interests),
      bio: userData?.bio,
      userType: userData?.userType,
      preference: JSON.stringify([
        {
          preferenceId: '1',
          type: userData?.userType === 0 ? 'mentee' : 'mentor',
        },
        {preferenceId: '2', type: userData?.industry},
        {preferenceId: '4', type: userData?.occupation},
        {preferenceId: '5', type: userData?.city + userData?.country},
      ]),
      iso2: countryId,
    };
    try {
      dispatch(edit_user_location(api_credential)).then(res => {
        if (edit_user_location.fulfilled.match(res)) {
          matchingProfileRefreshData({
            limit: 1000,
          });
        }
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <>
      <FlatList
        data={[1]}
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              matchingProfileRefreshData({
                limit: 1000,
              });
              getSaved_profile_hit();
            }}
          />
        }
        showsVerticalScrollIndicator={false}
        renderItem={() => {
          return (
            <>
              <DashboardTitle
                title="🤩 Upcoming Meetings"
                style={styles.upcomingText}
                rightText={upComingMeetingList?.length > 1 && 'View all'}
                onPress={() =>
                  navigation.navigate('StackScreens', {
                    screen: 'UpComingMeetings',
                  })
                }
              />
              {upComingMeetingList?.length > 0 ? (
                <>
                  <ProfileCard
                    meetingOnPress={() => {
                      joinMeeting(upComingMeetingList[0]);
                    }}
                    endMeetingOnPress={() => {
                      endMeeting(upComingMeetingList[0]);
                    }}
                    firstName={
                      upComingMeetingList[0]?.userdetail?.fullName.split(' ')[0]
                    }
                    item={upComingMeetingList[0]}
                    lastName={
                      upComingMeetingList[0]?.userdetail?.fullName.split(' ')[1]
                    }
                    userImage={upComingMeetingList[0]?.userdetail?.profilePic}
                    content={upComingMeetingList[0]?.meetingTitle}
                    date={`${upComingMeetingList[0]?.day}, ${formatDate(
                      upComingMeetingList[0]?.date,
                    )}`}
                    time={upComingMeetingList[0]?.slot}
                    videoImg={Images.videoCamera}
                    videoText={
                      upComingMeetingList[0]?.mode == 'videoCall'
                        ? 'Video Call'
                        : 'Audio Call'
                    }
                    onPressMenu={() => refRBSheet.current.open()}
                  />
                </>
              ) : (
                <View style={styles.meetingEmptyPlaceHolderView}>
                  <GText
                    medium
                    text={'No upcoming meetings yet'}
                    style={styles.emptyPlaceHolderText}
                  />
                  <GText
                    text={
                      'Schedule a meeting with your mentor or mentee to connect.'
                    }
                    style={styles.emptyPlaceHolderDescription}
                  />
                </View>
              )}

              <DashboardTitle
                title="Matching your Profile ✨"
                style={styles.matchingProfileHeader}
              />
              {matchingProfileLoading ? (
                <GText
                  text={'Loading matching profiles...'}
                  style={styles.loadingProfilesText}
                />
              ) : matchingProfileData?.length > 0 ? (
                <>
                  <Text style={styles.peopleSimilarInterestText}>
                    People with <Text style={styles.similarText}>similar</Text>{' '}
                    interests around you
                  </Text>
                  <View>
                    <FlatList
                      data={matchingProfileData}
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      renderItem={({item, index}) => {
                        return (
                          <UserCard
                            userDetailStyle={styles.userCardDetailStyle}
                            itemData={item}
                            userAge={item?.age}
                            userName={`${item?.fullName.split(' ')[0]}`}
                            label={`${item.matchPercentage}% Match`}
                            index={index}
                            onPress={() =>
                              navigation?.navigate('StackScreens', {
                                screen: 'ProfileScreen',
                                params: {
                                  searchUserData: {},
                                  screen: '',
                                  itemIndex: index,
                                },
                              })
                            }
                          />
                        );
                      }}
                    />
                  </View>
                </>
              ) : (
                <View style={styles.matchingProfileEmptyPlaceHolder}>
                  <GText
                    medium
                    text={'No Matching Profiles Found'}
                    style={styles.matchingEmptyPlaceHolderText}
                  />
                  <GText
                    style={styles.matchingEmptyPlaceHolderDescription}
                    text={
                      'It looks like there are no profiles that match your interests. Adjust your interests to see matching profiles or check back later for new ones.'
                    }
                  />
                </View>
              )}

              {previousInteractedMatches?.length > 0 && (
                <>
                  <DashboardTitle
                    title="Previously Interacted"
                    style={styles.previouslyInteractedText}
                  />
                  <View style={styles.userCardMainView}>
                    <FlatList
                      data={previousInteractedMatches}
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      renderItem={({item, index}) => {
                        return (
                          <UserCard
                            userAge={item?.userdetail?.age}
                            userName={`${
                              item?.userdetail?.fullName.split(' ')[0]
                            }`}
                            onPress={() =>
                              navigation?.navigate('StackScreens', {
                                screen: 'ProfileScreen',
                                params: {
                                  searchUserData: {
                                    ...item?.userdetail,
                                    isRequestSent: item?.isRequestSent,
                                    isMeetingEnable: item?.isMeetingEnable,
                                    rating: item?.rating,
                                  },
                                  screen: 'PreviousInteracted',
                                  itemIndex: index,
                                },
                              })
                            }
                            itemData={item?.userdetail}
                            location={
                              item?.userdetail?.location ||
                              item?.userdetail?.city
                            }
                            index={index}
                          />
                        );
                      }}
                    />
                  </View>
                </>
              )}

              {savedProfileData?.length > 0 && (
                <View style={styles.savedProfileView}>
                  <DashboardTitle
                    title="Saved Profiles"
                    style={styles.previouslyInteractedText}
                    rightText="View all"
                    onPress={() =>
                      navigation.navigate('StackScreens', {
                        screen: 'SavedProfiles',
                      })
                    }
                  />
                  <View>
                    <FlatList
                      data={savedProfileData}
                      renderItem={renderItem}
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      contentContainerStyle={{
                        columnGap: scaledValue(16),
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                </View>
              )}
            </>
          );
        }}
      />
      <Modal isVisible={showModal} onBackdropPress={() => setShowModal(false)}>
        <View
          style={{
            width: '95%',
            paddingVertical: scaledValue(20),
            backgroundColor: colors.offWhite,
            alignSelf: 'center',
            borderRadius: scaledValue(8),
            paddingHorizontal: scaledValue(20),
          }}>
          <GText
            text={'Select Location'}
            style={{
              // textAlign: 'center',
              lineHeight: scaledHeightValue(19.08),
              fontSize: scaledValue(16),
            }}
          />
          <TouchableOpacity
            onPress={() => {
              refRBSheetCountry?.current?.open();
            }}
            style={{
              borderWidth: field?.country ? scaledValue(1) : scaledValue(0.5),
              borderColor: '#312943',
              height: scaledValue(48),
              borderRadius: scaledValue(12),
              justifyContent: 'space-between',
              paddingHorizontal: scaledValue(15),
              marginBottom: scaledValue(16),
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: scaledValue(12),
            }}>
            <GText
              beVietnamRegular
              componentProps={{numberOfLines: 1, ellipsizeMode: 'tail'}}
              text={field?.country || 'Select Country'}
              style={styles.organizationText}
            />
            <Image source={Images.downArrow} style={styles.rightIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              refRBSheetCity?.current?.open();
            }}
            style={{
              borderWidth: field?.city ? scaledValue(1) : scaledValue(0.5),
              borderColor: '#312943',
              height: scaledValue(48),
              borderRadius: scaledValue(12),
              justifyContent: 'space-between',
              paddingHorizontal: scaledValue(15),
              marginBottom: scaledValue(16),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <GText
              beVietnamRegular
              componentProps={{numberOfLines: 1, ellipsizeMode: 'tail'}}
              text={field?.city || 'Select City'}
              style={styles.organizationText}
            />
            <Image source={Images.downArrow} style={styles.rightIcon} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              gap: scaledValue(20),
              paddingTop: scaledValue(20),
            }}>
            <GradientButton
              gradientColor={['#DA7575', '#A45EB0']}
              title={'Confirm'}
              gradientstyle={{
                height: scaledValue(35),
              }}
              textstyle={{
                fontSize: scaledValue(14),
                letterSpacing: scaledValue(14 * -0.02),
                marginHorizontal: scaledValue(25),
              }}
              onPress={() => {
                setShowModal(false);
                setTimeout(() => {
                  edit_user_profile_hit();
                }, 300);
              }}
            />
            <GradientBorderButton
              activeOpacity={0.8}
              title={'Cancel'}
              onPress={() => {
                setShowModal(false);
              }}
              inner={{
                backgroundColor: '#FFF4EC',
                paddingHorizontal: scaledValue(25),
              }}
              buttonTextStyle={{
                lineHeight: scaledHeightValue(19),
              }}
              buttonStyle={{
                height: scaledValue(35),
              }}
            />
          </View>
        </View>
        <GOptions
          refRBSheet={refRBSheetCountry}
          title="Select Country"
          options={countriescities}
          search={true}
          onChoose={val => {
            getCitiesData(val);
            setField({...field, country: val?.name, city: ''});
            refRBSheetCountry?.current?.close();
          }}
        />
        <SubLocations
          refRBSheet={refRBSheetCity}
          title={'Select City'}
          options={subCity?.cities}
          search={true}
          onChoose={val => {
            setField({...field, city: val[0]});
            refRBSheetCity?.current?.close();
          }}
        />
      </Modal>

      <OptionMenuSheet
        refRBSheet={refRBSheet}
        options={reportAsList}
        onChoose={val => {
          val.action();
          refRBSheet.current.close();
        }}
        onPressCancel={() => refRBSheet.current.close()}
      />
    </>
  );
};

export default DashboardScreen;
