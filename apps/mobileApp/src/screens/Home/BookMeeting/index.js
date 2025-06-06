import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import HeaderButton from '../../../components/HeaderButton';
import {Images} from '../../../utils';
import {styles} from './styles';
import GradientBorderButton from '../../../components/GradientBorderButton';
import {scaledValue} from '../../../utils/design.utils';
import GText from '../../../components/GText';
import Input from '../../../components/Input';
import {colors} from '../../../../assets/colors';
import ProfileCard from './ProfileCard';
import CalendarCard from './CalendarCard';
import TimeButton from './TimeCard';
import GradientButton from '../../../components/GradientButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';
import {
  book_meeting,
  get_available_slots,
  reschedule_meeting,
  setUpComingMeetingList,
} from '../../../redux/slices/bookMeetingSlice';
import fonts from '../../../utils/fonts';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {get_users_detail} from '../../../redux/slices/profileSlice';

const BookMeeting = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const {otherUserData, mentorData, meetingData} = route?.params;

  const gradientColors = [colors.offWhite, colors.offWhite];
  const userData = useAppSelector(state => state.auth.user);

  const upComingMeetingList = useAppSelector(
    state => state.meetings.upComingMeetingList,
  );
  const scrollViewRef = useRef(null);

  const wordLimit = 200;
  const [isFocused, setIsFocused] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  console.log('userInfouserInfo', userInfo);

  useEffect(() => {
    setIsSelectMode(() => {
      if (meetingData?.mode) {
        return meetingData.mode;
      } else if (userInfo?.communicationPreferences?.videoCall === 1) {
        return 'videoCall';
      } else if (userInfo?.communicationPreferences?.audioCall === 1) {
        return 'audioCall';
      } else if (userInfo?.communicationPreferences?.inPerson === 1) {
        return 'inPerson';
      } else {
        return null;
      }
    });
  }, [userInfo]);

  const [isSelectMode, setIsSelectMode] = useState({});

  const [meetingDate, setMeetingDate] = useState(meetingData?.date || '');
  const [meetingTitle, setMeetingTitle] = useState(
    meetingData?.meetingTitle || '',
  );
  const [time, setTime] = useState(meetingData?.slot);
  const [inputValue, setInputValue] = useState(meetingData?.personalNote || '');
  const dispatch = useAppDispatch();

  useEffect(() => {
    configureHeader();
  }, [navigation]);

  const configureHeader = () => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          tintColor={colors.themeColor}
          icon={Images.leftArrow}
          onPress={() => navigation.goBack()}
          iconStyle={styles.headerLeftArrowImage}
        />
      ),
      headerTitle: () => (
        <GText medium text="Book a Meeting" style={styles.headerText} />
      ),
    });
  };

  const getWordsCount = text => {
    if (text?.length <= wordLimit) {
      setInputValue(text);
    }
  };

  const today = new Date(); // Get the current date
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // Get the current month (0-11)
  const currentDay = today.getDate(); // Get the current day of the month

  const [currentMonthIndex, setCurrentMonthIndex] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDate, setSelectedDate] = useState({}); // Store selected date with month, day, and year
  const [availableSlots, setAvailableSlots] = useState([]);

  const [selectSlot, setSelectSlot] = useState('');
  const [selectDate, setSelectDate] = useState();
  // Function to generate dates for any month and year

  console.log('userInfouserInfo', userInfo);

  const generateDatesForMonth = (year, month) => {
    const dates = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the number of days in the month

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      dates.push({
        day: date.toLocaleDateString('en-US', {weekday: 'short'}),
        date: day,
        month,
        monthName: date.toLocaleDateString('en-US', {month: 'long'}),
        year,
        fullDate: date,
      });
    }

    return dates;
  };

  // Dates for the current month based on currentMonthIndex and selectedYear
  const datesInCurrentMonth = useMemo(
    () => generateDatesForMonth(selectedYear, currentMonthIndex),
    [currentMonthIndex, selectedYear],
  );

  // useEffect(() => {
  //   // Automatically scroll to the selected date when it changes
  //   const dateString = meetingDate;
  //   const date = new Date(dateString);

  //   const day = date.getDate(); // 9
  //   const month = date.getMonth(); // 1 (JavaScript months are zero-indexed, so we add 1)
  //   const year = date.getFullYear(); // 2025
  //   const abc = {
  //     date: day,
  //     month: month,
  //     year: year,
  //   };
  //   const selectedIndex = datesInCurrentMonth.findIndex(date =>
  //     isDateSelected(abc),
  //   );
  //   if (selectedIndex >= 0 && scrollViewRef.current) {
  //     scrollViewRef.current.scrollTo({
  //       x: selectedIndex * CARD_WIDTH, // Adjust CARD_WIDTH to the width of each CalendarCard
  //       animated: true,
  //     });
  //   }
  // }, [meetingDate]);

  // console.log('datesInCurrentMonthdatesInCurrentMonth', datesInCurrentMonth);

  useEffect(() => {
    // Scroll to the index of the pre-selected date
    const futureDates = datesInCurrentMonth.filter(item => {
      return new Date(item.fullDate) >= today;
    });

    const selectedIndex = futureDates.findIndex(
      date => formatDate(date.fullDate) === meetingData?.date,
    );

    console.log('selectedIndexselectedIndexss', selectedIndex);

    if (selectedIndex >= 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: selectedIndex * 60, // Adjust CARD_WIDTH to the width of each CalendarCard
        animated: true,
        y: selectedIndex,
      });
    }
  }, [meetingData]);

  // Determine which dates should be hidden (only hide past dates in the current month)
  const shouldHideDate = dateItem => {
    if (
      dateItem.year === currentYear &&
      dateItem.month === currentMonth &&
      dateItem.date < currentDay
    ) {
      return true; // Hide past days only for the current month and year
    }
    return false;
  };

  // Set the initial selected date to today's date when the component mounts
  useEffect(() => {
    const dateString = meetingDate;
    const date = new Date(dateString);

    const day = date.getDate(); // 9
    const month = date.getMonth(); // 1 (JavaScript months are zero-indexed, so we add 1)
    const year = date.getFullYear(); // 2025

    if (!selectedDate.month && !selectedDate.day && !selectedDate.year) {
      if (meetingDate) {
        setSelectedDate({
          day: day,
          month: month,
          year: year,
        });
      } else {
        setSelectedDate({
          day: currentDay,
          month: currentMonth,
          year: currentYear,
        });
      }
    }
  }, [currentDay, currentMonth, currentYear, selectedDate]);

  // Handle month navigation (update both month and year)
  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      // If it's December, move to January of the next year
      setCurrentMonthIndex(0);
      setSelectedYear(prevYear => prevYear + 1);
    } else {
      setCurrentMonthIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      // If it's January, move to December of the previous year
      setCurrentMonthIndex(11);
      setSelectedYear(prevYear => prevYear - 1);
    } else {
      setCurrentMonthIndex(prevIndex => prevIndex - 1);
    }
  };

  const formatDate = isoString => {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 because months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // Handle date selection
  const handleDateSelect = item => {
    setSelectDate(formatDate(item?.fullDate));
    setMeetingDate('');
    setSelectedDate({
      day: item.date,
      month: item.month,
      year: item.year,
    });
    // setTime(meetingData?.slot || '');
  };

  // Check if a date is currently selected
  const isDateSelected = item => {
    return (
      selectedDate.day === item.date &&
      selectedDate.month === item.month &&
      selectedDate.year === item.year
    );
  };

  // Check if the back button should be disabled
  const isBackButtonDisabled =
    currentMonthIndex === currentMonth && selectedYear === currentYear;

  const getCurrentDate = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 since months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // Example usage
  const todayDate = getCurrentDate();

  useEffect(() => {
    get_available_slots_hit();
    get_user_info();
  }, []);

  const get_available_slots_hit = selectData => {
    const input = {
      cognitoUserId:
        userData?.userType === 1
          ? userData?.cognitoUserId
          : otherUserData?.cognitoUserId,
      date: selectData
        ? selectData
        : meetingDate !== ''
        ? meetingDate
        : todayDate,
    };
    dispatch(get_available_slots(input)).then(res => {
      if (get_available_slots.fulfilled.match(res)) {
        setAvailableSlots(res?.payload?.slots);
      }
    });
  };

  const get_user_info = selectData => {
    const input = {
      cognitoUserId:
        userData?.userType === 1
          ? userData?.cognitoUserId
          : otherUserData?.cognitoUserId,
    };
    dispatch(get_users_detail(input)).then(res => {
      if (get_users_detail.fulfilled.match(res)) {
        if (res.payload?.status === 1) {
          setUserInfo(res.payload?.data);
        }
      }
    });
  };

  const book_meeting_hit = () => {
    const input = {
      cognitoUserId: otherUserData?.cognitoUserId,
      date: selectDate ? selectDate : todayDate,
      slot: selectSlot || meetingData?.date,
      personalNote: inputValue,
      mode: isSelectMode,
      meetingTitle: meetingTitle,
    };

    const reschedule_meeting_input = {
      cognitoUserId: otherUserData?.cognitoUserId,
      date: selectDate ? selectDate : meetingData?.date,
      slot: selectSlot || meetingData?.date,
      personalNote: inputValue,
      mode: isSelectMode,
      meetingTitle: meetingTitle,
      meetingId: meetingData?._id,
    };

    if (meetingData?.date) {
      dispatch(reschedule_meeting(reschedule_meeting_input)).then(res => {
        if (reschedule_meeting.fulfilled.match(res)) {
          const newData = res?.payload;
          // get_available_slots_hit(selectDate);
          dispatch(
            setUpComingMeetingList(
              upComingMeetingList.map(item =>
                item._id === newData?._id
                  ? {
                      ...item,
                      day: newData?.day,
                      date: newData?.date,
                      slot: newData?.slot,
                      meetingTitle: newData?.meetingTitle,
                      personalNote: newData?.personalNote,
                      mode: newData?.mode,
                    }
                  : item,
              ),
            ),
          );
          navigation?.goBack();
          // setTime('');
        }
      });
    } else {
      dispatch(book_meeting(input)).then(res => {
        if (book_meeting.fulfilled.match(res)) {
          get_available_slots_hit(selectDate);
          setTime('');
          setMeetingTitle('');
          setInputValue('');
          navigation.navigate('MeetingConfirmed', {
            newMeetingData: res?.payload,
          });
        }
      });
    }
  };

  const modeData = [
    {
      title: '🎥 Video Call',
      mode: 'videoCall',
      active: userInfo?.communicationPreferences?.videoCall,
    },
    {
      title: '📞 Phone Call',
      mode: 'audioCall',
      active: userInfo?.communicationPreferences?.audioCall,
    },
    {
      title: '☕️ In-person',
      mode: 'inPerson',
      active: userInfo?.communicationPreferences?.inPerson,
    },
  ];

  return (
    <KeyboardAwareScrollView
      bounces={false}
      style={{flex: 1}}
      extraHeight={Platform.OS == 'ios' ? scaledValue(100) : ''}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        <StatusBar backgroundColor={colors.offWhite} barStyle="dark-content" />
        <ProfileCard
          name={mentorData?.fullName}
          image={mentorData?.profilePic}
          emailDomainVerified={mentorData?.emailDomainVerified}
          likes={mentorData?.rating || 'No rating yet'}
          place={mentorData?.location || mentorData?.city}
        />
        <GText semiBold text="Select Mode" style={styles.titleText} />
        <View style={styles.modeContainer}>
          {modeData?.map((item, index) => (
            <GradientBorderButton
              // disabled={
              //   (meetingData?.date && true) ||
              //   userInfo?.communicationPreferences?.videoCall === 0 ||
              //   userInfo?.communicationPreferences?.audioCall === 0 ||
              //   userInfo?.communicationPreferences?.inPerson === 0
              // }
              disabled={
                // meetingData?.date ||
                (item.mode === 'videoCall' &&
                  userInfo?.communicationPreferences?.videoCall === 0) ||
                (item.mode === 'audioCall' &&
                  userInfo?.communicationPreferences?.audioCall === 0) ||
                (item.mode === 'inPerson' &&
                  userInfo?.communicationPreferences?.inPerson === 0)
              }
              activeOpacity={0.8}
              key={index}
              title={item.title}
              buttonStyle={{
                width: scaledValue(107),
                opacity: item?.active === 0 ? 0.3 : 1,
              }}
              onPress={() => setIsSelectMode(item?.mode)}
              inner={{
                backgroundColor:
                  isSelectMode == item?.mode ? 'transparent' : colors.offWhite,
              }}
              buttonTextStyle={{
                color:
                  isSelectMode == item?.mode
                    ? colors.offWhite
                    : colors.charcoal,
              }}
            />
          ))}
        </View>
        <Input
          value={meetingTitle}
          showLabel={true}
          editable={meetingData?.date && false}
          onChangeText={value => setMeetingTitle(value)}
          label={'Meeting Title'}
          // placeholder={'Meeting Title'}
          placeholderTextColor={colors.inputPlaceholder}
          style={{
            width: scaledValue(335),
            alignSelf: 'center',
            marginBottom: scaledValue(40),
            backgroundColor: 'transparent',
            fontSize: scaledValue(16),
            lineHeight: scaledValue(20.8),
            fontFamily: fonts?.BE_VIETNAM_REGULAR,
            color: colors.charcoal,
          }}
          autoCapitalize="none"
        />
        <GText
          semiBold
          text="Select Date"
          style={[styles.titleText, {marginBottom: scaledValue(16)}]}
        />
        <View
          style={[
            styles.sliderView,
            {
              justifyContent: !isBackButtonDisabled
                ? 'space-between'
                : 'center',
            },
          ]}>
          {!isBackButtonDisabled && (
            <TouchableOpacity
              onPress={handlePrevMonth}
              disabled={isBackButtonDisabled}>
              <Image
                style={styles.circleArrow}
                source={Images.previousCircleArrow}
              />
            </TouchableOpacity>
          )}

          <GText
            semiBold
            text={datesInCurrentMonth[0].monthName + ` ${selectedYear}`}
            style={styles.sliderText}
          />
          <TouchableOpacity
            onPress={handleNextMonth}
            style={{
              left: isBackButtonDisabled ? scaledValue(36) : scaledValue(0),
            }}>
            <Image style={styles.circleArrow} source={Images.nextCircleArrow} />
          </TouchableOpacity>
        </View>
        <View style={{}}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateContentContainer}>
            {datesInCurrentMonth.map(
              (item, index) =>
                !shouldHideDate(item) && ( // Hide past dates
                  <>
                    <CalendarCard
                      item={item}
                      setSelectedDate={setSelectedDate}
                      selectDate={isDateSelected(item)}
                      currentMonth={datesInCurrentMonth[0].monthName?.slice(
                        0,
                        3,
                      )}
                      index={index}
                      selectedDateIndex={isDateSelected(item)}
                      onPress={() => {
                        handleDateSelect(item);
                        get_available_slots_hit(formatDate(item?.fullDate));
                      }} // Use currentDateIndex for correct index
                    />
                  </>
                ),
            )}
          </ScrollView>
        </View>
        {availableSlots?.length > 0 ? (
          <>
            <GText semiBold text="Select Time" style={[styles.titleText]} />
            <View style={{marginBottom: scaledValue(40)}}>
              <FlatList
                data={availableSlots}
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={styles.timeContentContainer}
                renderItem={({item, index}) => {
                  return (
                    <TimeButton
                      item={item}
                      meetingData={meetingData}
                      onPress={() => {
                        setTime(item?.slotname);
                        setSelectSlot(item?.slotname);
                      }}
                      linearColor={
                        time !== item?.slotname
                          ? //  &&
                            // meetingData?.slot !== item?.slotname
                            gradientColors
                          : null
                      }
                      textStyle={{
                        color:
                          time !== item?.slotname
                            ? // &&
                              // meetingData?.slot !== item?.slotname
                              colors.Gray
                            : colors.offWhite,
                      }}
                    />
                  );
                }}
              />
            </View>
          </>
        ) : (
          <View style={{alignItems: 'center', paddingBottom: scaledValue(25)}}>
            <GText
              text={'No Slots Available for this date\nChoose another date'}
              style={{textAlign: 'center'}}
            />
          </View>
        )}

        <Input
          showLabel={isFocused}
          numberOfLines={5}
          editable={meetingData?.date && false}
          value={inputValue}
          // placeholder="Include a personal note or agenda for your session (optional)."
          multiline
          style={styles.textInput}
          labelStyle={{flexWrap: 'wrap'}}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          activeOutlineColor={colors.slightlyPink}
          outlineColor={colors.slightlyPink}
          placeholder={
            'Include a personal note or agenda for your session (optional).'
          }
          label={
            isFocused && (
              <GText
                text={'Add Personal Note'}
                style={{
                  color: isFocused ? colors.themeColor : colors.Gray,
                  fontFamily: isFocused
                    ? fonts?.BE_VIETNAM_BOLD
                    : fonts?.BE_VIETNAM_REGULAR,
                  fontSize: scaledValue(14),
                  letterSpacing: scaledValue(14 * -0.02),
                }}
              />
            )
          }
          onChangeText={getWordsCount}
        />
        <View style={styles.wordCountText}>
          <GText text={`${inputValue?.length}/${wordLimit}`} />
        </View>
        <GradientButton
          title={'💌 Send Meeting Request'}
          gradientstyle={styles.gradientStyle}
          textstyle={styles.textStyle}
          style={{
            marginHorizontal: scaledValue(20),
            marginBottom: insets.bottom ? insets.bottom : scaledValue(20),
          }}
          onPress={() => {
            book_meeting_hit();
            // navigation.navigate('MeetingConfirmed');
          }}
        />
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default BookMeeting;
