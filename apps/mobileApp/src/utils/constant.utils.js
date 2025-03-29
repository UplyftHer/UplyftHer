import store from '../redux/store';

export const yourInterestsList = [
  {
    id: 1,
    title: 'Career Growth',
  },
  {
    id: 2,
    title: 'Mental Health',
  },
  {
    id: 3,
    title: 'Creativity',
  },
  {
    id: 4,
    title: 'Leadership',
  },
  {
    id: 5,
    title: 'Coaching',
  },
];

export function getUser() {
  const state = store.getState();
  const userData = state.auth?.user;
  console.log('123456478914256', store.getState().auth.user);

  return userData ? userData : null;
}

export const modeData = [
  {title: '🎥 Video Call', mode: 'videoCall'},
  {title: '📞 Phone Call', mode: 'audioCall'},
  {title: '☕️ In-person', mode: 'inPerson'},
];

export const dateData = [
  {month: 'Wed', date: '18 Sep', id: 1},
  {month: 'Thu', date: '19 Sep', id: 2},
  {month: 'Fri', date: '20 Sep', id: 3},
  {month: 'Sat', date: '21 Sep', id: 4},
  {month: 'Sun', date: '22 Sep', id: 5},
  {month: 'Mon', date: '23 Sep', id: 6},
];

export const formatDate = dateString => {
  const date = new Date(dateString); // Parse the input string
  const options = {year: 'numeric', month: 'long', day: '2-digit'};
  return new Intl.DateTimeFormat('en-US', options)?.format(date);
};

// const sortedAppointments = upComingMeetingList?.sort((a, b) => {
//   // Compare by date
//   if (a.date !== b.date) {
//     return new Date(a.date) - new Date(b.date); // Latest date first
//   }

//   // Compare by time (slot)
//   const timeA = new Date(`1970-01-01T${convertTo24Hour(a.slot)}:00`);
//   const timeB = new Date(`1970-01-01T${convertTo24Hour(b.slot)}:00`);
//   return timeA - timeB; // Latest time first
// });

// Helper function to convert 12-hour time to 24-hour time
export function convertTo24Hour(time) {
  const [hour, minute, period] = time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
  const isPM = period === 'PM';
  const adjustedHour =
    isPM && hour !== '12' ? +hour + 12 : hour === '12' && !isPM ? '00' : hour;
  return `${adjustedHour}:${minute}`;
}
