import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import {navigationContainerRef} from '../../App';
import {EventRegister} from 'react-native-event-listeners';

const ForegroundHandler = () => {
  PushNotification.configure({
    onNotification: async notification => {
      if (notification?.foreground) {
        if (notification?.userInteraction) {
          navigationContainerRef?.navigate('StackScreens', {
            screen: 'NotificationScreen',
          });
        }

        if (notification?.foreground == false) {
          if (notification?.userInteraction) {
            navigationContainerRef?.navigate('StackScreens', {
              screen: 'NotificationScreen',
            });
          }
        } else {
          navigationContainerRef?.navigate('StackScreens', {
            screen: 'NotificationScreen',
          });
        }
      }
    },
    popInitialNotification: true,
  });
  PushNotification.popInitialNotification(notification => {
    console.log('Initial Notification', notification);
  });
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('remoteMessage00500', remoteMessage);
    if (remoteMessage !== '') {
      console.log('here');

      global.NavigateToNotification = true;
    }
  });

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          const {notification} = detail;
          console.log('notificationssss', notification);
          navigationContainerRef?.navigate('StackScreens', {
            screen: 'NotificationScreen',
          });

          break;
      }
    });
  }, []);

  useEffect(() => {
    //FOREGROUND STATE
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('handle in foreground123456', remoteMessage);
      const {notification, messageId, data} = remoteMessage;
      EventRegister.emit('notificationReceived', data);
      if (Platform.OS === 'ios') {
        const channelId = await notifee.createChannel({
          id: messageId,
          name: messageId,
        });
        await notifee.displayNotification({
          title: notification?.title,
          body: notification?.body,
          data: data,
          android: {
            channelId,
            pressAction: {
              id: 'default',
            },
          },
        });
      } else {
        PushNotification.createChannel(
          {
            channelId: messageId, // (required)
            channelName: messageId, // (required)
            importance: 4, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
          },
          created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
        );
        PushNotification.localNotification({
          channelId: messageId, //his must be same with channelid in createchannel
          title: notification?.title,
          message: notification?.body,
          userInfo: data,
        });
      }
    });
    return unsubscribe;
  }, []);
  return null;
};

export default ForegroundHandler;
