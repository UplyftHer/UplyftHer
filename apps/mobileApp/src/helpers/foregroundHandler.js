// import {useEffect} from 'react';
// import messaging from '@react-native-firebase/messaging';
// import PushNotification from 'react-native-push-notification';
// import notifee, {EventType} from '@notifee/react-native';
// import {Platform, AppState} from 'react-native';
// import {navigationContainerRef} from '../../App';
// import {EventRegister} from 'react-native-event-listeners';

// let lastNotificationId = null; // To track duplicate notifications

// const ForegroundHandler = () => {
//   useEffect(() => {
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       console.log('📥 Foreground FCM:', remoteMessage);

//       const {notification, data, messageId} = remoteMessage;
//       const currentId =
//         messageId || data?.id || `${notification?.title}-${notification?.body}`;

//       if (lastNotificationId === currentId) {
//         console.log('🛑 Duplicate notification skipped');
//         return;
//       }
//       lastNotificationId = currentId;

//       EventRegister.emit('notificationReceived', data);

//       if (Platform.OS === 'ios') {
//         const channelId = await notifee.createChannel({
//           id: 'default',
//           name: 'Default Channel',
//         });

//         await notifee.displayNotification({
//           title: notification?.title,
//           body: notification?.body,
//           data: data,
//           android: {
//             channelId,
//             pressAction: {
//               id: 'default',
//             },
//           },
//         });
//       } else {
//         PushNotification.createChannel(
//           {
//             channelId: 'default',
//             channelName: 'Default Channel',
//             importance: 4,
//             vibrate: true,
//           },
//           created => console.log(`🔔 Channel created: ${created}`),
//         );

//         PushNotification.localNotification({
//           channelId: 'default',
//           title: notification?.title,
//           message: notification?.body,
//           userInfo: data,
//         });
//       }
//     });

//     return unsubscribe;
//   }, []);

//   // Foreground notification tap
//   useEffect(() => {
//     return notifee.onForegroundEvent(({type, detail}) => {
//       if (type === EventType.PRESS) {
//         console.log('📲 Foreground notification tapped');
//         navigationContainerRef?.navigate('StackScreens', {
//           screen: 'NotificationScreen',
//         });
//       }
//     });
//   }, []);

//   // Background state - app opened from notification
//   useEffect(() => {
//     const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
//       if (remoteMessage) {
//         console.log('📤 Opened from background');
//         const currentId = remoteMessage?.messageId || remoteMessage?.data?.id;

//         if (lastNotificationId === currentId) {
//           console.log('🛑 Skipping duplicate open');
//           return;
//         }

//         lastNotificationId = currentId;

//         navigationContainerRef?.navigate('StackScreens', {
//           screen: 'NotificationScreen',
//         });
//       }
//     });

//     return unsubscribe;
//   }, []);

//   // Quit state - app launched by tapping a notification
//   useEffect(() => {
//     messaging()
//       .getInitialNotification()
//       .then(remoteMessage => {
//         if (remoteMessage) {
//           console.log('🚀 Opened from quit state');
//           const currentId = remoteMessage?.messageId || remoteMessage?.data?.id;

//           if (lastNotificationId === currentId) {
//             console.log('🛑 Skipping duplicate launch');
//             return;
//           }

//           lastNotificationId = currentId;

//           navigationContainerRef?.navigate('StackScreens', {
//             screen: 'NotificationScreen',
//           });
//         }
//       });
//   }, []);

//   return null;
// };

// export default ForegroundHandler;

// FOR ANDROID

import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import notifee, {EventType} from '@notifee/react-native';
import {Platform} from 'react-native';
import {navigationContainerRef} from '../../App';
import {EventRegister} from 'react-native-event-listeners';

let lastNotificationId = null;

// PushNotification configuration (Android)
PushNotification.configure({
  onNotification: function (notification) {
    console.log('📲 Android notification tap:', notification);

    if (notification?.userInteraction) {
      navigationContainerRef?.navigate('StackScreens', {
        screen: 'NotificationScreen',
      });
    }
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});

const ForegroundHandler = () => {
  // Foreground FCM message handler
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('📥 Foreground FCM:', remoteMessage);

      const {notification, data, messageId} = remoteMessage;
      const currentId =
        messageId || data?.id || `${notification?.title}-${notification?.body}`;

      if (lastNotificationId === currentId) {
        console.log('🛑 Duplicate notification skipped');
        return;
      }
      lastNotificationId = currentId;

      EventRegister.emit('notificationReceived', data);

      if (Platform.OS === 'ios') {
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
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
            channelId: 'default',
            channelName: 'Default Channel',
            importance: 4,
            vibrate: true,
          },
          created => console.log(`🔔 Channel created: ${created}`),
        );

        PushNotification.localNotification({
          channelId: 'default',
          title: notification?.title,
          message: notification?.body,
          userInfo: data,
          playSound: true,
          soundName: 'default',
          importance: 'high',
        });
      }
    });

    return unsubscribe;
  }, []);

  // iOS foreground notification tap
  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.PRESS) {
        console.log('📲 Foreground notification tapped (iOS)');
        navigationContainerRef?.navigate('StackScreens', {
          screen: 'NotificationScreen',
        });
      }
    });
  }, []);

  // App opened from background
  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        console.log('📤 Opened from background');
        const currentId = remoteMessage?.messageId || remoteMessage?.data?.id;

        if (lastNotificationId === currentId) {
          console.log('🛑 Skipping duplicate open');
          return;
        }

        lastNotificationId = currentId;

        navigationContainerRef?.navigate('StackScreens', {
          screen: 'NotificationScreen',
        });
      }
    });

    return unsubscribe;
  }, []);

  // App opened from quit state
  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('🚀 Opened from quit state');
          const currentId = remoteMessage?.messageId || remoteMessage?.data?.id;

          if (lastNotificationId === currentId) {
            console.log('🛑 Skipping duplicate launch');
            return;
          }

          lastNotificationId = currentId;

          navigationContainerRef?.navigate('StackScreens', {
            screen: 'NotificationScreen',
          });
        }
      });
  }, []);

  return null;
};

export default ForegroundHandler;
