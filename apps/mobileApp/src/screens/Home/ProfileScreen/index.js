import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import {styles} from './styles';
import {Images} from '../../../utils';
import LinearGradient from 'react-native-linear-gradient';
import GButton from '../../../components/GButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Text} from 'react-native';
import GText from '../../../components/GText';
import BottomSheet from './BottomSheet';
import {
  saved_profile,
  send_connect_request,
  setSavedProfile,
} from '../../../redux/slices/profileSlice';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';
import GImage from '../../../components/GImage';
import useMatchingProfiles from '../../../hooks/useMatchingProfiles';
import UserContent from './UserContent';
import {scaledValue} from '../../../utils/design.utils';

const ProfileScreen = ({navigation, route}) => {
  const refRBSheet = useRef();
  const {searchUserData, screen, itemIndex, setUserListData, userListData} =
    route?.params;
  const [userList, setUserList] = useState([searchUserData]);
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
          animateCard('next', false);
          setMatchingProfileData(filteredData);
        } else {
          // animateCard('next');
          setMatchingProfileData(filteredData);
        }
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
        duration: 300, // Increased speed
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
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
          duration: 300, // Match initial duration
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
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

  const panResponder = useRef(
    PanResponder.create({
      // Decide whether this gesture should be handled
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      // Handle gesture release
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -20) {
          // Detect a slight swipe up
          refRBSheet.current.open();
        }
      },
    }),
  ).current;

  // console.log('matchingProfileData?.length0', matchingProfileData?.length);

  return (
    <LinearGradient
      colors={['#DA7575', '#A45EB0']}
      start={{x: 0.5, y: 1}}
      end={{x: 0.5, y: 0}}
      style={{flex: 1}}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.leftArrowView(insets)}>
        <Image
          source={Images.leftArrow}
          style={styles.leftArrowStyle(insets)}
        />
      </TouchableOpacity>
      {screen == 'InBox' || screen === 'PreviousInteracted' ? null : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            // marginTop: Dimensions.get('window').height / 2.6,
            position: 'absolute',
            top: Dimensions.get('window').height / 2.6,
            zIndex: 10,
            elevation: 100,
          }}>
          <TouchableOpacity
            disabled={currentIndex === 0 ? true : false}
            onPress={() => animateCard('previous', false)}
            style={{
              borderRadius: 10, // Ensures the shadow follows the shape
              overflow: 'hidden', // Prevents shadow from getting clipped
              shadowColor: '#000',
              shadowOffset: {width: 10, height: 5},
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 20, // Android shadow
              opacity: currentIndex !== 0 ? 1 : 0.5,
            }}>
            <Image
              source={Images.Back}
              tintColor={'#fff'}
              style={{
                width: scaledValue(60),
                height: scaledValue(60),
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              animateCard('next', true);
            }}
            style={{
              borderRadius: 10, // Ensures the shadow follows the shape
              overflow: 'hidden', // Prevents shadow from getting clipped
              shadowColor: '#000',
              shadowOffset: {width: 10, height: 4},
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 20, // Android shadow
            }}>
            <Image
              source={Images.Forward}
              tintColor={'#fff'}
              style={{
                width: scaledValue(60),
                height: scaledValue(60),
              }}
            />
          </TouchableOpacity>
        </View>
      )}
      {/* {matchingProfileData?.length >= 0 && ( */}

      <View
        {...panResponder.panHandlers}
        style={{
          marginTop:
            matchingProfileData?.length < 1 &&
            !screen &&
            Dimensions.get('window').height / 2,
          // height: matchingProfileData?.length > 0 && !screen && '100%',
        }}>
        <FlatList
          data={screen ? userList : [matchingProfileData[currentIndex]]}
          // contentContainerStyle={{height: '100%'}}
          // contentContainerStyle={{
          //   marginTop:
          //     matchingProfileData?.length < 1 &&
          //     !screen &&
          //     Dimensions.get('window').height / 2,
          //   height: matchingProfileData?.length > 0 && !screen && '100%',
          // }}
          ref={flatListRef}
          // horizontal={true}
          horizontal={matchingProfileData?.length > 0 || screen ? true : false}
          pagingEnabled
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
          // onEndReached={matchingProfileLoadMore}
          // onEndReached={() => alert('heuy')}
          ListFooterComponent={matchingProfileLoader}
          // renderItem={({item}) => {}}}
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
                  <UserContent
                    item={item}
                    // panResponder={panResponder}
                    pan={pan}
                    screen={screen}
                    animateCard={animateCard}
                    send_connect_request_hit={send_connect_request_hit}
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
                )}
              </>
            );
          }}
        />
      </View>
      {/* )} */}
    </LinearGradient>
  );
};

export default ProfileScreen;
