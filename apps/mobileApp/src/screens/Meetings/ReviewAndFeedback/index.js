import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {Images} from '../../../utils';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GText from '../../../components/GText';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {styles} from './styles';
import {colors} from '../../../../assets/colors';
import CustomRating from '../../../components/CustomRating';
import Input from '../../../components/Input';
import GradientButton from '../../../components/GradientButton';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';
import {send_user_feedback} from '../../../redux/slices/bookMeetingSlice';
import fonts from '../../../utils/fonts';
import GImage from '../../../components/GImage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const ReviewAndFeedback = ({navigation, route}) => {
  const {meetingData, pastMeetingData, setPastMeetingData} = route?.params;
  console.log('meetingData013', meetingData);

  const dispatch = useAppDispatch();
  const userData = useAppSelector(state => state.auth.user);
  const insets = useSafeAreaInsets();
  const wordLimit = 200;
  const [isFocused, setIsFocused] = useState(false);
  const [userRating, setUserRating] = useState();
  const [inputValue, setInputValue] = useState(
    meetingData?.feedback[0]?.feedback || '',
  );
  const getWordsCount = text => {
    if (text?.length <= wordLimit) {
      setInputValue(text);
    }
  };

  const give_rating = () => {
    const input = {
      cognitoUserId: meetingData?.userdetail?.cognitoUserId,
      meetingId: meetingData?._id,
      rating: userRating,
      feedback: inputValue,
    };

    dispatch(send_user_feedback(input)).then(res => {
      if (send_user_feedback.fulfilled.match(res)) {
        let newFeedback = {
          __v: 0,
          feedback: inputValue,
          fromId: userData?.cognitoUserId,
          meetingId: meetingData?._id,
          rating: userRating,
          toId: meetingData?.userdetail?.cognitoUserId,
        };
        setPastMeetingData(prevData =>
          prevData.map(item =>
            item._id === meetingData?._id
              ? {...item, feedback: [newFeedback]}
              : item,
          ),
        );
        navigation?.goBack();
      }
    });
  };

  useEffect(() => {
    if (meetingData?.feedback[0]?.feedback) {
      setIsFocused(true);
    }
  }, [meetingData?.feedback[0]?.feedback]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <KeyboardAwareScrollView
        bounces={false}
        style={styles.keyboardAvoidingStyle}
        extraHeight={Platform.OS == 'ios' ? scaledValue(100) : ''}>
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={Images.gradientRect}
            resizeMode="cover"
            style={styles.imgBg}>
            <Image source={Images.whiteLines} style={styles.whiteLines} />
            <View style={styles.headerTitleView(insets)}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={Images.leftArrow}
                  style={styles.leftArrowStyle}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>Feedback</Text>
            </View>

            <View style={{top: scaledValue(-56)}}>
              <GText
                medium
                text={
                  meetingData?.feedback[0]?.rating
                    ? meetingData?.meetingTitle
                    : 'You’ve Uplyfted Yourself! 🚀'
                }
                style={styles.titleStyle}
              />
              <GText
                beVietnamRegular
                text={
                  meetingData?.feedback[0]?.rating
                    ? `This is the feedback you provided for ${
                        meetingData?.userdetail?.fullName?.split(' ')[0]
                      }`
                    : 'Tell your mentor/mentee how they helped you grow!'
                }
                style={styles.subtitleStyle}
              />
            </View>
          </ImageBackground>

          <View style={styles.ratingView}>
            <GImage
              style={styles.profileImage}
              image={meetingData?.userdetail?.profilePic}
            />
            <GText
              style={styles.nameText}
              medium
              text={meetingData?.userdetail?.fullName}
            />
            <GText
              style={styles.placeText}
              beVietnamRegular
              text={
                meetingData?.userdetail?.location ||
                meetingData?.userdetail?.city
              }
            />
            <GText
              style={styles.ratingText}
              medium
              text={
                meetingData?.feedback[0]?.rating
                  ? `You Rated ${
                      meetingData?.userdetail?.fullName?.split(' ')[0]
                    }`
                  : `Rate ${meetingData?.userdetail?.fullName?.split(' ')[0]}`
              }
            />
            <CustomRating
              // disabled={
              //   meetingData?.feedback[0]?.rating || userData?.userType === 1
              //     ? true
              //     : false
              // }
              disabled={meetingData?.feedback[0]?.rating ? true : false}
              maxRating={5}
              value={meetingData?.feedback[0]?.rating}
              filledStar={Images.star}
              unfilledStar={Images.unfilledStar}
              onRatingChange={rating => setUserRating(rating)}
              starContainerStyle={{
                marginHorizontal: 8,
                marginBottom: scaledValue(12),
              }}
              imageStyle={styles.starImage}
            />
          </View>
          <View style={styles.textInputView}>
            <Input
              value={inputValue}
              showLabel={isFocused}
              placeholder="Tell your mentor what you found helpful or suggest areas for future focus (optional)"
              multiline
              style={styles.textInput}
              contentStyle={{
                fontSize: scaledValue(14),
                fontFamily: inputValue
                  ? fonts?.BE_VIETNAM_MEDIUM
                  : fonts?.BE_VIETNAM_REGULAR,
                lineHeight: scaledHeightValue(18.2),
                textAlignVertical: 'top',
              }}
              label={
                isFocused && (
                  <GText
                    text={`Your Feedback for ${
                      meetingData?.userdetail?.fullName?.split(' ')[0]
                    }`}
                    style={{
                      color: colors.themeColor,
                      fontFamily: fonts?.BE_VIETNAM_BOLD,
                      fontSize: scaledValue(14),
                      letterSpacing: scaledValue(14 * -0.02),
                    }}
                  />
                )
              }
              editable={meetingData?.feedback[0]?.rating ? false : true}
              labelStyle={{flexWrap: 'wrap'}}
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
              activeOutlineColor={colors.slightlyPink}
              outlineColor={colors.slightlyPink}
              onChangeText={getWordsCount}
            />
            <View style={styles.wordCountText}>
              <GText text={`${inputValue?.length}/${wordLimit}`} />
            </View>
          </View>
          {!meetingData?.feedback[0]?.rating && (
            <GradientButton
              disabled={!userRating}
              onPress={give_rating}
              title={'💁‍♀️  Submit Feedback'}
              textstyle={styles.buttonText}
              gradientstyle={styles.buttonStyle}
            />
          )}
          {meetingData?.feedback[0]?.rating && userData?.userType === 0 && (
            <GradientButton
              onPress={() => {
                navigation?.navigate('StackScreens', {
                  screen: 'BookMeeting',
                  params: {
                    otherUserData: meetingData?.userdetail,
                    mentorData: meetingData?.userdetail,
                    meetingData: {},
                  },
                });
              }}
              title={`📮 Book meeting with ${
                meetingData?.userdetail?.fullName?.split(' ')[0]
              }`}
              textstyle={styles.buttonText}
              gradientstyle={styles.buttonStyle}
            />
          )}
        </ScrollView>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ReviewAndFeedback;
