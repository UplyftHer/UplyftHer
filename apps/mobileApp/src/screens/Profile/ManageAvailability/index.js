import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {styles} from './styles';
import HeaderButton from '../../../components/HeaderButton';
import {Images} from '../../../utils';
import GText from '../../../components/GText';
import ToggleButton from '../../../components/ToggleButton';
import GradientButton from '../../../components/GradientButton';
import GradientBorderButton from '../../../components/GradientBorderButton';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import DatePicker from 'react-native-date-picker';
import {showToast} from '../../../components/Toast';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';
import {
  add_Availability,
  communicationPreference,
  delete_Availability_forDay,
  delete_Availability_forSlots,
  get_my_availability,
  manageAvailability,
} from '../../../redux/slices/profileSlice';
import {colors} from '../../../../assets/colors';
import {setUserData} from '../../../redux/slices/authSlice';

const ManageAvailability = ({navigation}) => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(state => state.auth.user);
  const [videoCall, setVideoCall] = useState(
    authState.communicationPreferences.videoCall === 1 ? true : false,
  );
  const [audioCall, setAudioCall] = useState(
    authState.communicationPreferences.audioCall === 1 ? true : false,
  );
  const [chat, setChat] = useState(
    authState.communicationPreferences.inPerson === 1 ? true : false,
  );

  const [mainToggleState, setMainToggleState] = useState(
    authState?.isMatchAvailibilty === 1 ? true : false,
  );
  const [selectTimeFormat, setSelectTimeFormat] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectDayToDelete, setSelectDayToDelete] = useState({});
  const [selectDayToDeleteSlot, setSelectDayToDeleteSlot] = useState({});
  // console.log('selectDayToDeleteSlot', selectDayToDeleteSlot);

  const [date, setDate] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [isSelectDate, setIsSelectDate] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  console.log('isSelectDates=>>>>', selectedDates);

  const [open, setOpen] = useState(false);
  const [slots, setSlots] = useState(
    Array(7).fill([{hour: '', minute: '', format: 'AM'}]),
  ); // State to track slots for each day

  useEffect(() => {
    my_availability();
  }, []);

  const [checkStates, setCheckStates] = useState(new Array(7).fill(false)); // Check state for each week

  const [myAvailability, setMyAvailability] = useState([]);

  const my_availability = () => {
    dispatch(get_my_availability()).then(res => {
      if (get_my_availability.fulfilled.match(res)) {
        setMyAvailability(res?.payload);
        // setMyAvailability({
        //   slots: [],
        // });
      }
    });
  };

  useEffect(() => {
    // Map the predefined data to the checkStates array using weekArray

    const newCheckStates = weekArray.map(week => {
      const matchingDay = myAvailability?.slots?.find(
        item => item.name === week.week,
      );
      return matchingDay && matchingDay.slot.length > 0; // If slots exist for the day, set true
    });

    setCheckStates(newCheckStates);

    const updatedSlots = Array(7)
      .fill()
      .map(() => []);

    let daysWithSlots = [];

    // Iterate over each day in the initial data
    myAvailability?.slots?.forEach(daySlot => {
      const weekIndex = weekArray.findIndex(w => w.week === daySlot.name);

      if (weekIndex !== -1) {
        // Clear any existing slots for the day before adding new slots
        updatedSlots[weekIndex] = [];

        // Add slots for the current day
        daySlot.slot.forEach(s => {
          updatedSlots[weekIndex].push({
            hour: s.time.split(' ')[0].split(':')[0],
            minute: s.time.split(' ')[0].split(':')[1],
            format: s.time.split(' ')[1],
          });
        });

        // Add day information to daysWithSlots
        daysWithSlots.push({
          type: 'day',
          status: 1, // Assuming the status is 1 as per the example
          name: daySlot.name, // Use the day name
          slot: daySlot.slot.map(s => ({
            time: s.time,
            // _id: s._id,
          })), // Add time and _id directly from the slot
          // _id: daySlot._id, // Include the day ID
        });
      }
    });

    // Update the state with the updated slots
    setSlots(updatedSlots);

    // Update slots for date

    const preprocessedDates = myAvailability?.slots
      ?.filter(slot => slot.type === 'date' && slot.status === 1)
      .map((slot, index) => ({
        id: index + 1, // Unique ID for each date
        name: slot.name,
        status: slot?.status,
      }));

    let updatedSlot = [];
    let dateWithSlots = [];
    // Use preprocessedDates directly
    preprocessedDates?.forEach((date, weekIndex) => {
      // Find slots corresponding to this date
      const daySlots = myAvailability?.slots?.filter(
        slot => slot.name === date.name,
      );

      if (daySlots.length > 0) {
        // Initialize slots for this weekIndex
        updatedSlot[weekIndex] = [];

        // Add slots for the current day
        daySlots.forEach(daySlot => {
          daySlot.slot.forEach(s => {
            updatedSlot[weekIndex].push({
              hour: s.time.split(' ')[0].split(':')[0],
              minute: s.time.split(' ')[0].split(':')[1],
              format: s.time.split(' ')[1],
            });
          });
        });
        dateWithSlots.push({
          type: 'date',
          status: 1,
          name: date.name,
          slot: updatedSlot[weekIndex],
        });
      }
    });

    // Update state
    setDateArray(preprocessedDates);
    setTimeSlots(updatedSlot);
    setSelectedDates(dateWithSlots);
  }, [myAvailability]);

  const [select, setSelect] = useState({
    id: 1,
    title: 'Days',
  });

  const getCurrentDate = today => {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const [dateArray, setDateArray] = useState([
    {
      id: 1,
      name: getCurrentDate(new Date()),
      status: 1,
    },
  ]);

  const [timeSlots, setTimeSlots] = useState(
    [{hour: '', minute: '', format: ''}], // Default empty slot if no slots for the date
  );
  const today = new Date(); // Current date

  const next31Days = new Date();
  next31Days.setDate(today.getDate() + 31);

  const filter = [
    {
      id: 1,
      title: 'Days',
      value: 'Days',
    },
    {
      id: 2,
      title: 'Date',
      value: 'Date',
    },
  ];

  const timeFormat = [
    {
      id: 1,
      title: 'AM',
      value: 'AM',
    },
    {
      id: 2,
      title: 'PM',
      value: 'PM',
    },
  ];

  const weekArray = [
    {
      id: 1,
      week: 'Monday',
    },
    {
      id: 2,
      week: 'Tuesday',
    },
    {
      id: 3,
      week: 'Wednesday',
    },
    {
      id: 4,
      week: 'Thursday',
    },
    {
      id: 5,
      week: 'Friday',
    },
    {
      id: 6,
      week: 'Saturday',
    },
    {
      id: 7,
      week: 'Sunday',
    },
  ];

  const convertDateToReadableFormat = dateString => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const [year, month, day] = dateString.split('-');
    const monthName = months[parseInt(month, 10) - 1]; // Get month name

    return `${monthName} ${parseInt(day, 10)}, ${year}`;
  };

  function getDay(dateString) {
    const date = new Date(dateString);

    // Get the day of the week
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const day = daysOfWeek[date.getDay()];

    return day;
  }

  function getFormattedDate(dateString) {
    const date = new Date(dateString);

    // Get the day of the week

    // Format the date as "27 December, 2024"
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const formattedDate = `${date.getDate()} ${
      months[date.getMonth()]
    }, ${date.getFullYear()}`;

    return formattedDate;
  }

  const preferences = [
    {
      id: 1,
      name: 'Video Call',
      toggleState: videoCall,
      setMainToggleState: setVideoCall,
      type: 'video',
    },
    {
      id: 2,
      name: 'Phone Call',
      toggleState: audioCall,
      setMainToggleState: setAudioCall,
      type: 'audio',
    },
    {
      id: 3,
      name: 'In-Person',
      toggleState: chat,
      setMainToggleState: setChat,
      type: 'chat',
    },
  ];

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
        <GText
          text="Manage Availability"
          medium
          style={styles.headerTitleStyle}
        />
      ),
    });
  };

  const manageAvailability_hit = () => {
    let input = {
      isMatchAvailibilty: !mainToggleState ? 1 : 0,
    };

    dispatch(manageAvailability(input)).then(res => {
      if (manageAvailability.fulfilled.match(res)) {
        dispatch(setUserData({...authState, ...res?.payload}));
      } else {
      }
    });
  };

  const handleMainToggle = () => {
    setMainToggleState(!mainToggleState);
    setTimeout(() => {
      manageAvailability_hit();
    }, 300);
    // Toggle the main state
  };

  const handleToggle = (toggleStates, setMainToggleStats, type) => {
    setMainToggleStats(!toggleStates);
    dispatch(
      communicationPreference({type: type, status: !toggleStates ? 1 : 0}),
    );
  };

  const handleCheckToggle = index => {
    const updatedCheckStates = [...checkStates];
    updatedCheckStates[index] = !updatedCheckStates[index];
    setCheckStates(updatedCheckStates);

    // Initialize a slot if it's checked for the first time
    if (
      updatedCheckStates[index] &&
      slots[index].length === 1 &&
      slots[index][0].hour === ''
    ) {
      setSlots(prevSlots => {
        const newSlots = [...prevSlots];
        newSlots[index] = [{hour: '', minute: '', format: ''}];
        return newSlots;
      });
    }
  };

  const addSlot = index => {
    const lastSlot = slots[index][slots[index].length - 1];

    if (lastSlot === undefined) {
      setSlots(prevSlots => {
        const newSlots = [...prevSlots];
        newSlots[index] = [
          ...newSlots[index],
          {hour: '', minute: '', format: ''},
        ];
        return newSlots;
      });
    }

    if (lastSlot?.hour && lastSlot?.minute && lastSlot?.format) {
      setSlots(prevSlots => {
        const newSlots = [...prevSlots];
        newSlots[index] = [
          ...newSlots[index],
          {hour: '', minute: '', format: ''},
        ];
        return newSlots;
      });
    } else if (lastSlot !== undefined) {
      showToast(0, 'Please complete the current slot before adding a new one.');
    }
  };

  const addDateSlot = index => {
    const lastSlot = timeSlots[index][timeSlots[index].length - 1];

    if (lastSlot === undefined) {
      setTimeSlots(prevSlots => {
        const newSlots = [...prevSlots];
        newSlots[index] = [
          ...newSlots[index],
          {hour: '', minute: '', format: ''},
        ];
        return newSlots;
      });
    }

    if (lastSlot?.hour && lastSlot?.minute && lastSlot?.format) {
      setTimeSlots(prevSlots => {
        const newSlots = [...prevSlots];
        newSlots[index] = [
          ...newSlots[index],
          {hour: '', minute: '', format: ''},
        ];
        return newSlots;
      });
    } else if (lastSlot !== undefined) {
      showToast(0, 'Please complete the current slot before adding a new one.');
    }
  };

  const formatTime = (hour, minute, format) => {
    const formattedHour = hour.padStart(2, '0'); // Ensure hour is always two digits (e.g., '09')
    const formattedMinute = minute.padStart(2, '0'); // Ensure minute is always two digits (e.g., '00')
    return `${formattedHour}:${formattedMinute} ${format}`;
  };

  const handleTimeChange = (index, slotIndex, field, value) => {
    const updatedSlots = [...slots];

    // Update the hour, minute, or format based on the field
    if (field === 'hour') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (
        numericValue === '' ||
        (Number(numericValue) >= 0 && Number(numericValue) <= 12)
      ) {
        updatedSlots[index][slotIndex].hour = numericValue;
      }
    } else if (field === 'minute') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (
        numericValue === '' ||
        (Number(numericValue) >= 0 && Number(numericValue) <= 59)
      ) {
        updatedSlots[index][slotIndex].minute = numericValue;
      }
    } else if (field === 'format') {
      updatedSlots[index][slotIndex].format = value;
    }

    // Check if the current slot is fully completed
    const isSlotComplete = slot => {
      return (
        slot.hour?.length > 0 &&
        slot.minute?.length > 0 &&
        slot.format?.length > 0
      );
    };

    // Update the slots state
    setSlots(updatedSlots);

    // Update selectedDates state in the desired format
    setSelectedDays(prevSelectedDates => {
      const updatedDates = [...prevSelectedDates];
      const currentDay = weekArray[index]?.week; // Assume you have weekArray to get the current day
      const formattedTime = formatTime(
        updatedSlots[index][slotIndex].hour,
        updatedSlots[index][slotIndex].minute,
        updatedSlots[index][slotIndex].format,
      );

      // Find the entry for the current day or create one if not present
      let dateIndex = updatedDates.findIndex(item => item.name === currentDay);

      if (dateIndex === -1) {
        // Add a new day entry if it doesn't exist
        updatedDates.push({
          type: 'day', // or 'date' based on your requirement
          name: currentDay,
          status: 1,
          slot: [],
        });
        dateIndex = updatedDates.length - 1; // Update index after pushing
      }

      // Ensure the `slot` array exists and update the slot data
      if (!updatedDates[dateIndex].slot) {
        updatedDates[dateIndex].slot = [];
      }

      if (isSlotComplete(updatedSlots[index][slotIndex])) {
        updatedDates[dateIndex].slot[slotIndex] = {time: formattedTime};
      }
      // updatedDates[dateIndex].slot[slotIndex] = {time: formattedTime};

      return updatedDates;
    });
  };

  const handleTimeDateChange = (index, slotIndex, field, value) => {
    const updatedSlots = [...timeSlots];

    // Update the hour, minute, or format based on the field
    if (field === 'hour') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (
        numericValue === '' ||
        (Number(numericValue) >= 0 && Number(numericValue) <= 12)
      ) {
        updatedSlots[index][slotIndex].hour = numericValue;
      }
    } else if (field === 'minute') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (
        numericValue === '' ||
        (Number(numericValue) >= 0 && Number(numericValue) <= 59)
      ) {
        updatedSlots[index][slotIndex].minute = numericValue;
      }
    } else if (field === 'format') {
      updatedSlots[index][slotIndex].format = value;
    }

    // Helper function to check if the slot is complete
    const isSlotComplete = slot => {
      return (
        slot.hour?.length > 0 &&
        slot.minute?.length > 0 &&
        slot.format?.length > 0
      );
    };

    // Update the slots state
    setTimeSlots(updatedSlots);

    // Update selectedDays state
    setSelectedDates(prevSelectedDays => {
      const updatedDays = [...prevSelectedDays];
      const formattedDate = dateArray[index]?.name; // Extract date in "YYYY-MM-DD" format
      const formattedTime = formatTime(
        updatedSlots[index][slotIndex].hour,
        updatedSlots[index][slotIndex].minute,
        updatedSlots[index][slotIndex].format,
      );

      // Find the entry for the selected date or create one if not present
      let dateIndex = updatedDays.findIndex(day => day.name === formattedDate);

      if (dateIndex === -1) {
        // Add a new date entry if it doesn't exist
        updatedDays.push({
          type: 'date', // Indicates that this is a date-based entry
          name: formattedDate,
          status: 1,
          slot: [],
        });
        dateIndex = updatedDays.length - 1; // Update the index after adding
      }

      // Ensure the `slot` array exists and update the slot data
      if (!updatedDays[dateIndex].slot) {
        updatedDays[dateIndex].slot = [];
      }

      if (isSlotComplete(updatedSlots[index][slotIndex])) {
        updatedDays[dateIndex].slot[slotIndex] = {time: formattedTime};
      }

      return updatedDays;
    });
    setIsSelectDate(prevSelectedDays => {
      const updatedDays = [...prevSelectedDays];
      const formattedDate = dateArray[index]?.name; // Extract date in "YYYY-MM-DD" format
      const formattedTime = formatTime(
        updatedSlots[index][slotIndex].hour,
        updatedSlots[index][slotIndex].minute,
        updatedSlots[index][slotIndex].format,
      );

      // Find the entry for the selected date or create one if not present
      let dateIndex = updatedDays.findIndex(day => day.name === formattedDate);

      if (dateIndex === -1) {
        // Add a new date entry if it doesn't exist
        updatedDays.push({
          type: 'date', // Indicates that this is a date-based entry
          name: formattedDate,
          status: 1,
          slot: [],
        });
        dateIndex = updatedDays.length - 1; // Update the index after adding
      }

      // Ensure the `slot` array exists and update the slot data
      if (!updatedDays[dateIndex].slot) {
        updatedDays[dateIndex].slot = [];
      }

      if (isSlotComplete(updatedSlots[index][slotIndex])) {
        updatedDays[dateIndex].slot[slotIndex] = {time: formattedTime};
      }

      return updatedDays;
    });
  };

  const mergeData = (existingData, newData) => {
    // Create a new slots array to hold merged slots
    let mergedSlots = [...existingData.slots];

    newData.slots.forEach(newSlot => {
      // Find the slot with the same name in existing data
      const existingSlotIndex = mergedSlots.findIndex(
        existingSlot => existingSlot.name === newSlot.name,
      );

      if (existingSlotIndex !== -1) {
        // If the slot already exists, merge the slot arrays
        mergedSlots[existingSlotIndex].slot = [
          ...mergedSlots[existingSlotIndex].slot,
          ...newSlot.slot,
        ];
      } else {
        // If the slot does not exist, add it as a new slot
        mergedSlots.push(newSlot);
      }
    });

    // Return the updated data object with the merged slots
    return {
      ...existingData,
      slots: mergedSlots,
    };
  };

  console.log('myAvailability', JSON.stringify(myAvailability));

  const add_availability_hit = () => {
    const daysInput = {
      slots: selectedDays,
    };

    const datesInput = {
      slots: isSelectDate,
    };

    const cleanedWeekDaysData = {
      ...daysInput,
      slots: daysInput?.slots?.map(day => ({
        ...day,
        slot: day.slot.filter(item => item !== null),
      })),
    };

    // console.log('cleanedWeekDaysData15', JSON.stringify(cleanedWeekDaysData));

    const cleanedDateData = {
      ...datesInput,
      slots: datesInput?.slots?.map(day => ({
        ...day,
        slot: day.slot.filter(item => item !== null),
      })),
    };
    // console.log('cleanedDateData12', JSON.stringify(cleanedDateData));

    if (select?.title === 'Days') {
      if (selectedDays?.length > 0) {
        dispatch(add_Availability(cleanedWeekDaysData)).then(res => {
          if (add_Availability.fulfilled.match(res)) {
            const modifiedData = cleanedWeekDaysData?.slots.forEach(
              slotItem => {
                slotItem.slot.forEach(timeItem => {
                  timeItem._id = 1;
                });
              },
            );
            console.log(
              'cleanedWeekDaysData0',
              JSON.stringify(cleanedWeekDaysData),
            );

            console.log('modifiedDatamodifiedData', modifiedData);

            const updatedData = mergeData(myAvailability, cleanedWeekDaysData);
            setMyAvailability(updatedData);
            setSelectedDays([]);
          }
        });
      } else {
        showToast(0, 'Fill slots before adding a new availability.');
      }
    } else {
      if (isSelectDate?.length > 0) {
        dispatch(add_Availability(cleanedDateData)).then(res => {
          if (add_Availability.fulfilled.match(res)) {
            const modifiedData = cleanedDateData?.slots.forEach(slotItem => {
              slotItem.slot.forEach(timeItem => {
                timeItem._id = 1;
              });
            });
            console.log('cleanedDateData0', JSON.stringify(cleanedDateData));

            console.log('modifiedDatamodifiedData', modifiedData);
            const updatedData = mergeData(myAvailability, cleanedDateData);
            setMyAvailability(updatedData);
            setIsSelectDate([]);
          }
        });
      } else {
        showToast(0, 'Fill slots before adding a new availability.');
      }
    }
  };

  const deleteAllSlots = (i, index) => {
    setShowModal(false);
    const input = {
      name: select?.title === 'Days' ? i?.week : i?.name,
    };

    dispatch(delete_Availability_forDay(input)).then(res => {
      if (delete_Availability_forDay.fulfilled.match(res)) {
        const updatedSlots = myAvailability?.slots.filter(
          slot => slot?.type == 'day' && slot?.name !== i?.week,
        );
        const updatedDateSlots = myAvailability?.slots.filter(
          slot => slot?.type == 'date' && slot?.name !== i?.name,
        );

        setMyAvailability({
          slots: select?.title === 'Days' ? updatedSlots : updatedDateSlots,
        });
        setSelectDayToDelete({});
      }
    });
  };

  const deleteSpecificSlot = selectDayToDeleteSlot => {
    const {i, index, slotIndex} = selectDayToDeleteSlot;

    setShowSlotModal(false);

    const getWeekDay = myAvailability?.slots?.find(
      slot => slot?.name === i?.week,
    );
    const time = getWeekDay ? getWeekDay.slot[slotIndex]?.time : null;
    const input = {
      name: i?.week,
      slottime: time,
    };
    // console.log('console0111', i, index, slotIndex);
    const getDate = myAvailability?.slots?.find(slot => slot?.name === i?.name);
    // console.log('getDategetDate', getDate);

    const findDateSlot = getDate ? getDate?.slot[slotIndex]?.time : null;
    const dateInput = {
      name: i?.name,
      slottime: findDateSlot,
    };
    // console.log('dateInput123', dateInput);

    if (select?.title === 'Days') {
      dispatch(delete_Availability_forSlots(input)).then(res => {
        if (delete_Availability_forSlots.fulfilled.match(res)) {
          const updatedSelectedDates = [...selectedDays];

          // Find the corresponding day entry and remove the slot at slotIndex
          if (updatedSelectedDates[index] && updatedSelectedDates[index].slot) {
            updatedSelectedDates[index].slot = updatedSelectedDates[
              index
            ].slot.filter((_, idx) => idx !== slotIndex);
          }

          // Update the selectedDates state with the modified array
          setSelectedDays(updatedSelectedDates);

          // Optionally, update the slots if you're also modifying the slots state
          const updatedSlots = [...slots];
          if (updatedSlots[index] && updatedSlots[index].slot) {
            updatedSlots[index].slot = updatedSlots[index].slot.filter(
              (_, idx) => idx !== slotIndex,
            );
          }
          updatedSlots[index].splice(slotIndex, 1);

          setSlots(updatedSlots);
        }
        setSelectDayToDeleteSlot({});
      });
    } else {
      dispatch(delete_Availability_forSlots(dateInput)).then(res => {
        if (delete_Availability_forSlots.fulfilled.match(res)) {
          const updatedSelectedDates = [...selectedDates];
          // Find the corresponding day entry and remove the slot at slotIndex
          if (updatedSelectedDates[index] && updatedSelectedDates[index].slot) {
            updatedSelectedDates[index].slot = updatedSelectedDates[
              index
            ].slot.filter((_, idx) => idx !== slotIndex);
          }
          // Update the selectedDates state with the modified array
          setSelectedDates(updatedSelectedDates);
          // Optionally, update the slots if you're also modifying the slots state
          const updatedSlots = [...timeSlots];
          if (updatedSlots[index] && updatedSlots[index].slot) {
            updatedSlots[index].slot = updatedSlots[index].slot.filter(
              (_, idx) => idx !== slotIndex,
            );
          }
          updatedSlots[index].splice(slotIndex, 1);
          setTimeSlots(updatedSlots);
        }
        setSelectDayToDeleteSlot({});
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : ''}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentView}>
          <View style={styles.availabilityWrapper}>
            <View style={styles.availabiltyTextView}>
              <GText
                beVietnamSemiBold
                text="Available for New Matches"
                style={styles.newMatchesLabel}
              />
              <GText
                beVietnamRegular
                text={`Set your availability for new matches and \nmeetings`}
                style={styles.setAvailabilityText}
              />
            </View>
            <View style={styles.toggleView}>
              <ToggleButton
                toggleState={mainToggleState}
                setToggleState={handleMainToggle}
                width={50}
                height={28}
                circleWidth={24}
                outRange={22}
              />
            </View>
          </View>
          <GText
            beVietnamSemiBold
            text="Communication Preferences"
            style={styles.preferencesHeader}
          />
          <View style={styles.preferenceView}>
            {preferences.map((preference, index) => (
              <View key={preference.id} style={styles.preferenceRow}>
                <GText text={preference.name} style={styles.preferenceText} />
                <ToggleButton
                  toggleState={preference.toggleState}
                  setToggleState={val =>
                    handleToggle(
                      preference.toggleState,
                      preference.setMainToggleState,
                      preference.type,
                    )
                  }
                  width={50}
                  height={28}
                  circleWidth={24}
                  outRange={22}
                />
              </View>
            ))}
          </View>
          <View style={styles.availabilityView}>
            <GText
              beVietnamSemiBold
              text="Set Availability"
              style={styles.availabilityText}
            />
            <GText
              beVietnamSemiBold
              text=" ( 30 mins )"
              style={styles.availabilityMinText}
            />
          </View>
          <GText beVietnamSemiBold text="Set by" style={styles.setByText} />
          <View style={styles.filterView}>
            {filter?.map(i =>
              select?.title == i?.title ? (
                <GradientButton
                  gradientColor={['#DA7575', '#A45EB0']}
                  title={i?.title}
                  gradientstyle={styles.gradientStyle}
                  textstyle={styles.dateButtonText}
                  onPress={() => {
                    setSelect(i);
                  }}
                />
              ) : (
                <GradientBorderButton
                  activeOpacity={0.8}
                  title={i.title}
                  onPress={() => setSelect(i)}
                  buttonStyle={styles.buttonStyle}
                />
              ),
            )}
          </View>
          {select?.title === 'Days' ? (
            <View style={styles.weekArrayView}>
              {weekArray?.map((i, index) => (
                <View style={styles.tileView}>
                  <View style={styles.upperInnerView}>
                    <View style={styles.weekTitleView}>
                      <View style={styles.checkWeekTitleView}>
                        <TouchableOpacity
                          hitSlop={styles.hitSlop}
                          onPress={() => {
                            setSelectedDays(prevSelectedDays => {
                              const isSelected = prevSelectedDays.some(
                                item => item.name === i?.week,
                              );
                              if (isSelected) {
                                // If the week is already selected, remove it
                                return prevSelectedDays.filter(
                                  item => item.name !== i?.week,
                                );
                              } else {
                                // Otherwise, add it to the selected list
                                return [
                                  ...prevSelectedDays,
                                  {name: i?.week, type: 'day', status: 1},
                                ];
                              }
                            });

                            handleCheckToggle(index);
                          }}>
                          <Image
                            source={
                              checkStates[index] ? Images.Check : Images.UnCheck
                            }
                            style={styles.checkImg}
                          />
                        </TouchableOpacity>
                        <GText
                          beVietnamMedium
                          text={i?.week}
                          style={styles.weekText}
                        />
                      </View>
                      {checkStates[index] && (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedDays(prevSelectedDays => {
                              const isSelected = prevSelectedDays.some(
                                item => item.name === i?.week,
                              );
                              if (isSelected) {
                                // If the week is already selected, remove it

                                return prevSelectedDays.some(
                                  item => item.name === i?.week,
                                )
                                  ? prevSelectedDays // If it exists, keep the original array
                                  : [...prevSelectedDays, item];
                                // return prevSelectedDays.map(item =>
                                //   item.name === i?.week
                                //     ? {name: i?.week, status: 1, type: 'day'}
                                //     : item,
                                // );

                                // return prevSelectedDays.filter(
                                //   item => item.name !== i?.week,
                                // );
                              } else {
                                // Otherwise, add it to the selected list
                                return [
                                  ...prevSelectedDays,
                                  {name: i?.week, type: 'day', status: 1},
                                ];
                              }
                            });
                            addSlot(index);
                          }}
                          style={styles.slotView}>
                          <Image
                            source={Images.PlusCircle}
                            style={styles.checkImg}
                          />
                          <GText
                            beVietnamSemiBold
                            text="Add Slot"
                            style={styles.slotText}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    {checkStates[index] &&
                      slots[index].map((slot, slotIndex) => (
                        <View style={styles.slotMainView}>
                          <View style={styles.slotInnerView}>
                            <View style={styles.inputView}>
                              <TextInput
                                keyboardType="number-pad"
                                value={slot.hour}
                                placeholder={'HH'}
                                placeholderTextColor={'#ccc'}
                                // editable={() => {
                                //   const getWeekDay =
                                //     myAvailability?.slots?.find(
                                //       slot => slot?.name === i?.week,
                                //     );
                                //   const time = getWeekDay
                                //     ? getWeekDay.slot[slotIndex]
                                //     : null;

                                //   return false;
                                // }}
                                editable={(() => {
                                  const getWeekDay =
                                    myAvailability?.slots?.find(
                                      slot => slot?.name === i?.week,
                                    );
                                  const time = getWeekDay
                                    ? getWeekDay.slot[slotIndex]
                                    : null;

                                  // Return true or false based on your logic
                                  return time?._id ? false : true; // Replace with your condition
                                })()} // Immediately Invoked Function Expression (IIFE)
                                maxLength={2}
                                onChangeText={text =>
                                  handleTimeChange(
                                    index,
                                    slotIndex,
                                    'hour',
                                    text,
                                  )
                                }
                                style={styles.inputStyle}
                              />
                              <GText
                                satoshiBold
                                text=":"
                                style={styles.threeDotText}
                              />
                              <TextInput
                                keyboardType="number-pad"
                                placeholder="MM"
                                placeholderTextColor={'#ccc'}
                                maxLength={2}
                                editable={(() => {
                                  const getWeekDay =
                                    myAvailability?.slots?.find(
                                      slot => slot?.name === i?.week,
                                    );
                                  const time = getWeekDay
                                    ? getWeekDay.slot[slotIndex]
                                    : null;

                                  // Return true or false based on your logic
                                  return time?._id ? false : true; // Replace with your condition
                                })()} // Immediately Invoked Function Expression (IIFE)
                                value={slot.minute}
                                onChangeText={text =>
                                  handleTimeChange(
                                    index,
                                    slotIndex,
                                    'minute',
                                    text,
                                  )
                                }
                                style={styles.inputStyle}
                              />
                            </View>

                            {timeFormat?.map(a => (
                              <View style={styles.timeFormatView}>
                                <TouchableOpacity
                                  disabled={(() => {
                                    const getWeekDay =
                                      myAvailability?.slots?.find(
                                        slot => slot?.name === i?.week,
                                      );
                                    const time = getWeekDay
                                      ? getWeekDay.slot[slotIndex]
                                      : null;
                                    console.log('123445', time);

                                    // Return true or false based on your logic
                                    return time?._id ? true : false; // Replace with your condition
                                  })()} // Immediately Invoked Function Expression (IIFE)
                                  onPress={() =>
                                    handleTimeChange(
                                      index,
                                      slotIndex,
                                      'format',
                                      a.value,
                                    )
                                  }>
                                  <Image
                                    source={
                                      slot.format === a.value
                                        ? Images.RadioCheck
                                        : Images.RadioUnCheck
                                    }
                                    style={styles.radioImg}
                                  />
                                </TouchableOpacity>
                                <GText
                                  text={a?.title}
                                  style={styles.timeText(
                                    selectTimeFormat?.title,
                                    a?.title,
                                  )}
                                />
                              </View>
                            ))}
                          </View>

                          <TouchableOpacity
                            onPress={() => {
                              if (selectedDays?.length > 0) {
                                const updatedSelectedDates = [...selectedDays];

                                // Find the corresponding day entry and remove the slot at slotIndex
                                if (
                                  updatedSelectedDates[index] &&
                                  updatedSelectedDates[index].slot
                                ) {
                                  updatedSelectedDates[index].slot =
                                    updatedSelectedDates[index].slot.filter(
                                      (_, idx) => idx !== slotIndex,
                                    );
                                }

                                // Update the selectedDates state with the modified array
                                setSelectedDays(updatedSelectedDates);

                                // Optionally, update the slots if you're also modifying the slots state
                                const updatedSlots = [...slots];
                                if (
                                  updatedSlots[index] &&
                                  updatedSlots[index].slot
                                ) {
                                  updatedSlots[index].slot = updatedSlots[
                                    index
                                  ].slot.filter((_, idx) => idx !== slotIndex);
                                }
                                updatedSlots[index].splice(slotIndex, 1);

                                setSlots(updatedSlots);
                              } else {
                                setSelectDayToDeleteSlot({i, index, slotIndex});
                                setTimeout(() => {
                                  setShowSlotModal(true);
                                }, 300);
                              }

                              // const updatedSelectedDates = [...selectedDays];

                              // // Find the corresponding day entry and remove the slot at slotIndex
                              // if (
                              //   updatedSelectedDates[index] &&
                              //   updatedSelectedDates[index].slot
                              // ) {
                              //   updatedSelectedDates[index].slot =
                              //     updatedSelectedDates[index].slot.filter(
                              //       (_, idx) => idx !== slotIndex,
                              //     );
                              // }

                              // // Update the selectedDates state with the modified array
                              // setSelectedDays(updatedSelectedDates);

                              // // Optionally, update the slots if you're also modifying the slots state
                              // const updatedSlots = [...slots];
                              // if (
                              //   updatedSlots[index] &&
                              //   updatedSlots[index].slot
                              // ) {
                              //   updatedSlots[index].slot = updatedSlots[
                              //     index
                              //   ].slot.filter((_, idx) => idx !== slotIndex);
                              // }
                              // updatedSlots[index].splice(slotIndex, 1);

                              // setSlots(updatedSlots);
                            }}
                            style={styles.trashView}>
                            <Image
                              source={Images.RedTrash}
                              style={styles.trashImg}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                  </View>
                  {myAvailability?.slots
                    ?.map(slot => slot.name)
                    .includes(i?.week) && (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectDayToDelete(i, index);
                        setTimeout(() => {
                          setShowModal(true);
                        }, 300);
                      }}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#C9868633',
                        paddingVertical: scaledValue(12),
                        marginTop: scaledValue(20),
                        borderRadius: scaledValue(20),
                        justifyContent: 'center',
                        gap: scaledValue(6),
                      }}>
                      <Image
                        tintColor={'#C98686'}
                        source={Images.Trash}
                        style={{
                          width: scaledValue(16),
                          height: scaledValue(16),
                        }}
                      />
                      <GText
                        beVietnamSemiBold
                        text={'Delete'}
                        style={{
                          fontSize: scaledValue(16),
                          color: '#C98686',
                          letterSpacing: scaledValue(16 * -0.02),
                          lineHeight: scaledHeightValue(20.8),
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View
              style={[
                styles.weekArrayView,
                {
                  marginBottom: scaledValue(24),
                },
              ]}>
              {dateArray?.map((i, index) => (
                <View style={styles.dateTile}>
                  <View style={styles.dateInnerTileView}>
                    {i?.status === 1 ? (
                      <TouchableOpacity
                        disabled={true}
                        onPress={() => setOpen(true)}>
                        <GText
                          beVietnamBold
                          text={
                            // weekday === 'Invalid Date' ? currentDay : weekday
                            getDay(i?.name)
                          }
                          style={styles.dayText}
                        />
                        <GText
                          medium
                          text={getFormattedDate(i?.name)}
                          style={styles.currentDayText}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        // onPress={() => setOpen(true)}
                        activeOpacity={0.7}
                        style={styles.datePickerView}>
                        <GText
                          beVietnamSemiBold
                          text={convertDateToReadableFormat(i?.name)}
                          style={styles.currentDateText}
                        />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={() => {
                        setIsSelectDate(prevSelectedDays => {
                          const isSelected = prevSelectedDays.some(
                            item => item?.name === i?.name,
                          );
                          if (isSelected) {
                            // If the week is already selected, remove it

                            return prevSelectedDays.some(
                              item => item?.name === i?.name,
                            )
                              ? prevSelectedDays // If it exists, keep the original array
                              : [...prevSelectedDays, item];
                            // return prevSelectedDays.map(item =>
                            //   item.name === i?.week
                            //     ? {name: i?.week, status: 1, type: 'day'}
                            //     : item,
                            // );

                            // return prevSelectedDays.filter(
                            //   item => item.name !== i?.week,
                            // );
                          } else {
                            // Otherwise, add it to the selected list
                            return [
                              ...prevSelectedDays,
                              {name: i?.name, type: 'date', status: 1},
                            ];
                          }
                        });
                        addDateSlot(index);
                      }}
                      style={styles.slotView}>
                      <Image
                        source={Images.PlusCircle}
                        style={styles.checkImg}
                      />
                      <GText
                        beVietnamSemiBold
                        text="Add Slot"
                        style={styles.slotText}
                      />
                    </TouchableOpacity>
                  </View>

                  {timeSlots[index]?.map((slot, slotIndex) => (
                    <View
                      style={[
                        styles.slotMainView,
                        {paddingHorizontal: scaledValue(16)},
                      ]}>
                      <View style={[styles.slotInnerView, {marginLeft: 0}]}>
                        <View style={styles.inputView}>
                          <TextInput
                            keyboardType="number-pad"
                            placeholder={'HH'}
                            placeholderTextColor={'#ccc'}
                            editable={(() => {
                              const getWeekDay = myAvailability?.slots?.find(
                                slot => slot?.name === i?.name,
                              );
                              const time = getWeekDay
                                ? getWeekDay.slot[slotIndex]
                                : null;

                              // Return true or false based on your logic
                              return time?._id ? false : true; // Replace with your condition
                            })()}
                            value={slot.hour}
                            maxLength={2}
                            onChangeText={text =>
                              handleTimeDateChange(
                                index,
                                slotIndex,
                                'hour',
                                text,
                              )
                            }
                            style={styles.inputStyle}
                          />
                          <GText
                            satoshiBold
                            text=":"
                            style={styles.threeDotText}
                          />
                          <TextInput
                            keyboardType="number-pad"
                            placeholder={'MM'}
                            placeholderTextColor={'#ccc'}
                            editable={(() => {
                              const getWeekDay = myAvailability?.slots?.find(
                                slot => slot?.name === i?.name,
                              );
                              const time = getWeekDay
                                ? getWeekDay.slot[slotIndex]
                                : null;

                              // Return true or false based on your logic
                              return time?._id ? false : true; // Replace with your condition
                            })()}
                            value={slot.minute}
                            maxLength={2}
                            onChangeText={text =>
                              handleTimeDateChange(
                                index,
                                slotIndex,
                                'minute',
                                text,
                              )
                            }
                            style={styles.inputStyle}
                          />
                        </View>

                        {timeFormat?.map(a => (
                          <View style={styles.timeFormatView}>
                            <TouchableOpacity
                              disabled={(() => {
                                const getWeekDay = myAvailability?.slots?.find(
                                  slot => slot?.name === i?.name,
                                );
                                const time = getWeekDay
                                  ? getWeekDay.slot[slotIndex]
                                  : null;
                                console.log('123445', time);

                                // Return true or false based on your logic
                                return time?._id ? true : false; // Replace with your condition
                              })()}
                              onPress={() =>
                                handleTimeDateChange(
                                  index,
                                  slotIndex,
                                  'format',
                                  a.value,
                                )
                              }>
                              <Image
                                source={
                                  slot.format === a.value
                                    ? Images.RadioCheck
                                    : Images.RadioUnCheck
                                }
                                style={styles.radioImg}
                              />
                            </TouchableOpacity>
                            <GText
                              text={a?.title}
                              style={styles.timeText(
                                selectTimeFormat?.title,
                                a?.title,
                              )}
                            />
                          </View>
                        ))}
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          if (isSelectDate?.length > 0) {
                            const updatedSelectedDates = [...selectedDates];
                            // Find the corresponding day entry and remove the slot at slotIndex
                            if (
                              updatedSelectedDates[index] &&
                              updatedSelectedDates[index].slot
                            ) {
                              updatedSelectedDates[index].slot =
                                updatedSelectedDates[index].slot.filter(
                                  (_, idx) => idx !== slotIndex,
                                );
                            }
                            // Update the selectedDates state with the modified array
                            setSelectedDates(updatedSelectedDates);
                            const updatedIsSelectedDate = [...isSelectDate];
                            // Find the corresponding day entry and remove the slot at slotIndex
                            if (
                              updatedIsSelectedDate[index] &&
                              updatedIsSelectedDate[index].slot
                            ) {
                              updatedIsSelectedDate[index].slot =
                                updatedIsSelectedDate[index].slot.filter(
                                  (_, idx) => idx !== slotIndex,
                                );
                            }
                            setIsSelectDate(updatedIsSelectedDate);
                            // Optionally, update the slots if you're also modifying the slots state
                            const updatedSlots = [...timeSlots];
                            if (
                              updatedSlots[index] &&
                              updatedSlots[index].slot
                            ) {
                              updatedSlots[index].slot = updatedSlots[
                                index
                              ].slot.filter((_, idx) => idx !== slotIndex);
                            }
                            updatedSlots[index].splice(slotIndex, 1);
                            setTimeSlots(updatedSlots);
                          } else {
                            setSelectDayToDeleteSlot({i, index, slotIndex});
                            setTimeout(() => {
                              setShowSlotModal(true);
                            }, 300);
                          }

                          // const updatedSelectedDates = [...selectedDates];
                          // // Find the corresponding day entry and remove the slot at slotIndex
                          // if (
                          //   updatedSelectedDates[index] &&
                          //   updatedSelectedDates[index].slot
                          // ) {
                          //   updatedSelectedDates[index].slot =
                          //     updatedSelectedDates[index].slot.filter(
                          //       (_, idx) => idx !== slotIndex,
                          //     );
                          // }
                          // // Update the selectedDates state with the modified array
                          // setSelectedDates(updatedSelectedDates);
                          // // Optionally, update the slots if you're also modifying the slots state
                          // const updatedSlots = [...timeSlots];
                          // if (updatedSlots[index] && updatedSlots[index].slot) {
                          //   updatedSlots[index].slot = updatedSlots[
                          //     index
                          //   ].slot.filter((_, idx) => idx !== slotIndex);
                          // }
                          // updatedSlots[index].splice(slotIndex, 1);
                          // setTimeSlots(updatedSlots);
                        }}
                        style={styles.trashView}>
                        <Image
                          source={Images.RedTrash}
                          style={styles.trashImg}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity
                    onPress={() => {
                      setSelectDayToDelete(i, index);
                      setTimeout(() => {
                        setShowModal(true);
                      }, 300);
                    }}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#C9868633',
                      paddingVertical: scaledValue(12),
                      marginTop: scaledValue(20),
                      borderRadius: scaledValue(20),
                      justifyContent: 'center',
                      gap: scaledValue(6),
                      marginHorizontal: scaledValue(15),
                    }}>
                    <Image
                      tintColor={'#C98686'}
                      source={Images.Trash}
                      style={{
                        width: scaledValue(16),
                        height: scaledValue(16),
                      }}
                    />
                    <GText
                      beVietnamSemiBold
                      text={'Delete'}
                      style={{
                        fontSize: scaledValue(16),
                        color: '#C98686',
                        letterSpacing: scaledValue(16 * -0.02),
                        lineHeight: scaledHeightValue(20.8),
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          {select?.title === 'Date' && (
            <TouchableOpacity
              disabled={selectedDates?.length < 0}
              // onPress={add_availability_hit}
              onPress={() => {
                // setDateArray([
                //   {
                //     id: 1,
                //     name: getCurrentDate(new Date()),
                //   },
                // ]);
                setOpen(true);
              }}
              style={styles.touchableButtonStyle}>
              <Image source={Images.homeAdd} style={styles.checkImg} />
              <GText
                medium
                text={'Add Schedule'}
                style={styles.addButtonText}
              />
            </TouchableOpacity>
          )}

          <GradientButton
            gradientColor={['#DA7575', '#A45EB0']}
            title={'⏰   Update Availability'}
            gradientstyle={styles.gradientUpdateStyle}
            textstyle={styles.buttonText}
            onPress={add_availability_hit}
          />
        </View>
      </ScrollView>
      <Modal isVisible={showModal} onBackdropPress={() => setShowModal(false)}>
        <View
          style={{
            width: '95%',
            paddingVertical: scaledValue(20),
            backgroundColor: colors.offWhite,
            alignSelf: 'center',
            borderRadius: scaledValue(8),
          }}>
          <GText
            text={'Do you want to delete all slots for this day?'}
            style={{
              textAlign: 'center',
              lineHeight: scaledHeightValue(19.08),
              fontSize: scaledValue(16),
            }}
          />
          <GText
            text={'Please confirm to continue.'}
            style={{
              textAlign: 'center',
              lineHeight: scaledHeightValue(19.08),
              fontSize: scaledValue(16),
            }}
          />
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
                height: scaledValue(30),
                paddingHorizontal: scaledValue(20),
              }}
              textstyle={{
                fontSize: scaledValue(14),
                letterSpacing: scaledValue(14 * -0.02),
              }}
              onPress={() => {
                deleteAllSlots(selectDayToDelete);
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
                paddingHorizontal: scaledValue(15),
              }}
              buttonTextStyle={{
                lineHeight: scaledHeightValue(19),
              }}
              buttonStyle={{
                height: scaledValue(30),
              }}
            />
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={showSlotModal}
        onBackdropPress={() => setShowSlotModal(false)}>
        <View
          style={{
            width: '95%',
            paddingVertical: scaledValue(20),
            backgroundColor: colors.offWhite,
            alignSelf: 'center',
            borderRadius: scaledValue(8),
          }}>
          <GText
            text={'Do you want to delete this slot?'}
            style={{
              textAlign: 'center',
              lineHeight: scaledHeightValue(19.08),
              fontSize: scaledValue(16),
            }}
          />
          <GText
            text={'Please confirm to continue.'}
            style={{
              textAlign: 'center',
              lineHeight: scaledHeightValue(19.08),
              fontSize: scaledValue(16),
            }}
          />
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
                height: scaledValue(30),
                paddingHorizontal: scaledValue(20),
              }}
              textstyle={{
                fontSize: scaledValue(14),
                letterSpacing: scaledValue(14 * -0.02),
              }}
              onPress={() => {
                deleteSpecificSlot(selectDayToDeleteSlot);
              }}
            />
            <GradientBorderButton
              activeOpacity={0.8}
              title={'Cancel'}
              onPress={() => {
                setShowSlotModal(false);
              }}
              inner={{
                backgroundColor: '#FFF4EC',
                paddingHorizontal: scaledValue(15),
              }}
              buttonTextStyle={{
                lineHeight: scaledHeightValue(19),
              }}
              buttonStyle={{
                height: scaledValue(30),
              }}
            />
          </View>
        </View>
      </Modal>
      <DatePicker
        modal
        open={open}
        date={date || new Date()}
        mode="date"
        onConfirm={date => {
          setDate(date);
          const isDateExists = dateArray.some(
            item => item.name === getCurrentDate(date),
          );

          if (!isDateExists) {
            setTimeSlots(prev => [
              ...prev,
              [{hour: '', minute: '', format: ''}], // Add a new array with an initial object
            ]);
            setDateArray(prev => [
              ...prev,
              {
                id: prev.length + 1,
                name: getCurrentDate(date),
              },
            ]);
            setSelectedDates(prevSelectedDays => {
              // Otherwise, add it to the selected list
              return [
                ...prevSelectedDays,
                {
                  type: 'date',
                  status: 1,
                  name: getCurrentDate(date),
                },
              ];
            });
          } else {
            showToast(0, 'Date already exist');
          }
          setOpen(false);
        }}
        minimumDate={today} // Disable past months
        maximumDate={next31Days} // Disable future months (after this month)
        onCancel={() => setOpen(false)}
      />
    </KeyboardAvoidingView>
  );
};

export default ManageAvailability;
