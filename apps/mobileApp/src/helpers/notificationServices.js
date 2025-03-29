import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {EventRegister} from 'react-native-event-listeners';

// code for accessing permission
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  //   getFcmToken();
  if (enabled) {
    console.log('enabledStatus', enabled);

    console.log('Authorization statuss:', authStatus);
    getFcmToken();
  }
}

// code for getting & refreshing token
const getFcmToken = async () => {
  let checkToken = await AsyncStorage.getItem('fcmToken');
  console.log('the old token is:', checkToken);
  if (!checkToken) {
    try {
      const fcmToken = await messaging().getToken();
      // const refreshToken = messaging().onTokenRefresh();
      if (!!fcmToken) {
        console.log('fcm token generated', fcmToken);
        EventRegister.emit('fcmToken', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
      // if (!!refreshToken) {
      //   console.log('refresh token is: ', refreshToken);
      //   await AsyncStorage.setItem('fcmToken', refreshToken);
      // }
    } catch (error) {
      console.log('error is:=====>', error);
    }
  }
};

// code for background notification
export const notificationListener = async () => {
  // const navigation = useNavigation();
  //BACKGROUND STATE
  messaging().onNotificationOpenedApp(async remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    // navigation.navigate(NOTIFICATION);
    console.log('background state:', remoteMessage.notification);
  });

  messaging().onMessage(remoteMessage => {
    console.log('remotemessage is===>', remoteMessage);
  });

  // Check whether an initial notification is available //KILLED STATE
  messaging().getInitialNotification();

  //check whether notification received for background state
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    if (notification?.userInteraction) {
      // alert('Coming from app kill state!!');
      //   navigation.navigate('Profile', {screen: NOTIFICATION});
    }
    const {messageId, notification} = remoteMessage;
    // if (Platform.OS === 'ios') {
    //   PushNotificationIOS?.addNotificationRequest({
    //     id: messageId,
    //     title: 'someone commented on your post',
    //     body: notification.body,
    //     sound: 'default',
    //   });
    // }
  });
};
