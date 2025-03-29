import {Image, ImageBackground, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {Images} from '../../../utils';
import GText from '../../../components/GText';
import GButton from '../../../components/GButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';
import {enable_first_session} from '../../../redux/slices/communicationSlice';
import GImage from '../../../components/GImage';

const BookSession = ({navigation, route}) => {
  const {setData, otherUserData, setEnableBookingSession, mentorData} =
    route?.params;
  const userData = useAppSelector(state => state.auth.user);
  console.log('userData01234', userData);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const enable_session_hit = () => {
    const input = {
      cognitoUserId: otherUserData?.cognitoUserId,
    };
    dispatch(enable_first_session(input)).then(res => {
      if (enable_first_session.fulfilled.match(res)) {
        setData(prevData =>
          prevData.map(item => {
            if (
              item.connectUserDetail.cognitoUserId ===
              otherUserData?.cognitoUserId
            ) {
              return {
                ...item,
                ...item.connectUserDetail,
                isBookFirstSession: 1,
              };
            }
            return item;
          }),
        );
        setEnableBookingSession(1);
        navigation?.goBack();
        navigation.navigate('BookMeeting', {
          otherUserData: otherUserData,
          mentorData: mentorData,
          meetingData: {},
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={Images.gradientBackground} style={styles.imgBg}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={Images.leftArrow}
            style={styles.leftArrowStyle(insets)}
          />
        </TouchableOpacity>
        <View>
          <GText
            medium
            style={styles.headerTitle}
            text="Book Your Session! 🎉"
          />
        </View>

        <ImageBackground style={styles.whiteLines} source={Images.whiteLines}>
          <View style={styles.imageContainer}>
            <View style={[styles.backgroundView, {right: -25}]}>
              <GImage
                style={styles.matchImageSecond}
                image={otherUserData?.profilePic}
              />
            </View>
            <View style={[styles.backgroundView, {left: -25}]}>
              <GImage
                image={userData?.profilePic}
                style={styles.matchImageFirst}
              />
            </View>
          </View>
        </ImageBackground>
        <GText
          medium
          style={styles.titleText}
          text={`You and ${
            otherUserData?.fullName?.split(' ')[0]
          }\nare officially matched!`}
        />
        <GText
          beVietnamRegular
          style={styles.subtitle}
          text={
            "Select a time that works for you from your\nmentor's available slots."
          }
        />

        <GButton
          textStyle={styles.buttonText}
          title="📮 Book Meeting"
          style={styles.buttonStyle}
          onPress={() => {
            enable_session_hit();
          }}
        />
      </ImageBackground>
    </View>
  );
};

export default BookSession;
