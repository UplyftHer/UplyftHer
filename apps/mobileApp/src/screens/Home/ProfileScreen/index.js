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
  ScrollView,
  PanResponder,
  Text,
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
    // swipeEnabled: true,
    // longpressDelay: 700,
  };
  const {width, height} = Dimensions.get('window');

  const [tutorialVisible, setTutorialVisible] = useState(showTutorial);
  const [currentModalIndex, setCurrentMOdalIndex] = useState(0);
  const swiperRef = useRef(null);

  const scrollRef = useRef(null);
  const [currentIndexs, setIndex] = useState(0);

  const [indexes, setIndexes] = useState(0);

  const screens = [
    <FirstTutorial />,
    <SecondTutorial />,
    <ThirdTutorial goToNext={() => setIndexes(3)} />,
    <ForthTutorial goToNext={() => setIndexes(4)} />,
    <FifthTutorial goToNext={() => setIndexes(5)} />,
    <CompleteTutorial />,
  ];

  const onSwipeLeft = () => {
    if (indexes < screens.length - 1) setIndexes(indexes + 1);
    // if (currentIndexs < 5) {
    //   const next = currentIndexs + 1;
    //   scrollRef.current?.scrollTo({x: width * next, animated: true});
    //   setIndex(next);
    // }
    // if (!screen) {
    //   if (!tutorialVisible) {
    //     animateCard('next', true);
    //   } else if (currentModalIndex < tutorialSteps.length - 1) {
    //     const nextIndex = currentModalIndex + 1;
    //     swiperRef.current.scrollToIndex({index: nextIndex, animated: true});
    //     setCurrentMOdalIndex(nextIndex);
    //   }
    // }
  };

  const onSwipeRight = () => {
    if (indexes > 0) setIndexes(indexes + 1);
    // alert(currentIndexs);
    // if (currentIndexs > 0) {
    //   const prev = currentIndexs + 1;
    //   scrollRef.current?.scrollTo({x: width * prev, animated: true});
    //   setIndex(prev);
    // }
    // if (!screen) {
    //   if (!tutorialVisible) {
    //     if (currentModalIndex !== 0) {
    //       animateCard('previous', false);
    //     }
    //   } else if (currentModalIndex > 0) {
    //     const prevIndex = currentModalIndex + 1;
    //     swiperRef.current.scrollToIndex({index: prevIndex, animated: true});
    //     setCurrentMOdalIndex(prevIndex);
    //   }
    // }
  };
  const TOTAL_SCREENS = 6;

  const scrollX = useRef(new Animated.Value(0)).current;
  const [getCurrentIndex, setGetCurrentIndex] = useState(0);
  console.log('getCurrentIndexgetCurrentIndex', getCurrentIndex);

  const currentIndexes = useRef(0);
  const goToNextManually = () => {
    if (currentIndexes.current < TOTAL_SCREENS - 1) {
      currentIndexes.current += 1;
      setGetCurrentIndex(currentIndexes.current);
      Animated.spring(scrollX, {
        toValue: currentIndexes.current * width,
        useNativeDriver: false,
      }).start();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Allow swipe gesture only on screen 0, 1, 2
        return Math.abs(gestureState.dx) > 10 && currentIndexes.current <= 2;
      },

      onPanResponderMove: () => {
        // No-op: avoid jitter
      },

      onPanResponderRelease: (_, gestureState) => {
        const moveThreshold = 0.25 * width;
        const dx = gestureState.dx;

        if (currentIndexes.current > 1) return;

        // ✅ Screen 0: block right swipe (dx > 0)
        if (currentIndexes.current === 0 && dx > 0) return;

        // ✅ Screen 1: block left swipe (dx < 0)
        if (currentIndexes.current === 1 && dx < 0) return;

        // ✅ Allow forward navigation on valid gesture
        if (
          Math.abs(dx) > moveThreshold &&
          currentIndexes.current < TOTAL_SCREENS - 1
        ) {
          currentIndexes.current += 1;
          setGetCurrentIndex(currentIndexes.current);
        }

        Animated.spring(scrollX, {
          toValue: currentIndexes.current * width,
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  return (
    <LinearGradient
      colors={['#DA7575', '#A45EB0']}
      start={{x: 0.5, y: 1}}
      end={{x: 0.5, y: 0}}
      style={{flex: 1}}>
      {/* <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      /> */}
      {!tutorialVisible && (
        <TouchableOpacity
          disabled={tutorialVisible}
          onPress={() => navigation.goBack()}
          style={[
            styles.leftArrowView(insets),
            {opacity: tutorialVisible ? 0.5 : 1},
          ]}>
          <Image
            source={Images.leftArrow}
            style={styles.leftArrowStyle(insets)}
          />
        </TouchableOpacity>
      )}

      <View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <GestureRecognizer
          onSwipeLeft={state => {
            if (!screen) {
              if (!tutorialVisible) {
                animateCard('next', true);
              }
            }
          }}
          onSwipeRight={state => {
            if (!screen) {
              if (!tutorialVisible) {
                if (currentIndex != 0) {
                  animateCard('previous', false);
                }
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
                        <UserContent
                          item={item}
                          pan={pan}
                          screen={screen}
                          animateCard={animateCard}
                          send_connect_request_hit={send_connect_request_hit}
                          send_unconnect_request_hit={
                            send_unconnect_request_hit
                          }
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
      </View>

      {tutorialVisible && !screen && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width,
            height,
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}>
          <BlurView
            style={{
              width,
              height,
            }}
            blurType="light"
            blurAmount={2.5}
            reducedTransparencyFallbackColor="white">
            <View style={styles.tutorialContainer}>
              {getCurrentIndex !== TOTAL_SCREENS - 1 && (
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
              <Animated.View
                style={[
                  {
                    flexDirection: 'row',
                    width: '100%',
                    height: '100%',
                  },
                  {
                    transform: [
                      {
                        translateX: scrollX.interpolate({
                          inputRange: [0, width * TOTAL_SCREENS],
                          outputRange: [0, -width * TOTAL_SCREENS],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                  // {transform: [{translateX: Animated.multiply(scrollX, -1)}]},
                ]}
                {...panResponder.panHandlers}>
                <FirstTutorial />
                <SecondTutorial />
                <View style={{width: '100%', position: 'relative', top: 0}}>
                  <ThirdTutorial goToNextManually={goToNextManually} />
                </View>
                <View style={{width: '100%', position: 'relative', top: 0}}>
                  <ForthTutorial goToNextManually={goToNextManually} />
                </View>
                <View style={{width: '100%', position: 'relative', top: 0}}>
                  <FifthTutorial goToNextManually={goToNextManually} />
                </View>

                <CompleteTutorial setTutorialVisible={setTutorialVisible} />
              </Animated.View>
              {/* <GestureRecognizer
                onSwipeLeft={onSwipeLeft}
                onSwipeRight={onSwipeRight}
                config={config}
                style={{
                  flex: 1,
                }}> */}
              {/* {screens[indexes]} */}
              {/* <View
                  style={{
                    marginTop:
                      matchingProfileData?.length < 1 &&
                      !screen &&
                      Dimensions.get('window').height / 2,
                  }}> */}
              {/* <ScrollView
                  ref={scrollRef}
                  horizontal
                  pagingEnabled
                  scrollEnabled={false}
                  showsHorizontalScrollIndicator={false}>
                  <FirstTutorial />
                  <SecondTutorial />
                  <ThirdTutorial scrollRef={scrollRef} setIndex={setIndex} />
                  <ForthTutorial swiperRef={swiperRef} />
                  <FifthTutorial swiperRef={swiperRef} />
                  <CompleteTutorial setTutorialVisible={setTutorialVisible} />
                </ScrollView> */}
              {/* <FlatList
                    ref={swiperRef}
                    data={tutorialSteps}
                    horizontal
                    pagingEnabled
                    scrollEnabled={false} // Disable manual scroll to force gesture use
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({item}) => (
                      <View style={{width, height}}>{item}</View>
                    )}
                  /> */}
              {/* </View> */}
              {/* </GestureRecognizer> */}

              {/* <Swiper
                height={Dimensions.get('window').height}
                ref={swiperRef}
                loop={false}
                scrollEnabled={(() => {
                  // Return true or false based on your logic
                  return currentModalIndex === 2 ? false : true; // Replace with your condition
                })()}
                showsPagination={true}
                dotStyle={styles.dot}
                activeDotStyle={styles.activeDot}
                onIndexChanged={index => {
                  // if (index === 0) {
                  //   swiperRef.current.scrollBy(1);
                  // } else {
                  setCurrentMOdalIndex(index);
                  // }
                }}>
                <FirstTutorial />
                <SecondTutorial />
                <ThirdTutorial swiperRef={swiperRef} />
                <ForthTutorial swiperRef={swiperRef} />
                <FifthTutorial swiperRef={swiperRef} />
                <CompleteTutorial setTutorialVisible={setTutorialVisible} />
              </Swiper> */}
            </View>
          </BlurView>
          <View
            style={{
              position: 'absolute',
              bottom: insets.bottom === 0 ? scaledValue(20) : insets.bottom,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {Array.from({length: TOTAL_SCREENS}).map((_, i) => {
              const widthAnim = scrollX.interpolate({
                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                outputRange: [10, 22.6, 10],
                extrapolate: 'clamp',
              });

              const borderRadiusAnim = scrollX.interpolate({
                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                outputRange: [10, 8, 10],
                extrapolate: 'clamp',
              });

              const opacityAnim = scrollX.interpolate({
                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                outputRange: [0.5, 1, 0.5],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={`dot-${i}`}
                  style={[
                    {
                      height: 10,
                      backgroundColor: '#fff',
                      marginHorizontal: scaledValue(3.5),
                    },
                    {
                      width: widthAnim,
                      borderRadius: borderRadiusAnim,
                      opacity: opacityAnim,
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

export default ProfileScreen;
