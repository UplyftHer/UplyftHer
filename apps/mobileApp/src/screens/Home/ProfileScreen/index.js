import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  Animated,
  StatusBar,
  Modal,
} from 'react-native';
import {styles} from './styles';
import {Images} from '../../../utils';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GText from '../../../components/GText';
import {
  send_connect_request,
  send_unconnect_request,
  setSavedProfile,
} from '../../../redux/slices/profileSlice';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';
import useMatchingProfiles from '../../../hooks/useMatchingProfiles';
import UserContent from './UserContent';
import {scaledValue} from '../../../utils/design.utils';
import GestureRecognizer from 'react-native-swipe-gestures-plus';
import Swiper from 'react-native-swiper';
import {BlurView} from '@react-native-community/blur';
import ThirdTutorial from '../TutorialScreens/thirdTutorial';
import GTextButton from '../../../components/GTextButton';
import fonts from '../../../utils/fonts';
import {colors} from '../../../../assets/colors';
import SecondTutorial from '../TutorialScreens/secondTutorial';
import FirstTutorial from '../TutorialScreens/firstTutorial';
import ForthTutorial from '../TutorialScreens/fourthTutorial';
import FifthTutorial from '../TutorialScreens/fifthTutorial';
import CompleteTutorial from '../TutorialScreens/completeTutorial';
import {setShowTutorial} from '../../../redux/slices/authSlice';

