import {
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  View,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {Images} from '../../../utils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scaledValue} from '../../../utils/design.utils';

import GText from '../../../components/GText';
import {
  asteriskFill,
  avatar,
  dottedDivider,
  profileDummy,
  qrCode,
} from '../../../utils/Images';
import {styles} from './styles';
import GradientButton from '../../../components/GradientButton';
import GImage from '../../../components/GImage';
import {useAppSelector} from '../../../redux/store/storeUtils';
import RNCalendarEvents from 'react-native-calendar-events';
import moment from 'moment';
import {showToast} from '../../../components/Toast';
import {CommonActions} from '@react-navigation/native';

const MeetingConfirmed = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const {newMeetingData} = route?.params;
  const userData = useAppSelector(state => state.auth.user);
  const [eventId, setEventId] = useState('');
  const [calendars, setCalendars] = useState([]);
  const [pickedCal, setPickedCal] = useState(null);

  async function loadCalendars() {
    try {
      const perms = await RNCalendarEvents.requestPermissions();
      if (perms === 'authorized') {
        const allCalendars = await RNCalendarEvents.findCalendars();
        const primaryCal = allCalendars.find(
          cal => cal.isPrimary && cal.allowsModifications,
        );

        setCalendars(allCalendars);
        setPickedCal(primaryCal);

        if (primaryCal) {
          console.log('Selected Calendar:', primaryCal.title);
          createEvent(primaryCal.id);
        }
      } else {
        console.log('Calendar permission denied.');
      }
    } catch (error) {
      console.log('Error while fetching calendars:', error);
    }
  }

  console.log('newMeetingData', newMeetingData);

  const date = new Date(newMeetingData?.date); // Create a date object with your specific date
  const formatDateTime = (dateStr, timeStr) => {
    // Parse the date and time
    const date = new Date(dateStr);

    // Split the time into hours and minutes
    const [hours, minutes] = timeStr.split(':');
    const [pmOrAm] = timeStr.split(' ').slice(-1); // AM or PM

    // Adjust the hours if PM (24-hour format)
    let adjustedHours = parseInt(hours, 10);
    if (pmOrAm === 'PM' && adjustedHours < 12) {
      adjustedHours += 12;
    } else if (pmOrAm === 'AM' && adjustedHours === 12) {
      adjustedHours = 0;
    }

    // Create a new Date object with the adjusted time
    date.setHours(adjustedHours, minutes.split(' ')[0], 0, 0);

    // Return the formatted string in ISO format
    return date.toISOString();
  };
  const formatDateTimeWithExtraTime = (dateStr, timeStr) => {
    const dateTime = moment(`${dateStr} ${timeStr}`, 'YYYY-MM-DD hh:mmA');

    // Add 30 minutes
    const updatedDateTime = dateTime.add(30, 'minutes');

    // Set UTC offset to 0 to avoid adding +05:30 and return in ISO format (UTC)
    return updatedDateTime.utcOffset(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  };

  const formattedDate = date.toISOString();

  console.log(
    '12345',
    formatDateTime(newMeetingData?.date, newMeetingData?.slot),
  );
  console.log(
    '678910',
    formatDateTimeWithExtraTime(newMeetingData?.date, newMeetingData?.slot),
  );

  async function createEvent(calendarId) {
    try {
      const eventDetails = {
        title: `Meeting with ${
          newMeetingData?.userdetail?.fullName?.split(' ')[0]
        } at ${newMeetingData?.slot}`,
        startDate: formatDateTime(newMeetingData?.date, newMeetingData?.slot), // Static date & time (UTC format)
        endDate: formatDateTimeWithExtraTime(
          newMeetingData?.date,
          newMeetingData?.slot,
        ), // 1-hour duration
        notes: 'Discuss project updates',
        calendarId: calendarId,
      };

      const eventId = await RNCalendarEvents.saveEvent(
        eventDetails.title,
        eventDetails,
      );
      showToast(1, 'Meeting added to calender successfully!');
      // navigation?.goBack();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'TabBar', // Your tab navigator
              state: {
                index: 0,
                routes: [
                  {
                    name: 'HomeStack', // Your first stack inside tabs
                    state: {
                      index: 0,
                      routes: [{name: 'DashBoardScreen'}], // First screen in the stack
                    },
                  },
                ],
              },
            },
          ],
        }),
      );
      console.log('Event created with ID:', eventId);
    } catch (error) {
      console.log('Error while creating event:', error);
    }
  }

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{flexGrow: 1}}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        <Image source={Images.whiteLines} style={styles.whiteLines} />
        <View style={styles.headerTitileView(insets)}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={Images.leftArrow} style={styles.leftArrowStyle} />
          </TouchableOpacity>
        </View>

        <View style={{top: scaledValue(-100)}}>
          <GText medium text="🥳" style={styles.headerText} />
          <GText
            medium
            text={`Your session with\n${
              newMeetingData?.userdetail?.fullName?.split(' ')[0]
            } is locked in!`}
            style={styles.subtitleStyle}
          />
        </View>

        <View style={styles.meetingCardMainContainer(insets)}>
          <View style={styles.profileCardMainView}>
            <View style={styles.profileCardView}>
              <View style={[styles.userProfileView]}>
                <View style={styles.userDetailView}>
                  <GImage
                    image={userData?.profilePic}
                    style={styles.userImage}
                  />
                </View>
                <GText
                  medium
                  text={userData?.fullName?.split(' ')[0]}
                  style={styles.userName}
                />
              </View>
              <Image source={asteriskFill} style={styles.asteriskImage} />
              <View
                style={[
                  {
                    position: 'absolute',
                    right: scaledValue(24),
                    alignItems: 'center',
                  },
                ]}>
                <View style={styles.userDetailView}>
                  <GImage
                    image={newMeetingData?.userdetail?.profilePic}
                    style={styles.userImage}
                  />
                </View>
                <GText
                  medium
                  text={newMeetingData?.userdetail?.fullName?.split(' ')[0]}
                  style={styles.userName}
                />
              </View>
            </View>
          </View>
          <View style={styles.centerCircleView} />
          <View style={styles.meetingDetailsMainView}>
            <View style={{marginBottom: scaledValue(30)}}>
              <GText text="Title" beVietnamBold style={styles.detailText} />
              <GText
                text={newMeetingData?.meetingTitle}
                componentProps={{
                  numberOfLines: 2,
                  ellipsizeMode: 'tail',
                }}
                semiBold
                style={styles.subDetailText}
              />
            </View>
            <View
              style={[
                styles.meetingDetailsView,
                {marginBottom: scaledValue(30)},
              ]}>
              <View style={styles.detailView}>
                <GText text="Date" beVietnamBold style={styles.detailText} />
                <GText
                  text={formatDate(newMeetingData?.date)}
                  semiBold
                  style={styles.subDetailText}
                />
              </View>
              <View style={styles.detailView}>
                <GText text="Time" beVietnamBold style={styles.detailText} />
                <GText
                  text={newMeetingData?.slot}
                  semiBold
                  style={styles.subDetailText}
                />
              </View>
            </View>
            <View style={styles.meetingDetailsView}>
              <View style={styles.detailView}>
                <GText text="Mode" beVietnamBold style={styles.detailText} />
                <GText
                  text={
                    newMeetingData?.mode == 'videoCall'
                      ? 'Video call'
                      : newMeetingData?.mode == 'audioCall'
                      ? 'Phone call'
                      : 'In-person'
                  }
                  semiBold
                  style={styles.subDetailText}
                />
              </View>
              <View style={styles.detailView}>
                <GText
                  text="Meeting Link"
                  beVietnamBold
                  style={styles.detailText}
                />
                <GText
                  text={`uplyft.meet/\nCxE18S24`}
                  semiBold
                  style={styles.subDetailText}
                />
              </View>
            </View>
          </View>
          <View style={styles.dottedLineView}>
            <View style={styles.leftCircleView} />

            <Image source={dottedDivider} style={styles.dottedImage} />
            <View style={styles.rightCircleView} />
          </View>

          {/* <View style={styles.scannerMainView}>
            <View style={styles.scanTextView}>
              <GText
                text={`Scan the QR for\neasy access`}
                beVietnamRegular
                style={styles.scanText}
              />
            </View>
            <Image source={qrCode} style={styles.qrcodeImage} />
          </View> */}

          <GradientButton
            title={'Add to Calendar'}
            imageSource={Images.Fax}
            imagestyle={{width: scaledValue(19), height: scaledValue(19)}}
            gradientstyle={styles.gradientStyle}
            textstyle={styles.textStyle}
            onPress={() => {
              loadCalendars();
              // navigation.navigate('FeedbackScreen');
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default MeetingConfirmed;
