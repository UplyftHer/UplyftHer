import {
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from './styles';
import GButton from '../../../components/GButton';
import GText from '../../../components/GText';
import {Images} from '../../../utils';
import GImage from '../../../components/GImage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet from './BottomSheet';
import {
  saved_profile,
  setSavedProfile,
} from '../../../redux/slices/profileSlice';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import useMatchingProfiles from '../../../hooks/useMatchingProfiles';
import {showToast} from '../../../components/Toast';

const UserContent = ({
  item,
  // panResponder,
  pan,
  screen,
  animateCard,
  send_connect_request_hit,
  opacityAnim,
  scaleAnim,
  slideAnim,
  setReduceImgSize,
  navigation,
  refRBSheet,
  dispatch,
  savedProfileData,
  setUserList,
  userList,
  setData,
  data,
}) => {
  const insets = useSafeAreaInsets();
  const {matchingProfileData, setMatchingProfileData} = useMatchingProfiles();

  const [savedUser, setSavedUser] = useState(item?.isSaved);

  useEffect(() => {
    setSavedUser(item?.isSaved);
  }, [item?.isSaved]);

  const saved_profile_hit = userData => {
    setSavedUser(!userData?.isSaved);

    const input = {
      cognitoUserIdSave: userData?.cognitoUserId,
      status: userData?.isSaved ? '0' : '1',
    };
    const filteredData = savedProfileData.filter(
      item =>
        item?.cognitoUserIdSave?.cognitoUserId !== userData?.cognitoUserId,
    );
    dispatch(saved_profile(input)).then(res => {
      if (saved_profile.fulfilled.match(res)) {
        if (!userData?.isSaved) {
          showToast(1, 'Profile saved for later review!');
        }
        const newSaveProfileData = {
          cognitoUserIdSave: userData,
        };
        setMatchingProfileData(
          matchingProfileData?.map(i =>
            i?._id === userData?._id ? {...i, isSaved: !userData?.isSaved} : i,
          ),
        );
        if (userData?.isSaved) {
          dispatch(setSavedProfile(filteredData));
        } else if (!userData?.isSaved) {
          dispatch(setSavedProfile([newSaveProfileData, ...savedProfileData]));
        }
        if (screen && screen != 'SavedProfile') {
          setData(
            data?.map(i =>
              i?._id === userData?._id
                ? {...i, isSaved: !userData?.isSaved}
                : i,
            ),
          );
          setUserList(
            userList?.map(i =>
              i?._id === userData?._id
                ? {...i, isSaved: !userData?.isSaved}
                : i,
            ),
          );
        }
        if (screen === 'SavedProfile') {
          if (userList) {
            setUserList(
              userList?.filter(
                item =>
                  item?.cognitoUserIdSave?.cognitoUserId !==
                  userData?.cognitoUserId,
              ),
            );
          }
          navigation?.goBack();
        }
      }
    });
  };
  return (
    <View style={styles.renderContainer}>
      <Animated.View
        style={[
          {
            width: Dimensions.get('window').width,
          },
          {
            transform: [{translateX: slideAnim}, {scale: scaleAnim}],
            opacity: opacityAnim,
          },
        ]}>
        <GImage
          backgroundMode={true}
          image={item?.profilePic}
          fullImageStyle={styles.userImg}
          content={() => (
            <>
              <LinearGradient
                colors={['#4B164C00', '#4B164C90', '#4B164C']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={styles.gradient}>
                <View style={{position: 'absolute'}}>
                  <GButton
                    activeOpacity={1}
                    textStyle={styles.buttonText}
                    title={`🎉 ${item?.matchPercentage || 0}% Match`}
                    style={styles.button}
                  />
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      if (screen != 'BlockList') {
                        navigation?.navigate('PublicReviewScreen', {
                          userData: item,
                          screen: screen,
                        });
                      }
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: scaledHeightValue(8),
                    }}>
                    <GText
                      componentProps={{
                        ellipsizeMode: 'middle',
                        numberOfLines: 1,
                      }}
                      medium
                      text={
                        item?.age
                          ? `${item?.fullName}, ${item?.age}`
                          : item?.fullName
                      }
                      style={styles.nameText}
                    />
                    {item?.emailDomainVerified === 1 && (
                      <Image
                        source={Images.verified}
                        style={{
                          width: scaledValue(24),
                          height: scaledHeightValue(24),
                          marginLeft: scaledValue(4),
                        }}
                      />
                    )}
                  </TouchableOpacity>

                  <GText
                    beVietnamSemiBold
                    text={item?.location || item?.city}
                    style={styles.placeText}
                  />
                  <View style={styles.careerCardView}>
                    <View style={styles.careerListView}>
                      {item?.interests?.slice(0, 5)?.map((item, index) => (
                        <TouchableOpacity
                          disabled={true}
                          key={index}
                          style={styles.careerCardTouchable}>
                          <Text style={styles.skillText}>{item.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* <Animated.View
                    style={[styles.box, pan.getLayout()]}
                    {...panResponder.panHandlers}> */}
                  {screen === 'BlockList' ? null : (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        navigation?.navigate('PublicReviewScreen', {
                          userData: item,
                          screen: screen,
                        });
                      }}
                      style={styles.swipeView}>
                      <Image
                        source={Images.fShimmer}
                        style={styles.swipeImage}
                      />
                      <GText
                        beVietnamSemiBold
                        text={`Know more about ${
                          item?.fullName?.split(' ')[0]
                        }`}
                        style={styles.swipingText}
                      />
                    </TouchableOpacity>
                  )}

                  {/* </Animated.View> */}

                  {screen === 'PreviousInteracted' ||
                  screen === 'InBox' ? null : (
                    <View style={styles.roundedRect(insets)}>
                      <View style={styles.rectView}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => animateCard('previous', false)}
                          style={styles.rejectView}>
                          <Image
                            source={Images.rejectImage}
                            style={styles.rejectImage}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => {
                            send_connect_request_hit(item?.cognitoUserId);
                          }}
                          style={styles.acceptedView}>
                          <Image
                            source={Images.checkCircle}
                            style={styles.acceptedImage}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => {
                            saved_profile_hit(item);
                          }}
                          style={styles.saveView}>
                          <Image
                            source={
                              savedUser ? Images.bookmarkFill : Images.bookmark
                            }
                            style={styles.saveImage}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </>
          )}
        />
      </Animated.View>
      {/* <BottomSheet
        refRBSheet={refRBSheet}
        navigation={navigation}
        setReduceImgSize={setReduceImgSize}
        insets={insets}
        aboutText={item?.bio}
        screen={screen}
      /> */}
    </View>
  );
};

export default UserContent;