const ProfileScreen = ({navigation, route}) => {
  const refRBSheet = useRef();
  const {searchUserData, screen, itemIndex, setUserListData, userListData} =
    route?.params;
  const [userList, setUserList] = useState([searchUserData]);

  const showTutorial = useAppSelector(state => state.auth.showTutorial);

  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(itemIndex || 0);
  const {
    matchingProfileData,
    setMatchingProfileData,
    matchingProfileLoadMore,
    matchingProfileLoader,
    matchingProfileRefreshData,
  } = useMatchingProfiles();

  const dispatch = useAppDispatch();
  const savedProfileData = useAppSelector(state => state.profile.savedProfile);

  const send_connect_request_hit = id => {
    const input = {
      cognitoUserId: id,
    };
    const filteredData = matchingProfileData.filter(
      item => item?.cognitoUserId !== id,
    );
    dispatch(send_connect_request(input)).then(res => {
      if (send_connect_request.fulfilled.match(res)) {
        if (!screen) {
          setMatchingProfileData(filteredData);
          animateCard('next', false);
        } else {
          setMatchingProfileData(filteredData);
        }
      }
    });
  };

  const send_unconnect_request_hit = id => {
    const input = {
      cognitoUserId: id,
    };
    const filteredData = matchingProfileData.filter(
      item => item?.cognitoUserId !== id,
    );
    dispatch(send_unconnect_request(input)).then(res => {
      if (send_unconnect_request.fulfilled.match(res)) {
        if (!screen) {
          setMatchingProfileData(filteredData);
          animateCard('next', false);
        } else {
          // animateCard('next');
          setMatchingProfileData(filteredData);
        }
      }

      if (screen === 'SavedProfile' || screen === 'SearchUser') {
        dispatch(
          setSavedProfile(
            savedProfileData?.filter(
              item => item?.cognitoUserIdSave?.cognitoUserId !== id,
            ),
          ),
        );
        setUserListData(
          userListData?.filter(item => item?.cognitoUserId !== id),
        ),
          navigation?.goBack();
      }
    });
  };

  const [isAnimating, setIsAnimating] = useState(false);
  const [reduceImgSize, setReduceImgSize] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateCard = (direction, moveNext) => {
    if (isAnimating) return;
    setIsAnimating(true);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue:
          direction === 'next'
            ? -Dimensions.get('window').width
            : Dimensions.get('window').width,
        duration: 200, // Increased speed
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      let newIndex = currentIndex;
      // if (direction === 'next') {
      //   // console.log(currentIndex, matchingProfileData?.length);
      //   if (currentIndex + 1 === matchingProfileData?.length) {
      //     newIndex = 0;
      //   } else {
      //     newIndex = currentIndex % matchingProfileData.length;
      //   }
      // } else {
      //   newIndex = (currentIndex + 1) % matchingProfileData.length;
      //   // console.log(
      //   //   '1123456789ju5',
      //   //   currentIndex,
      //   //   matchingProfileData?.length - 1,
      //   // );

      //   // if (currentIndex === matchingProfileData?.length - 4) {
      //   //   console.log('here=>>>');
      //   //   matchingProfileLoadMore();
      //   // }
      //   // newIndex =
      //   //   currentIndex - 1 < 0
      //   //     ? matchingProfileData.length - 1
      //   //     : currentIndex - 1;
      // }

      if (direction === 'next') {
        // newIndex = (currentIndex + 1) % matchingProfileData.length;
        if (currentIndex + 1 === matchingProfileData?.length) {
          newIndex = 0;
          console.log('nextDirection1');

          // newIndex = (currentIndex + 1) % matchingProfileData.length;
        } else {
          console.log('nextDirection2');
          if (moveNext === true) {
            console.log('nextDirection2underMoves');

            newIndex = (currentIndex + 1) % matchingProfileData.length;
          }
          // newIndex = (currentIndex + 1) % matchingProfileData.length;
          // newIndex = currentIndex % matchingProfileData.length;
        }
      } else {
        console.log('nextDirection3');

        newIndex =
          currentIndex - 1 < 0
            ? matchingProfileData.length - 1
            : currentIndex - 1;
      }
      setCurrentIndex(newIndex);

      slideAnim.setValue(
        direction === 'next'
          ? Dimensions.get('window').width
          : -Dimensions.get('window').width,
      );
      opacityAnim.setValue(0);
      scaleAnim.setValue(0.8);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200, // Match initial duration
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimating(false);
      });
    });
  };

  const marginBottomAnim = useRef(new Animated.Value(0)).current;
  const bottomAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(marginBottomAnim, {
      toValue: reduceImgSize ? -100 : 0, // Scaled value applied directly
      duration: 300, // Duration in milliseconds
      useNativeDriver: false, // Since it's a style property other than transform
    }).start();

    Animated.timing(bottomAnim, {
      toValue: reduceImgSize ? 60 : 0, // Scaled value applied directly
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [reduceImgSize]);

  const pan = useRef(new Animated.ValueXY()).current;

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
    swipeEnabled: true,
    longpressDelay: 700,
  };
  const {width, height} = Dimensions.get('window');

  const [tutorialVisible, setTutorialVisible] = useState(showTutorial);
  const [currentModalIndex, setCurrentMOdalIndex] = useState(0);
  const swiperRef = useRef(null);

  return (
    <LinearGradient
      colors={['#DA7575', '#A45EB0']}
      start={{x: 0.5, y: 1}}
      end={{x: 0.5, y: 0}}
      style={{flex: 1}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.leftArrowView(insets)}>
        <Image
          source={Images.leftArrow}
          style={styles.leftArrowStyle(insets)}
        />
      </TouchableOpacity>

      <GestureRecognizer
        onSwipeLeft={state => {
          if (!screen) {
            if (!tutorialVisible) {
              animateCard('next', true);
            } else if (currentModalIndex === 0) {
              // alert('hey');
              swiperRef.current.scrollBy(1);
            }
          }
        }}
        onSwipeRight={state => {
          if (!screen) {
            // if (currentIndex != 0) {
            if (!tutorialVisible) {
              if (currentIndex != 0) {
                animateCard('previous', false);
              }
            } else if (currentModalIndex === 1) {
              // if (currentIndex != 0) {
              swiperRef.current.scrollBy(1);
              // }
            }
            // }
          }
        }}
        config={config}
        style={{
          flex: 1,
        }}>
        <View
          style={{
            marginTop:
              matchingProfileData?.length < 1 &&
              !screen &&
              Dimensions.get('window').height / 2,
          }}>
          <FlatList
            data={screen ? userList : [matchingProfileData[currentIndex]]}
            ref={flatListRef}
            horizontal={
              matchingProfileData?.length > 0 || screen ? true : false
            }
            pagingEnabled
            keyExtractor={item => item?._id}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <GText
                    text={'No additional matching\nprofiles available.'}
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      fontSize: scaledValue(25),
                    }}
                  />
                </View>
              );
            }}
            ListFooterComponent={matchingProfileLoader}
            renderItem={({item}) => {
              return (
                <>
                  {matchingProfileData?.length < 1 && !screen ? (
                    <View
                      style={{
                        flex: 1,
                        alignSelf: 'center',
                        justifyContent: 'center',
                      }}>
                      <GText
                        text={'No additional matching\nprofiles available.'}
                        style={{
                          color: '#fff',
                          textAlign: 'center',
                          fontSize: scaledValue(25),
                        }}
                      />
                    </View>
                  ) : (
                    <>
                      {tutorialVisible && (
                        <Modal
                          visible={tutorialVisible}
                          transparent
                          animationType="fade"
                          style={{margin: 0, padding: 0}}>
                          <BlurView
                            style={{
                              width,
                              height,
                            }}
                            blurType="light"
                            blurAmount={2.5}
                            reducedTransparencyFallbackColor="white">
                            <View style={styles.tutorialContainer}>
                              {currentModalIndex != 5 && (
                                <View
                                  style={{
                                    // backgroundColor: 'red',
                                    top: insets.top + scaledValue(13),
                                    position: 'absolute',
                                    right: scaledValue(32),
                                    zIndex: 100,
                                  }}>
                                  <GTextButton
                                    onPress={() => {
                                      setTutorialVisible(false);
                                      dispatch(setShowTutorial(false));
                                    }}
                                    title={'Skip Tutorial'}
                                    titleStyle={{
                                      color: colors.offWhite,
                                      fontSize: scaledValue(16),
                                      fontFamily: fonts.SUSE_MEDIUM,
                                    }}
                                  />
                                </View>
                              )}
                              <Swiper
                                height={Dimensions.get('window').height}
                                ref={swiperRef}
                                loop={false}
                                scrollEnabled={false}
                                showsPagination={true}
                                dotStyle={styles.dot}
                                activeDotStyle={styles.activeDot}
                                onIndexChanged={index =>
                                  setCurrentMOdalIndex(index)
                                }>
                                <FirstTutorial />
                                <SecondTutorial />
                                <ThirdTutorial swiperRef={swiperRef} />
                                <ForthTutorial swiperRef={swiperRef} />
                                <FifthTutorial swiperRef={swiperRef} />
                                <CompleteTutorial
                                  setTutorialVisible={setTutorialVisible}
                                />
                              </Swiper>
                            </View>
                          </BlurView>
                        </Modal>
                      )}
                      <UserContent
                        item={item}
                        pan={pan}
                        screen={screen}
                        animateCard={animateCard}
                        send_connect_request_hit={send_connect_request_hit}
                        send_unconnect_request_hit={send_unconnect_request_hit}
                        opacityAni={opacityAnim}
                        scaleAnim={scaleAnim}
                        slideAnim={slideAnim}
                        refRBSheet={refRBSheet}
                        navigation={navigation}
                        setReduceImgSize={setReduceImgSize}
                        dispatch={dispatch}
                        savedProfileData={savedProfileData}
                        setMatchingProfileData={setMatchingProfileData}
                        matchingProfileData={matchingProfileData}
                        setData={setUserList}
                        data={userList}
                        setUserList={setUserListData}
                        userList={userListData}
                      />
                    </>
                  )}
                </>
              );
            }}
          />
        </View>
      </GestureRecognizer>
    </LinearGradient>
  );
};

export default ProfileScreen;
