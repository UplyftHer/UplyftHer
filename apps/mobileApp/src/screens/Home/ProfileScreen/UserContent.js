import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from './styles';
import GButton from '../../../components/GButton';
import GText from '../../../components/GText';
import {Images} from '../../../utils';
import GImage from '../../../components/GImage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  saved_profile,
  setSavedProfile,
} from '../../../redux/slices/profileSlice';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import useMatchingProfiles from '../../../hooks/useMatchingProfiles';
import {showToast} from '../../../components/Toast';

import {useAppSelector} from '../../../redux/store/storeUtils';

const UserContent = ({
  item,
  // panResponder,
  pan,
  screen,
  animateCard,
  send_connect_request_hit,
  send_unconnect_request_hit,
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
  const showTutorial = useAppSelector(state => state.auth.showTutorial);

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
                <View
                  style={{
                    position: 'absolute',
                    height: '100%',
                  }}>
                  <GButton
                    activeOpacity={1}
                    textStyle={styles.buttonText}
                    title={`🎉 ${item?.matchPercentage || 0}% Match`}
                    style={styles.button}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      // marginBottom: scaledHeightValue(8),
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
                          height: scaledValue(24),
                          marginLeft: scaledValue(4),
                        }}
                      />
                    )}
                  </View>

                  <GText
                    beVietnamSemiBold
                    text={item?.location || item?.city}
                    style={styles.placeText}
                  />
                  <View style={styles.careerCardView}>
                    {/* <View style={styles.careerListView}> */}
                    {item?.interests?.slice(0, 5)?.map((item, index) => (
                      <TouchableOpacity
                        disabled={true}
                        key={index}
                        style={styles.careerCardTouchable}>
                        <GImage
                          image={item?.icon}
                          style={{
                            width: scaledValue(12),
                            height: scaledValue(12),
                          }}
                        />
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={styles.skillText}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {/* </View> */}
                  </View>

                  {/* {screen === 'BlockList' ? null : (
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
                  )} */}

                  {showTutorial && (
                    <View
                      style={{
                        position: 'absolute',
                        alignSelf: 'center',
                        bottom: 0,
                        marginBottom:
                          Platform.OS == 'android'
                            ? insets.top
                            : insets.bottom === 0
                            ? insets.bottom + scaledValue(42)
                            : insets.bottom + scaledValue(15),
                      }}>
                      {screen === 'PreviousInteracted' ||
                      screen === 'InBox' ? null : (
                        <View style={styles.roundedRect(insets)}>
                          <View style={styles.rectView}>
                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={() => {}}
                              style={styles.rejectView}>
                              <Image
                                source={Images.rejectImage}
                                style={styles.rejectImage}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={() => {}}
                              style={styles.acceptedView}>
                              <Image
                                source={Images.checkCircle}
                                style={styles.acceptedImage}
                              />
                            </TouchableOpacity>

                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={() => {}}
                              style={styles.saveView}>
                              <Image
                                source={Images.bookmark}
                                style={styles.saveImage}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </LinearGradient>
            </>
          )}
        />
      </Animated.View>
    </View>
  );
};
export default UserContent;
