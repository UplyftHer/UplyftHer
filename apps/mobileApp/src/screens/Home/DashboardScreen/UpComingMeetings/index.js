import {FlatList, Linking, RefreshControl, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Images} from '../../../../utils';
import GText from '../../../../components/GText';
import {styles} from './styles';
import useDataFactory from '../../../../components/UseDataFactory/useDataFactory';
import HeaderButton from '../../../../components/HeaderButton';
import ProfileCard from '../ProfileCard';
import {scaledValue} from '../../../../utils/design.utils';
import OptionMenuSheet from '../../../../components/OptionMenuSheet';
import {colors} from '../../../../../assets/colors';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../redux/store/storeUtils';
import {
  cancel_meeting,
  join_meeting,
  setUpComingMeetingList,
} from '../../../../redux/slices/bookMeetingSlice';

const UpComingMeetings = ({navigation}) => {
  const refRBSheet = useRef();
  const userData = useAppSelector(state => state.auth.user);
  const upComingMeetingList = useAppSelector(
    state => state.meetings.upComingMeetingList,
  );
  const [selectMeetingData, setSelectMeetingData] = useState();
  const dispatch = useAppDispatch();
  useEffect(() => {
    configureHeader();
  }, []);

  const configureHeader = () => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          icon={Images.leftArrow}
          onPress={() => navigation.goBack()}
          tintColor={'#966B9D'}
          iconStyle={styles.headerIconStyle}
          style={{paddingHorizontal: 0}}
        />
      ),
      headerTitle: () => (
        <GText text="Meetings" medium style={styles.headerTitleStyle} />
      ),
    });
  };

  const {
    loading: loading,
    data,
    setData,
    refreshData,
    loadMore,
    Placeholder,
    Loader,
  } = useDataFactory('upComingMeetingsList', true, '', 'POST');

  const formatDate = dateString => {
    const date = new Date(dateString); // Parse the input string
    const options = {year: 'numeric', month: 'long', day: '2-digit'};
    return new Intl.DateTimeFormat('en-US', options)?.format(date);
  };

  const cancel_meeting_hit = () => {
    const input = {
      meetingId: selectMeetingData?._id,
      cognitoUserId: selectMeetingData?.userdetail?.cognitoUserId,
    };

    const filteredData = upComingMeetingList.filter(
      item => item?._id !== selectMeetingData?._id,
    );
    const filteredDataList = data?.filter(
      item => item?._id !== selectMeetingData?._id,
    );

    dispatch(cancel_meeting(input)).then(res => {
      if (cancel_meeting.fulfilled.match(res)) {
        dispatch(setUpComingMeetingList(filteredData));
        setData(filteredDataList);
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
            mentorData: selectMeetingData?.userdetail,
            otherUserData: {
              cognitoUserId: selectMeetingData?.userdetail?.cognitoUserId,
            },
            meetingData: selectMeetingData,
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
          userData?.userType === 1
            ? res?.payload?.start_url
            : res?.payload?.join_url,
        );
      }
    });
  };

  return (
    <View style={styles.container}>
      {!loading && (
        <>
          <View style={styles.titleView}>
            <GText
              text={'Upcoming Meetings'}
              style={styles.upcomingMeetingText}
            />
            {/* <Text style={styles.upcomingMeetingText}>
          Upcoming Meetings <Text style={styles.noOfMeetings}>(2)</Text>
        </Text> */}
          </View>
          <FlatList
            data={data}
            onEndReached={loadMore}
            ListFooterComponent={Loader}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={refreshData} />
            }
            contentContainerStyle={{
              gap: scaledValue(12),
              paddingBottom: scaledValue(30),
            }}
            renderItem={({item, index}) => {
              return (
                <ProfileCard
                  meetingOnPress={() => {
                    joinMeeting(item);
                  }}
                  item={item}
                  firstName={item?.userdetail?.fullName?.split(' ')[0]}
                  lastName={item?.userdetail?.fullName?.split(' ')[1]}
                  userImage={item?.userdetail?.profilePic}
                  content={item?.meetingTitle}
                  date={`${item?.day}, ${formatDate(item?.date)}`}
                  time={item?.slot}
                  videoImg={Images.videoCamera}
                  videoText={
                    item?.mode == 'videoCall' ? 'Video Call' : 'Audio Call'
                  }
                  onPressMenu={() => {
                    setSelectMeetingData(item);
                    refRBSheet.current.open();
                  }}
                />
              );
            }}
          />
        </>
      )}
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
        visible={loading}
        overlayColor="transparent"
      />
    </View>
  );
};

export default UpComingMeetings;

const reportAsList = [
  {
    id: 1,
    title: 'Reschedule Meeting',
    textColor: '#007AFF',
    action: () => {},
  },
  {
    id: 2,
    title: 'Cancel Meeting',
    textColor: '#FF3B30',
    action: () => {},
  },
];
