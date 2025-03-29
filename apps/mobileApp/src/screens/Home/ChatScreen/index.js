import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {colors} from '../../../../assets/colors';
import LinearGradient from 'react-native-linear-gradient';
import {scaledValue, statusBarHeight} from '../../../utils/design.utils';
import GText from '../../../components/GText';
import ChatCard from './ChatCard';
import {styles} from './styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Input from '../../../components/Input';
import GImage from '../../../components/GImage';
import {Images} from '../../../utils';
import OptionMenuSheet from '../../../components/OptionMenuSheet';
import useDataFactory from '../../../components/UseDataFactory/useDataFactory';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';
import {
  edit_user_message,
  send_user_message,
} from '../../../redux/slices/chatSlice';
import {io} from 'socket.io-client';
import {enable_meeting} from '../../../redux/slices/communicationSlice';
import Spinner from 'react-native-loading-spinner-overlay';
import {SOCKET_URL} from '../../../constants';

const ChatScreen = ({navigation, route}) => {
  const {otherUserData, setData} = route?.params;
  const userData = useAppSelector(state => state.auth.user);
  const inputRef = useRef(null);
  const [selectMessage, setSelectMessage] = useState('');

  const [enableBookingSession, setEnableBookingSession] = useState(
    otherUserData?.isBookFirstSession,
  );
  const dispatch = useAppDispatch();
  const refRBSheet = useRef();
  const flatListRef = useRef(null);
  const insets = useSafeAreaInsets();
  const [inputMessage, setInputMessage] = useState('');
  const [editCheck, setEditCheck] = useState(false);

  const {
    loading: loading,
    data: chatStaticData,
    setData: setChatStaticData,
    extraData,
    refreshData,
    loadMore,
    Placeholder,
    Loader,
  } = useDataFactory(
    'chatList',
    true,
    {
      cognitoUserId: otherUserData?.cognitoUserId,
    },
    'POST',
  );

  const [enableMeeting, setEnableMeeting] = useState();

  useEffect(() => {
    setEnableMeeting(
      otherUserData?.isMeetingEnable || extraData?.isMeetingEnable,
    );
  }, [otherUserData?.isMeetingEnable, extraData?.isMeetingEnable]);

  const send_message = () => {
    setInputMessage('');
    const input = {
      cognitoUserId: otherUserData?.cognitoUserId,
      message: inputMessage,
    };

    const editMessageInput = {
      messageId: selectMessage?._id,
      message: inputMessage,
    };

    if (editCheck) {
      dispatch(edit_user_message(editMessageInput)).then(res => {
        if (edit_user_message.fulfilled.match(res)) {
          setChatStaticData(prevData =>
            prevData.map(item =>
              item._id === selectMessage?._id
                ? {
                    ...item,
                    message: inputMessage,
                    isEdit: 1,
                  }
                : item,
            ),
          );

          setEditCheck(false);
          setSelectMessage('');
        }
      });
    } else {
      dispatch(send_user_message(input)).then(res => {
        if (send_user_message.fulfilled.match(res)) {
          setInputMessage('');
          const newMessage = {
            fromIdDetail: {
              cognitoUserId: userData?.cognitoUserId,
              profilePic: userData?.profilePic,
            },
            message: inputMessage,
            createdAt: new Date().toISOString(),
            _id: res?.payload?._id,
          };

          setChatStaticData(prevData => {
            const updatedData = [newMessage, ...prevData];

            return updatedData;
          });
        }
      });
    }
  };

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.emit('registerUser', otherUserData?.cognitoUserId);
    socket.on(`sendMessage`, () => {
      console.log('Connected to WebSocket server new_invoice', Platform.OS);
    });

    socket.on(`sendMessage`, msg => {
      if (msg?.status === 1) {
        console.log('122222222', msg, userData?.fullName);

        const newMessage = {
          fromIdDetail: {
            cognitoUserId: msg?.sendercognitoUserId,
            profilePic: msg?.profilePic,
          },
          message: msg?.message,
          createdAt: msg?.updatedAt,
          messageType: msg?.messageType,
          meetingTitle: msg?.meetingTitle,
          meetingDate: msg?.meetingDate,
          meetingTime: msg?.meetingTime,
          meetingNote: msg?.meetingNote || '',
          _id: msg?._id,
          isEdit: msg?.isEdit,
        };

        if (otherUserData?.chatId === msg?.connectedId) {
          if (otherUserData?.cognitoUserIdSave === msg?.sendercognitoUserId) {
            if (msg?.isEdit === 1) {
              setChatStaticData(prevData =>
                prevData.map(item =>
                  item._id === msg?._id
                    ? {
                        ...item,
                        message: msg?.message,
                        isEdit: 1,
                      }
                    : item,
                ),
              );
            } else {
              setChatStaticData(prevData => {
                const updatedData = [newMessage, ...prevData];

                return updatedData;
              });
            }
          }
        }
      }
    });
    socket.on(`enableMeeting`, msg => {
      console.log('herehrehehe', msg);

      if (msg?.status === 1) {
        if (otherUserData?.cognitoUserIdSave === userData?.cognitoUserId) {
          setEnableMeeting(1);
        }
      }
    });

    return () => {
      // socket.emit('unsubscribe', `/api/profile/getChatSingleUser`);
      console.log('disconnect SOcekts');
      socket.disconnect();
    };
  }, []);
  console.log('otherUserData?.cognitoUserId', otherUserData?.cognitoUserId);

  const enable_meeting_hit = () => {
    const input = {
      cognitoUserId: otherUserData?.cognitoUserId,
    };
    dispatch(enable_meeting(input)).then(res => {
      if (enable_meeting.fulfilled.match(res)) {
        setEnableMeeting(1);
        setData(prevData =>
          prevData.map(item => {
            if (
              item.connectUserDetail.cognitoUserId ===
              otherUserData?.cognitoUserId
            ) {
              return {
                ...item,
                ...item.connectUserDetail,
                isMeetingEnable: 1,
              };
            }
            return item;
          }),
        );
      }
    });
  };

  return (
    <>
      <StatusBar backgroundColor="#A45EB0" barStyle="dark-content" />
      {editCheck ? (
        <LinearGradient
          colors={['#A45EB0', '#A45EB0', '#DA7575']}
          style={{
            paddingTop: insets.top,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scaledValue(15),
            height: scaledValue(130),
          }}>
          <TouchableOpacity
            onPress={() => {
              setEditCheck(false);
              setSelectMessage('');
              setInputMessage('');
            }}>
            <Image
              source={Images.leftArrow}
              style={styles.headerLeftArrowImage}
            />
          </TouchableOpacity>
          <GText
            satoshiMedium
            text={'Edit message'}
            style={[
              {
                paddingLeft: scaledValue(15),
                color: '#fff',
                fontSize: scaledValue(20),
                letterSpacing: scaledValue(16 * -0.03),
              },
            ]}
          />
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={['#A45EB0', '#A45EB0', '#DA7575']}
          style={[styles.headerContainer(statusBarHeight, insets.top)]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Image
              source={Images.leftArrow}
              tintColor={colors.offWhite}
              style={styles.headerLeftArrowImage}
            />
          </TouchableOpacity>
          <View style={styles.profileContainer}>
            <GImage
              image={otherUserData?.profilePic}
              style={styles.profileImage}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: scaledValue(4),
              }}>
              <GText
                semiBold
                text={otherUserData?.fullName}
                style={styles.profileName}
              />
              {otherUserData?.emailDomainVerified === 1 && (
                <Image
                  source={Images.verified}
                  style={{width: scaledValue(16), height: scaledValue(16)}}
                />
              )}
            </View>
          </View>
          {selectMessage ? (
            <TouchableOpacity
              onPress={() => {
                // setSelectMessage('');
                setEditCheck(true);
                setInputMessage(selectMessage?.message);
                inputRef?.current?.focus();
              }}
              style={{width: scaledValue(36), height: scaledValue(36)}}>
              <GText semiBold text={'Edit'} style={styles.profileName} />
            </TouchableOpacity>
          ) : userData?.userType === 1 && enableMeeting === 1 ? (
            <View style={{width: scaledValue(36), height: scaledValue(36)}} />
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.calendarButton,
                {
                  backgroundColor:
                    userData?.userType === 1 || enableMeeting === 1
                      ? colors.offWhite
                      : 'transparent',
                },
              ]}
              disabled={userData?.userType === 0 && enableMeeting === 0}
              onPress={() => {
                if (userData?.userType === 1) {
                  refRBSheet?.current?.open();
                } else if (userData?.userType === 0) {
                  if (enableBookingSession === 1) {
                    navigation?.navigate('StackScreens', {
                      screen: 'BookMeeting',
                      params: {
                        otherUserData: otherUserData,
                        mentorData: extraData,
                        meetingData: {},
                      },
                    });
                  } else if (enableBookingSession === 0) {
                    navigation?.navigate('StackScreens', {
                      screen: 'BookSession',
                      params: {
                        setData: setData,
                        otherUserData: otherUserData,
                        setEnableBookingSession: setEnableBookingSession,
                        mentorData: extraData,
                      },
                    });
                  }
                }
              }}>
              {userData?.userType === 1 || enableMeeting === 1 ? (
                <Image
                  source={
                    userData?.userType === 1
                      ? Images.MentorCalender
                      : Images.calender
                  }
                  style={
                    userData?.userType === 1
                      ? styles.mentorCalenderImage
                      : styles.calendarImage
                  }
                />
              ) : null}
            </TouchableOpacity>
          )}
        </LinearGradient>
      )}
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS == 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS == 'ios' ? scaledValue(0) : 0}>
        <View
          style={{
            flex: 1,
            backgroundColor: editCheck ? 'rgba(0,0,0,0.15)' : 'transparent',
          }}>
          <View style={styles.chatContainer}>
            <FlatList
              ref={flatListRef}
              data={chatStaticData}
              onEndReached={() => loadMore()}
              ListEmptyComponent={() => {
                return (
                  <>
                    {!loading && (
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: Dimensions.get('window').height / 3,
                        }}>
                        <GText
                          text={'No chats yet.\nStart a conversation!'}
                          style={{
                            fontSize: scaledValue(20),
                            textAlign: 'center',
                          }}
                        />
                      </View>
                    )}
                  </>
                );
              }}
              ListFooterComponent={Loader}
              inverted={chatStaticData?.length > 0 ? true : false}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => item + index}
              renderItem={({item, index}) => {
                return (
                  <View style={{opacity: editCheck ? 0.5 : 1}}>
                    <ChatCard
                      index={index}
                      item={item}
                      messageData={chatStaticData}
                      otherUserData={otherUserData}
                      selectMessage={selectMessage}
                      setSelectMessage={setSelectMessage}
                    />
                  </View>
                );
              }}
            />
          </View>
        </View>
        <View style={styles.inputContainer(insets)}>
          <TextInput
            ref={inputRef}
            multiline={true}
            numberOfLines={5}
            value={inputMessage}
            placeholder={'Type your message...'}
            placeholderTextColor={colors.charcoal}
            style={styles.input(inputMessage)}
            onChangeText={val => setInputMessage(val)}
          />
          {/* <Input
            ref={inputRef}
            value={inputMessage}
            placeholder={'Type your message...'}
            placeholderTextColor={colors.charcoal}
            style={styles.input}
            roundness={scaledValue(28)}
            outlineColor="transparent"
            activeOutlineColor="transparent"
            onChangeText={val => setInputMessage(val)}
          /> */}
          <TouchableOpacity
            disabled={!inputMessage}
            onPress={() => {
              if (selectMessage?.message === inputMessage) {
                setEditCheck(false);
                setSelectMessage('');
                setInputMessage('');
              } else {
                send_message();
              }
            }}>
            <Image
              source={Images.paperPlaneRightFill}
              style={{width: scaledValue(28), height: scaledValue(28)}}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <OptionMenuSheet
        refRBSheet={refRBSheet}
        options={[
          {id: 0, title: 'Enable Meeting Requests', textColor: '#007AFF'},
        ]}
        onChoose={val => {
          if (val) {
            enable_meeting_hit();
          }
          refRBSheet.current.close();
        }}
        onPressCancel={() => refRBSheet.current.close()}
      />
      <Spinner
        color={colors.themeColor}
        visible={loading}
        overlayColor="transparent"
      />
    </>
  );
};

export default ChatScreen;
