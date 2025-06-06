import {
  ImageBackground,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  Dimensions,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import {Images} from '../../../utils';
import GText from '../../../components/GText';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import GradientButton from '../../../components/GradientButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useDataFactory from '../../../components/UseDataFactory/useDataFactory';
import GImage from '../../../components/GImage';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';
import Spinner from 'react-native-loading-spinner-overlay';
import {get_recent_matches} from '../../../redux/slices/communicationSlice';
import moment from 'moment';
import {colors} from '../../../../assets/colors';

const Inbox = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(state => state.auth.user);
  const {height, width} = Dimensions.get('window');
  const [recentMatches, setRecentMatches] = useState([]);
  const [newConversationList, setNewConversationList] = useState([]);

  const hasNotch = () => {
    const aspectRatio = height / width;

    return (
      Platform.OS === 'ios' &&
      (aspectRatio > 2 || height >= 812 || width >= 812) // iPhone X or later has an aspect ratio > 2
    );
  };

  useEffect(() => {
    getRecentMatch();
  }, []);

  const getRecentMatch = () => {
    const input = {
      offset: 0,
    };

    dispatch(get_recent_matches(input)).then(res => {
      if (get_recent_matches.fulfilled.match(res)) {
        setRecentMatches(res?.payload);
      }
    });
  };

  const {
    loading: conversationLoading,
    data: conversationData,
    setData: setConversationData,
    refreshData: conversationRefreshData,
    loadMore: conversationLoadMore,
    Placeholder: conversationPlaceholder,
    Loader: conversationLoader,
  } = useDataFactory('conversationList', true, '', 'POST');

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation?.navigate('StackScreens', {
            screen: 'ProfileScreen',
            params: {
              searchUserData: item?.connectUserDetail,
              screen: 'InBox',
              itemIndex: index,
            },
          });
        }}
        activeOpacity={0.7}
        style={{
          marginLeft: index == 0 ? scaledValue(24) : scaledValue(12),
        }}>
        <GImage
          image={item?.connectUserDetail?.profilePic}
          style={styles.flatListImage}
        />
      </TouchableOpacity>
    );
  };
  const renderNewConvo = ({item, index}) => {
    return (
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          paddingVertical: scaledValue(11.5),
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (item?.startConversation?.includes(userData?.cognitoUserId)) {
              navigation?.navigate('StackScreens', {
                screen: 'ChatScreen',
                params: {
                  otherUserData: {
                    ...item?.connectUserDetail,
                    isMeetingEnable: item?.isMeetingEnable,
                    requestId: item?._id,
                    isBookFirstSession: item?.isBookFirstSession,
                    cognitoUserIdSave: item?.connectUserDetail?.cognitoUserId,
                    chatId: item?._id,
                  },
                  setData: setConversationData,
                },
              });
            } else {
              navigation?.navigate('StackScreens', {
                screen: 'MatchScreen',
                params: {
                  itemData: {
                    ...item?.connectUserDetail,
                    isMeetingEnable: item?.isMeetingEnable,
                    startConversation: item?.startConversation,
                    cognitoUserIdSave: item?.cognitoUserIdSave,
                  },
                  screen: 'Inbox',
                  requestId: item?._id,
                  setData: setConversationData,
                },
              });
            }
          }}
          style={styles.newConvoFlatList}>
          <GImage
            image={item?.connectUserDetail?.profilePic}
            style={styles.newConvoImage}
          />
          <View
            style={[
              styles.textView,
              {left: item?.isChat === 0 && scaledValue(10)},
            ]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <GText
                semiBold
                text={item?.connectUserDetail?.fullName}
                style={styles.nameStyle}
              />

              {item?.connectUserDetail?.emailDomainVerified === 1 && (
                <Image
                  source={Images.Verified_fill}
                  style={{
                    width: scaledValue(16),
                    height: scaledHeightValue(16),
                    left: scaledValue(4),
                  }}
                />
              )}
            </View>
            <GText
              beVietnamRegular
              componentProps={{
                numberOfLines: 2,
              }}
              text={item.lastMessage}
              style={styles.messageStyle}
            />
          </View>
          {item?.isChat === 0 ? (
            <View style={{gap: scaledValue(10)}}>
              <GradientButton
                gradientstyle={styles.gradientButton}
                textstyle={styles.buttonTextStyle}
                title={'New'}
              />
              <GText
                beVietnamBold
                medium
                text={formatTime(item?.updatedAt)}
                style={styles.timingStyle}
              />
            </View>
          ) : (
            <View style={styles.daysView}>
              <GText
                beVietnamBold
                medium
                text={formatTime(item?.lastMessagetime)}
                style={styles.daysStyle}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const formatTime = timestamp => {
    const inputDate = moment(timestamp);
    const now = moment();

    if (inputDate.isSame(now, 'day')) {
      return inputDate.format('HH:mm'); // Show time if it's today
    } else if (inputDate.isSame(now.clone().subtract(1, 'days'), 'day')) {
      return '1d ago'; // Show '1d ago' for yesterday
    } else if (now.diff(inputDate, 'days') < 7) {
      return `${now.diff(inputDate, 'days')}d ago`; // Show 'X days ago' if within a week
    } else {
      return `${now.diff(inputDate, 'weeks')}w ago`; // Show 'Xw ago' for weeks
    }
  };

  const groupedData = {
    new: conversationData.filter(item => item.isChat === 0),
    olderData: conversationData.filter(item => item.isChat === 1),
  };
  console.log('groupedDatas', JSON.stringify(groupedData));

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={Images.gradientRect}
        resizeMode="cover"
        style={[
          styles.imgBg,
          recentMatches?.length > 0 && {height: scaledValue(309)},
        ]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 1,
            position: 'absolute',
            top:
              Platform.OS == 'ios'
                ? insets?.top + scaledValue(13)
                : insets.top > 50
                ? insets.top
                : insets.top + scaledValue(13),
            paddingHorizontal: scaledValue(20),

            width: '100%',
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              marginRight: scaledValue(59),
            }}>
            <Image
              source={Images.leftArrow}
              style={styles.leftArrowStyle(insets)}
            />
          </TouchableOpacity>
          <GText medium text={'Conversations'} style={styles.headerText} />
        </View>
        <Image
          source={Images.whiteLines}
          style={[
            styles.whiteLines,
            {
              bottom:
                Platform.OS == 'ios' && insets.top > 50
                  ? -insets.bottom + scaledHeightValue(15)
                  : -insets.bottom + scaledHeightValue(26),
              marginTop: Platform.OS == 'android' && scaledValue(20),
            },
          ]}
        />

        <View
          style={{
            position: 'absolute',
            marginTop:
              Platform.OS == 'android'
                ? insets.top > 50
                  ? insets.top + scaledValue(65)
                  : insets.top + scaledValue(77)
                : insets.top + scaledValue(77),
          }}>
          {recentMatches?.length > 0 && (
            <>
              <GText
                medium
                text={'Recent Matches'}
                style={styles.subHeaderText}
              />
              <View style={{paddingTop: scaledHeightValue(14)}}>
                <FlatList
                  data={recentMatches}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderItem}
                  horizontal
                  style={{}}
                />
              </View>
            </>
          )}
        </View>
      </ImageBackground>
      <View
        style={[
          styles.containerView,
          {
            marginTop:
              Platform.OS == 'android'
                ? scaledValue(-40)
                : hasNotch()
                ? scaledValue(-25)
                : scaledValue(-50),
          },
        ]}>
        <FlatList
          data={[1]}
          onEndReached={() => conversationLoadMore()}
          ListFooterComponent={conversationLoader}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {
                getRecentMatch();
                conversationRefreshData();
              }}
            />
          }
          renderItem={({item, index}) => {
            return (
              <>
                <>
                  {!conversationLoading &&
                  newConversationList?.length < 1 &&
                  conversationData?.length < 1 ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: Dimensions.get('window').height / 3,
                      }}>
                      <GText
                        text={'No conversations yet!'}
                        style={{fontSize: scaledValue(20)}}
                      />
                    </View>
                  ) : (
                    Object.entries(groupedData).map(([key, items]) =>
                      items.length > 0 ? (
                        <View key={key}>
                          <View style={styles.contentView}>
                            <GText
                              text={
                                key.charAt(0).toUpperCase() + key.slice(1) ==
                                'New'
                                  ? '👋 New Conversation'
                                  : 'Older Conversations'
                              }
                              style={
                                key.charAt(0).toUpperCase() + key.slice(1) ==
                                'New'
                                  ? styles.newConversationText
                                  : styles.oldConvoText(groupedData[0])
                              }
                            />
                          </View>
                          {items.map((item, index) =>
                            renderNewConvo({item, index}),
                          )}
                          <View style={styles.lineView} />
                        </View>
                      ) : null,
                    )
                  )}
                </>
              </>
            );
          }}
        />
      </View>
      <Spinner
        color={colors.themeColor}
        visible={conversationLoading}
        overlayColor="transparent"
      />
    </View>
  );
};

export default Inbox;
