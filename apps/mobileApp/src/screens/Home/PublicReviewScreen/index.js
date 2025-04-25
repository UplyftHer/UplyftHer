import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import HeaderButton from '../../../components/HeaderButton';
import {Images} from '../../../utils';
import GText from '../../../components/GText';
import {styles} from './styles';
import GImage from '../../../components/GImage';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {colors} from '../../../../assets/colors';
import GradientButton from '../../../components/GradientButton';
import OptionMenuSheet from '../../../components/OptionMenuSheet';
import useDataFactory from '../../../components/UseDataFactory/useDataFactory';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';
import {block_unblock_user} from '../../../redux/slices/profileSlice';
import useMatchingProfiles from '../../../hooks/useMatchingProfiles';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GradientBorderButton from '../../../components/GradientBorderButton';
import fonts from '../../../utils/fonts';

const PublicReviewScreen = ({navigation, route}) => {
  const {userData, screen} = route?.params;
  console.log('userData1234', userData);
  const insets = useSafeAreaInsets();

  const loggedUser = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const refRBSheet = useRef();
  const [visibleModal, setVisibleModal] = useState(false);
  const refRBReasonsSheet = useRef();
  const {matchingProfileData, setMatchingProfileData} = useMatchingProfiles();
  useEffect(() => {
    configureHeader();
  }, []);

  const configureHeader = () => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          icon={Images.leftArrow}
          onPress={() => navigation.goBack()}
          tintColor={'#966B9D'}
          iconStyle={styles.headerIconStyle}
          style={{paddingHorizontal: 0}}
        />
      ),
      headerTitle: () => (
        <GText
          text={`Meet Your ${userData?.userType === 0 ? 'Mentee' : 'Mentor'}`}
          medium
          style={styles.headerTitleStyle}
        />
      ),
    });
  };

  const blockList = [
    {
      id: 1,
      title: `Block ${userData?.fullName?.split(' ')[0]}`,
      textColor: '#FF3B30',
      action: () => {
        refRBSheet.current.close();
        setTimeout(() => {
          refRBReasonsSheet?.current?.open();
        }, 300);
      },
    },
  ];

  const blockReasons = [
    {
      id: 1,
      title: 'Harassment or bullying',
      textColor: colors.themeColor,
      action: () => blockUser('Harassment or bullying'),
    },
    {
      id: 2,
      title: 'Use of offensive or abusive language',
      textColor: colors.themeColor,
      action: () => blockUser('Use of offensive or abusive language'),
    },
    {
      id: 3,
      title: 'Disrupting or sabotaging sessions',
      textColor: colors.themeColor,
      action: () => blockUser('Disrupting or sabotaging sessions'),
    },
    {
      id: 4,
      title: 'Misinformation or misleading guidance',
      textColor: colors.themeColor,
      action: () => blockUser('Misinformation or misleading guidance'),
    },
    {
      id: 5,
      title: 'Constantly canceling or missing scheduled sessions',
      textColor: colors.themeColor,
      action: () =>
        blockUser('Constantly canceling or missing scheduled sessions'),
    },
    {
      id: 6,
      title: 'Asking for personal or financial details',
      textColor: colors.themeColor,
      action: () => blockUser('Asking for personal or financial details'),
    },
    {
      id: 7,
      title: 'Impersonation or fake profiles',
      textColor: colors.themeColor,
      action: () => blockUser('Impersonation or fake profiles'),
    },
    {
      id: 8,
      title: 'Sharing sensitive or private information',
      textColor: colors.themeColor,
      action: () => blockUser('Sharing sensitive or private information'),
    },
    {
      id: 9,
      title: 'Spamming or promotional content',
      textColor: colors.themeColor,
      action: () => blockUser('Spamming or promotional content'),
    },
    {
      id: 10,
      title: 'Attempting to scam or defraud others',
      textColor: colors.themeColor,
      action: () => blockUser('Attempting to scam or defraud others'),
    },
    {
      id: 11,
      title: 'Violating community guidelines',
      textColor: colors.themeColor,
      action: () => blockUser('Violating community guidelines'),
    },
    {
      id: 12,
      title: 'Repeatedly violating app terms and conditions',
      textColor: colors.themeColor,
      action: () => blockUser('Repeatedly violating app terms and conditions'),
    },
  ];

  const {
    loading: loading,
    data,
    extraData,
    setData,
    refreshData,
    loadMore,
    Placeholder,
    Loader,
  } = useDataFactory(
    'getUsersFeedBack',
    true,
    {cognitoUserId: userData?.cognitoUserId, limit: 10},
    'POST',
  );

  const blockUser = reason => {
    refRBReasonsSheet?.current?.close();
    const api_credentials = {
      cognitoUserId: userData?.cognitoUserId,
      status: '1',
      reason: reason,
    };

    dispatch(block_unblock_user(api_credentials)).then(res => {
      if (block_unblock_user.fulfilled.match(res)) {
        setMatchingProfileData(
          matchingProfileData.filter(
            item => item?.cognitoUserId !== userData?.cognitoUserId,
          ),
        );
        navigation?.goBack();
      }
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <GImage
        backgroundMode={true}
        image={userData?.profilePic}
        borderRadius={scaledValue(12)}
        fullImageStyle={styles.userProfileStyle}
        content={() => (
          <>
            {screen != 'InBox' && (
              <TouchableOpacity
                onPress={() => refRBSheet?.current?.open()}
                activeOpacity={0.9}
                style={styles.dotsView}>
                <Image source={Images.Three_dots} style={styles.dotsImgStyle} />
              </TouchableOpacity>
            )}
          </>
        )}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: scaledValue(4),
          marginTop: scaledValue(20),
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <GText
            medium
            text={`${userData?.fullName}`}
            style={{
              fontSize: scaledValue(33),
              color: colors.charcoal,
              letterSpacing: scaledValue(33 * -0.03),
            }}
          />
          <GText
            medium
            text={userData?.age ? `, ${userData?.age}` : ''}
            style={{
              fontSize: scaledValue(33),
              color: colors.charcoal,
              letterSpacing: scaledValue(33 * -0.03),
            }}
          />
        </View>
        {userData?.emailDomainVerified === 1 && (
          <Image
            source={Images.Verified_fill}
            style={{width: scaledValue(24), height: scaledValue(24)}}
          />
        )}
      </View>
      <GText
        beVietnamSemiBold
        text={userData?.occupation}
        style={{
          fontSize: scaledValue(14),
          color: colors.charcoal,
          opacity: 0.7,
          marginTop: scaledValue(4),
        }}
      />
      <GText
        beVietnamSemiBold
        text={userData?.location || userData?.city}
        style={{
          fontSize: scaledValue(14),
          color: colors.charcoal,
          opacity: 0.7,
          marginTop: scaledValue(4),
        }}
      />
      {userData?.userType === 1 && userData?.isMeetingEnable === 1 && (
        <GradientButton
          onPress={() => {
            navigation?.navigate('StackScreens', {
              screen: 'BookMeeting',
              params: {
                otherUserData: userData,
                mentorData: userData,
                meetingData: {},
              },
            });
          }}
          title={`📮 Book meeting with ${userData?.fullName?.split(' ')[0]}`}
          textstyle={styles.buttonText}
          gradientstyle={styles.buttonStyle}
        />
      )}

      <GText
        medium
        text={'About'}
        style={{
          fontSize: scaledValue(19),
          color: colors.charcoal,
          marginTop: scaledValue(35),
          letterSpacing: scaledValue(19 * -0.03),
        }}
      />
      <GText
        beVietnamRegular
        text={userData?.bio}
        style={{
          fontSize: scaledValue(16),
          color: '#22172A',
          marginTop: scaledValue(10),
          letterSpacing: scaledValue(16 * -0.02),
          lineHeight: scaledHeightValue(20.8),
        }}
      />
      <GText
        medium
        text={'Interests'}
        style={{
          fontSize: scaledValue(19),
          color: colors.charcoal,
          marginTop: scaledValue(35),
          letterSpacing: scaledValue(19 * -0.03),
        }}
      />
      <View style={styles.careerListView}>
        {userData?.interests?.slice(0, 5)?.map((item, index) => (
          <TouchableOpacity
            disabled={true}
            key={index}
            style={styles.careerCardTouchable}>
            <GText text={item?.name} style={styles.skillText} />
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <GText
          medium
          text={'Reviews'}
          style={{
            fontSize: scaledValue(19),
            color: colors.charcoal,
            letterSpacing: scaledValue(19 * -0.03),
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaledValue(4),
          }}>
          <Image
            source={Images.star}
            style={{width: scaledValue(16), height: scaledValue(16)}}
          />
          <GText
            medium
            text={`${parseFloat(
              Number(extraData?.averageRating).toFixed(1),
            )} (${extraData?.feedbackCount})`}
            style={{
              fontSize: scaledValue(19),
              color: colors.charcoal,
              letterSpacing: scaledValue(19 * -0.03),
            }}
          />
        </View>
      </View>
      {loading ? (
        <ActivityIndicator size={'small'} color={colors.themeColor} />
      ) : (
        <FlatList
          data={data.slice(0, 3)}
          style={{
            marginTop: scaledValue(12),
            marginBottom: data?.length > 3 ? scaledValue(12) : scaledValue(50),
          }}
          contentContainerStyle={{gap: scaledValue(12)}}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  backgroundColor: '#F5E9DF',
                  padding: scaledValue(16),
                  borderRadius: scaledValue(12),
                }}>
                <GText text={item?.feedback} />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: scaledValue(18),
                  }}>
                  <GText
                    beVietnamSemiBold
                    text={`${item?.fullName} - `}
                    style={{
                      fontSize: scaledValue(14),
                      letterSpacing: scaledValue(14 * -0.02),
                      color: colors.themeColor,
                    }}
                  />
                  <GText
                    beVietnamSemiBold
                    text={item?.location || item?.city}
                    style={{
                      fontSize: scaledValue(14),
                      letterSpacing: scaledValue(14 * -0.02),
                      color: colors.themeColor,
                    }}
                  />
                </View>
              </View>
            );
          }}
        />
      )}

      {data?.length > 3 && (
        <GradientBorderButton
          title={'Read More Reviews'}
          onPress={() => {
            setVisibleModal(true);
          }}
          buttonTextStyle={{
            fontSize: scaledValue(16),
            fontFamily: fonts.SUSE_MEDIUM,
            color: colors.themeColor,
            letterSpacing: scaledValue(16 * -0.03),
          }}
          buttonStyle={{
            marginBottom: scaledValue(50),
          }}
        />
      )}
      <OptionMenuSheet
        refRBSheet={refRBSheet}
        options={blockList}
        onChoose={val => {
          val.action();
        }}
        onPressCancel={() => refRBSheet.current.close()}
      />
      <OptionMenuSheet
        refRBSheet={refRBReasonsSheet}
        options={blockReasons}
        title={'Select Reason'}
        onChoose={val => {
          val.action();
          refRBReasonsSheet.current.close();
        }}
        onPressCancel={() => refRBReasonsSheet.current.close()}
      />
      <Modal
        isVisible={visibleModal}
        animationInTiming={500}
        useNativeDriver={true}
        coverScreen={true}
        statusBarTranslucent={true}
        style={{margin: 0, padding: 0}}
        onBackdropPress={() => {
          setVisibleModal(false);
        }}>
        <View
          style={{
            backgroundColor: colors.offWhite,
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: insets.top,
              // justifyContent: 'space-between',
              paddingHorizontal: scaledValue(12),
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setVisibleModal(false);
              }}
              style={{
                width: scaledValue(40),
                height: scaledValue(40),
                position: 'absolute',
                left: scaledValue(20),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={Images.Cross}
                tintColor={'#000'}
                style={{width: scaledValue(30), height: scaledValue(30)}}
              />
            </TouchableOpacity>
            <View style={{}}>
              <GText
                medium
                text={'Reviews'}
                style={{
                  fontSize: scaledValue(19),
                  color: colors.charcoal,
                  letterSpacing: scaledValue(19 * -0.03),
                }}
              />
            </View>
          </View>
          <FlatList
            data={data}
            onEndReached={() => loadMore()}
            ListFooterComponent={Loader}
            style={{
              marginTop: scaledValue(12),
              paddingHorizontal: scaledValue(20),
              marginBottom: scaledValue(50),
            }}
            contentContainerStyle={{gap: scaledValue(12)}}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    backgroundColor: '#F5E9DF',
                    padding: scaledValue(16),
                    borderRadius: scaledValue(12),
                  }}>
                  <GText text={item?.feedback} />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: scaledValue(18),
                    }}>
                    <GText
                      beVietnamSemiBold
                      text={`${item?.fullName} - `}
                      style={{
                        fontSize: scaledValue(14),
                        letterSpacing: scaledValue(14 * -0.02),
                        color: colors.themeColor,
                      }}
                    />
                    <GText
                      beVietnamSemiBold
                      text={item?.location || item?.city}
                      style={{
                        fontSize: scaledValue(14),
                        letterSpacing: scaledValue(14 * -0.02),
                        color: colors.themeColor,
                      }}
                    />
                  </View>
                </View>
              );
            }}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default PublicReviewScreen;
