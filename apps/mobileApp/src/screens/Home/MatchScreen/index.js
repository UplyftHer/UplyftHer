import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {Images} from '../../../utils';
import GText from '../../../components/GText';
import GButton from '../../../components/GButton';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';
import GImage from '../../../components/GImage';
import {start_conversation} from '../../../redux/slices/communicationSlice';

const MatchScreen = ({navigation, route}) => {
  const {itemData, screen, requestId, setData} = route?.params;
  const userData = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  console.log('userDatauserDatauserDatas', userData, itemData?.cognitoUserId);

  const start_conversation_hit = () => {
    const input = {
      cognitoUserId: itemData?.cognitoUserId,
    };
    dispatch(start_conversation(input)).then(res => {
      if (start_conversation.fulfilled.match(res)) {
        navigation?.goBack();
        if (screen === 'Inbox') {
          if (itemData?.startConversation?.includes(userData?.cognitoUserId)) {
            console.log('ID exists in the array.');
          } else {
            console.log('ID does not exist in the array.');
            setData(prevData => {
              // Clone the previous data to avoid mutating state directly
              const newData = [...prevData];

              // Find the item with the specified requestId
              const itemToUpdate = newData.find(i => i?._id === requestId);

              if (itemToUpdate) {
                // Update `isRead` to 1

                if (
                  !itemToUpdate?.startConversation?.includes(
                    userData?.cognitoUserId,
                  )
                ) {
                  itemToUpdate?.startConversation?.push(
                    userData?.cognitoUserId,
                  ); // Add ID to the array
                }

                // Log the updated item for debugging
                console.log('Updated item:', itemToUpdate);
              }

              // Return the updated data
              return newData;
            });
          }
          navigation?.navigate('StackScreens', {
            screen: 'ChatScreen',
            params: {
              otherUserData: itemData,
            },
          });
        } else if (screen === 'Notification') {
          setData(prevData => {
            // Clone the previous data to avoid mutating state directly
            const newData = [...prevData];

            // Find the item with the specified requestId
            const itemToUpdate = newData.find(i => i?.requestId === requestId);

            if (itemToUpdate) {
              // Update `isRead` to 1
              itemToUpdate.startConversation = userData?.cognitoUserId;

              // Log the updated item for debugging
              console.log('Updated item:', itemToUpdate);
            }

            // Return the updated data
            return newData;
          });
          navigation.navigate('Inbox');
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={Images.gradientBackground} style={styles.imgBg}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content" // or 'light-content' based on your design
        />

        <GText medium style={styles.headerTitle} text="It's a Match! 💃" />

        <ImageBackground style={styles.whiteLines} source={Images.whiteLines}>
          <View style={styles.imageContainer}>
            <View style={[styles.backgroundView, {right: -25}]}>
              <GImage
                image={userData?.profilePic}
                style={styles.matchImageSecond}
              />
            </View>
            <View style={[styles.backgroundView, {left: -25}]}>
              <GImage
                image={itemData?.profilePic}
                style={styles.matchImageFirst}
              />
            </View>
          </View>
        </ImageBackground>
        <GText
          medium
          style={styles.titleText}
          text={`You and ${
            itemData?.fullName?.split(' ')[0]
          }\nare now connected!`}
        />
        <GText
          beVietnamRegular
          style={styles.subtitle}
          text={'Let’s grow, learn, and succeed \n— one swipe at a time!'}
        />

        <GButton
          textStyle={styles.buttonText}
          title="👋  Start a Conversation"
          style={styles.buttonStyle}
          onPress={() => {
            start_conversation_hit();
          }}
        />
      </ImageBackground>
    </View>
  );
};

export default MatchScreen;
