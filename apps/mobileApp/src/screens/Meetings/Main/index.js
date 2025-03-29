import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {styles} from './styles';
import HeaderButton from '../../../components/HeaderButton';
import {Images} from '../../../utils';
import GText from '../../../components/GText';
import Swiper from 'react-native-swiper';
import {colors} from '../../../../assets/colors';
import {scaledValue} from '../../../utils/design.utils';
import ProfileCard from '../../Home/DashboardScreen/ProfileCard';
import GradientBorderButton from '../../../components/GradientBorderButton';
import BottomSheet from '../../../components/BottomSheet';
import useDataFactory from '../../../components/UseDataFactory/useDataFactory';
import OptionMenuSheet from '../../../components/OptionMenuSheet';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  cancel_meeting,
  delete_past_meeting,
  get_upComing_meeting_list,
  join_meeting,
  setUpComingMeetingList,
} from '../../../redux/slices/bookMeetingSlice';
import GImage from '../../../components/GImage';

const Meetings = ({navigation}) => {
  const logoutRBSheetRef = useRef();
  const dispatch = useAppDispatch();
  const [scrollIndex, setScrollIndex] = useState(0);
  const swiperRef = useRef();
  const authState = useAppSelector(state => state.auth?.user);
  const [selectedMeetingToDelete, setSelectedMeetingToDelete] = useState();
  const refRBSheet = useRef();
  const upComingMeetingList = useAppSelector(
    state => state.meetings.upComingMeetingList,
  );
  console.log('upComingMeetingListupComingMeetingList', upComingMeetingList);

  useEffect(() => {
    configureHeader();
  }, []);

  const configureHeader = () => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          icon={Images.leftArrow}
          onPress={() => navigation.goBack()}
          iconStyle={styles.arrow}
        />
      ),
      headerTitle: () => (
        <GText text="Meetings" medium style={styles.headerText} />
      ),
    });
  };

  const upComingMeeting = () => {
    dispatch(
      get_upComing_meeting_list({
        offset: 0,
      }),
    );
  };

  // const {
  //   loading: loading,
  //   data: upComingLists,
  //   setData,
  //   refreshData,
  //   loadMore,
  //   Placeholder,
  //   Loader,
  // } = useDataFactory('upComingMeetingsList', true, '', 'POST');

  const {
    loading: pastMeetingLoading,
    data: pastMeetingData,
    setData: setPastMeetingData,
    refreshData: pastMeetingRefreshData,
    loadMore: pastMeetingLoadMore,
    Placeholder: pastMeetingPlaceholder,
    Loader: pastMeetingLoader,
  } = useDataFactory('PastMeetingsList', true, '', 'POST');

  const formatDate = dateString => {
    const date = new Date(dateString); // Parse the input string
    const options = {year: 'numeric', month: 'long', day: '2-digit'};
    return new Intl.DateTimeFormat('en-US', options)?.format(date);
  };

  const deleteButton = () => {
    logoutRBSheetRef.current.open();
  };

  const deletePastMeeting = () => {
    const input = {
      meetingId: selectedMeetingToDelete?._id,
    };

    dispatch(delete_past_meeting(input)).then(res => {
      if (delete_past_meeting.fulfilled.match(res)) {
        setPastMeetingData(
          pastMeetingData?.filter(i => i?._id !== selectedMeetingToDelete?._id),
        );
        setSelectedMeetingToDelete();
      }
    });
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('StackScreens', {
          screen: 'ReviewAndFeedback',
          params: {
            meetingData: item,
            pastMeetingData: pastMeetingData,
            setPastMeetingData: setPastMeetingData,
          },
        })
      }
      style={styles.flatlistMain}>
      <View style={styles.flatlistTopView}>
        <View style={{flexDirection: 'row'}}>
          <GImage
            image={item?.userdetail?.profilePic}
            style={styles.pastMeetingsImage}
          />
          <GText
            regular
            style={styles.pastMeetingsName}
            text={`${item?.userdetail?.fullName?.split(' ')[0]}\n${
              item?.userdetail?.fullName?.split(' ')[1] || ''
            }`}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            setSelectedMeetingToDelete(item);
            deleteButton();
          }}
          style={styles.trashView}>
          <Image style={styles.trashImage} source={Images.Trash} />
        </TouchableOpacity>
      </View>
      <GText medium style={styles.specialityText} text={item?.meetingTitle} />
      <View style={styles.dayView}>
        <Image style={styles.iconStyle} source={Images.greyCalendar} />
        <GText
          beVietnamMedium
          style={styles.textStyle}
          text={`${item?.day}, ${formatDate(item?.date)}`}
        />
      </View>
      <View style={styles.timeView}>
        <Image style={styles.iconStyle} source={Images.clock} />
        <GText beVietnamMedium style={styles.textStyle} text={item?.slot} />
      </View>
      <View style={styles.modeView}>
        <Image
          style={styles.iconStyle}
          tintColor={'#7E7E7E'}
          source={
            item?.mode == 'videoCall'
              ? Images.videoCamera
              : item?.mode == 'audioCall'
              ? Images.phoneFill
              : Images.cup
          }
        />
        <GText
          beVietnamMedium
          style={styles.textStyle}
          text={
            item?.mode == 'videoCall'
              ? 'Video call'
              : item?.mode == 'audioCall'
              ? 'Phone call'
              : 'In-person'
          }
        />
      </View>
      {authState?.userType === 0 && (
        <GradientBorderButton
          activeOpacity={0.8}
          title={'Book meeting'}
          buttonStyle={{marginTop: scaledValue(16)}}
          imageSource={Images.calender}
          imgStyle={{width: scaledValue(16), height: scaledValue(16)}}
          onPress={() => {
            navigation?.navigate('StackScreens', {
              screen: 'BookMeeting',
              params: {
                otherUserData: item?.userdetail,
                mentorData: item?.userdetail,
                meetingData: {},
              },
            });
          }}
          inner={{
            backgroundColor: '#FFFAFA',
          }}
          buttonTextStyle={{
            color: colors.themeColor,
          }}
        />
      )}
    </TouchableOpacity>
  );

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
        // if(res?.payload?.)
        Linking.openURL(
          authState?.userType === 1
            ? res?.payload?.start_url
            : res?.payload?.join_url,
        );
      }
    });
  };

  const renderSwiper = () => (
    <View
      style={{
        height: Dimensions.get('screen').height / 2.65,
      }}>
      {/* <Swiper
        ref={swiperRef}
        loop={false}
        bounces={false}
        onIndexChanged={index => setScrollIndex(index)}
        activeDotColor={colors.appRed}
        dotColor={colors.appRed}
        activeDotStyle={{
          width: scaledValue(23),
          height: scaledValue(6),
          borderRadius: scaledValue(20),
          backgroundColor: colors.themeColor,
        }}
        dotStyle={{
          width: scaledValue(6),
          height: scaledValue(6),
          borderRadius: scaledValue(20),
          opacity: 0.4,
        }}
        paginationStyle={styles.paginationStyle}>
        {upComingLists?.map((page, index) => (
          <View key={index}> */}
      <ProfileCard
        meetingOnPress={() => {
          joinMeeting(upComingMeetingList[0]);
        }}
        item={upComingMeetingList[0]}
        firstName={upComingMeetingList[0]?.userdetail?.fullName.split(' ')[0]}
        lastName={upComingMeetingList[0]?.userdetail?.fullName.split(' ')[1]}
        userImage={upComingMeetingList[0]?.userdetail?.profilePic}
        content={upComingMeetingList[0]?.meetingTitle}
        date={`${upComingMeetingList[0]?.day}, ${formatDate(
          upComingMeetingList[0]?.date,
        )}`}
        time={upComingMeetingList[0]?.slot}
        onPressMenu={() => refRBSheet.current.open()}
        videoImg={Images.videoCamera}
        videoText="Video Call"
        style={{marginHorizontal: 0}}
      />
      {/* </View>
        ))}
      </Swiper> */}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pastMeetingData}
        renderItem={renderItem}
        onEndReached={pastMeetingLoadMore}
        ListFooterComponent={pastMeetingLoader}
        ListEmptyComponent={() => {
          return (
            <>
              {!pastMeetingLoading &&
                pastMeetingData?.length < 1 &&
                upComingMeetingList?.length < 1 && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: Dimensions.get('window').height / 3,
                    }}>
                    <GText
                      text={'No meetings yet!'}
                      style={{fontSize: scaledValue(20)}}
                    />
                  </View>
                )}
            </>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              upComingMeeting();
              pastMeetingRefreshData();
            }}
          />
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            {upComingMeetingList?.length > 0 && (
              <>
                <View
                  style={{
                    marginTop: scaledValue(51),
                    marginBottom: scaledValue(12),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.upcomingMeetingText}>
                    Upcoming Meetings{' '}
                    <Text
                      style={
                        styles.noOfMeetings
                      }>{`(${upComingMeetingList?.length})`}</Text>
                  </Text>
                  {upComingMeetingList?.length > 1 && (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('StackScreens', {
                          screen: 'UpComingMeetings',
                        })
                      }>
                      <GText
                        beVietnamSemiBold
                        text={'View all'}
                        style={{
                          fontSize: scaledValue(14),
                          color: colors.themeColor,
                          lineHeight: scaledValue(18.2),
                          letterSpacing: scaledValue(14 * -0.02),
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {renderSwiper()}
              </>
            )}
            {pastMeetingData?.length > 0 && (
              <Text style={styles.pastMeetingText}>
                Past Meetings{' '}
                <Text
                  style={
                    styles.noOfMeetings
                  }>{`(${pastMeetingData?.length})`}</Text>
              </Text>
            )}
          </>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <BottomSheet
        onPress={() => {
          logoutRBSheetRef?.current?.close();
          setTimeout(() => {
            deletePastMeeting();
          }, 300);
        }}
        logoutRBSheetRef={logoutRBSheetRef}
        contentText={
          'You want to remove this meeting from the history list. Please confirm to continue.'
        }
        headerText={'Are you sure?'}
        firstButtonTitle={'Cancel'}
        secondButtonTitle={'Delete'}
      />
      <OptionMenuSheet
        refRBSheet={refRBSheet}
        options={reportAsList}
        onChoose={val => {
          val.action();
          refRBSheet.current.close();
        }}
        onPressCancel={() => refRBSheet.current.close()}
      />
      <Spinner
        color={colors.themeColor}
        visible={pastMeetingLoading}
        overlayColor="transparent"
      />
    </View>
  );
};

export default Meetings;
