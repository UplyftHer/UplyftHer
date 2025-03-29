import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  getFontSize,
  scaledHeightValue,
  scaledValue,
} from '../../../utils/design.utils';
import {colors} from '../../../../assets/colors';
import GText from '../../../components/GText';
import {useAppSelector} from '../../../redux/store/storeUtils';
import GImage from '../../../components/GImage';
import {Images} from '../../../utils';

const ChatCard = props => {
  const {message, createdAt, fromIdDetail, index, chatStaticData} = props?.item;
  const userData = useAppSelector(state => state.auth.user);

  const formatTime = isoString => {
    const date = new Date(isoString);

    const options = {hour: 'numeric', minute: 'numeric', hour12: true};
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  const formatDate = isoDate => {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', {month: 'long'});
    return `${day} ${month}`;
  };

  // const isSameAuthor =
  //   index < chatStaticData?.length - 1 &&
  //   participantsMessage[index + 1].authorUuid === item?.authorUuid;

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          props?.setSelectMessage('');
        }}
        onLongPress={() => {
          if (
            userData?.cognitoUserId === props?.item?.fromIdDetail?.cognitoUserId
          ) {
            props?.setSelectMessage(props?.item);
          }
        }}
        disabled={props?.item?.messageType === 1}
        style={[
          styles.cardMainContainer(
            fromIdDetail?.cognitoUserId,
            userData?.cognitoUserId,
            props?.item?.messageType,
          ),
          {
            backgroundColor:
              props?.selectMessage?._id === props?.item?._id
                ? '#ddd'
                : 'transparent',
          },
        ]}>
        <View>
          {props?.item?.messageType === 1 && userData?.userType === 1 ? (
            <View style={{marginBottom: scaledValue(10)}}>
              <View
                style={{
                  backgroundColor: '#966B9D',
                  width: scaledValue(335),
                  paddingVertical: scaledValue(18),
                  alignItems: 'center',
                  borderRadius: scaledValue(12),
                }}>
                <GText
                  beVietnamSemiBold
                  text={props?.item?.meetingTitle}
                  style={{
                    color: '#FFFAFA',
                    fontSize: scaledValue(14),
                    lineHeight: scaledHeightValue(18.2),
                    letterSpacing: scaledValue(14 * -0.02),
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: scaledValue(10),
                  }}>
                  <GText
                    beVietnamSemiBold
                    text={formatDate(props?.item?.meetingDate)}
                    style={{
                      color: '#FFFAFA',
                      fontSize: scaledValue(14),
                      lineHeight: scaledHeightValue(18.2),
                      letterSpacing: scaledValue(14 * -0.02),
                    }}
                  />
                  <Image
                    source={Images.Ellipse}
                    style={{width: scaledValue(7), height: scaledValue(7)}}
                  />
                  <GText
                    beVietnamSemiBold
                    text={props?.item?.meetingTime}
                    style={{
                      color: '#FFFAFA',
                      fontSize: scaledValue(14),
                      lineHeight: scaledHeightValue(18.2),
                      letterSpacing: scaledValue(14 * -0.02),
                    }}
                  />
                </View>
              </View>
              {props?.item?.meetingNote != '' && (
                <View
                  style={{
                    marginTop: scaledValue(18),
                    alignItems: 'center',
                    marginHorizontal: scaledValue(40),
                    marginBottom: scaledValue(10),
                  }}>
                  <GText
                    beVietnamSemiBold
                    text={`📝 ${
                      props?.otherUserData?.fullName?.split(' ')[0]
                    } added a personal note to her meeting request.`}
                    style={{
                      color: '#5A5A5A',
                      fontSize: scaledValue(14),
                      lineHeight: scaledHeightValue(18.2),
                      letterSpacing: scaledValue(14 * -0.02),
                      textAlign: 'center',
                    }}
                  />
                </View>
              )}
            </View>
          ) : (
            <>
              {message != '' && (
                <View
                  style={[
                    styles.chatCardView(
                      fromIdDetail?.cognitoUserId,
                      userData?.cognitoUserId,
                    ),
                  ]}>
                  <GText
                    beVietnamRegular
                    text={message}
                    style={styles.chatText}
                  />
                  {props?.item?.isEdit === 1 && (
                    <GText
                      text={'Edited'}
                      componentProps={{
                        numberOfLines: 1,
                      }}
                      style={[
                        {
                          color: colors.darkCharcoal,
                          fontSize: getFontSize(11),
                          letterSpacing: scaledValue(15 * 0.02),
                          top: scaledValue(8),
                        },
                        fromIdDetail?.cognitoUserId ===
                          userData?.cognitoUserId && {
                          right: scaledValue(8),
                          alignSelf: 'flex-end',
                        },
                        fromIdDetail?.cognitoUserId !=
                          userData?.cognitoUserId && {
                          left: scaledValue(8),
                          alignSelf: 'flex-start',
                          marginLeft: scaledValue(-10),
                        },
                      ]}
                    />
                  )}
                </View>
              )}
            </>
          )}
          {props?.item?.meetingNote && (
            <View
              style={styles.cardMainContainer(
                fromIdDetail?.cognitoUserId,
                userData?.cognitoUserId,
              )}>
              <View>
                <View
                  style={[
                    styles.chatCardView(
                      fromIdDetail?.cognitoUserId,
                      userData?.cognitoUserId,
                    ),
                  ]}>
                  <GText
                    beVietnamSemiBold
                    text={`Note from ${
                      props?.otherUserData?.fullName?.split(' ')[0]
                    }`}
                    style={{
                      color: colors.themeColor,
                      fontSize: getFontSize(15),
                      lineHeight: getFontSize(21),
                      letterSpacing: scaledValue(15 * 0.02),
                    }}
                  />
                  <GText
                    beVietnamRegular
                    text={props?.item?.meetingNote}
                    style={styles.chatText}
                  />
                </View>

                <GText
                  beVietnamMedium
                  text={formatTime(createdAt)}
                  style={{
                    color: colors.darkCharcoal,
                    fontSize: scaledValue(12),
                    lineHeight: scaledValue(15.6),
                    letterSpacing: scaledValue(12 * 0.02),
                    paddingLeft: scaledValue(19),
                    top: scaledValue(4),
                    opacity: 0.5,
                  }}
                />
              </View>
              <GImage
                image={fromIdDetail?.profilePic}
                style={styles.userImage}
              />
            </View>
          )}
          {props?.item?.messageType != 1 && (
            <GText
              beVietnamMedium
              text={formatTime(createdAt)}
              style={styles.chatTime(message, fromIdDetail, userData)}
            />
          )}
        </View>
        {props?.item?.messageType != 1 && (
          <GImage image={fromIdDetail?.profilePic} style={styles.userImage} />
        )}
      </TouchableOpacity>
    </>
  );
};

export default ChatCard;

const styles = StyleSheet.create({
  cardMainContainer: (sender, userId, messageType) => {
    // console.log(sender, userId);

    return {
      flexDirection: sender == userId ? 'row' : 'row-reverse',
      alignItems: 'flex-end',
      justifyContent: messageType === 1 ? 'center' : 'flex-end',
      marginBottom: messageType === 1 ? scaledValue(3) : scaledValue(24),
    };
  },
  chatCardView: (sender, userId) => ({
    backgroundColor:
      sender == userId ? colors.lavenderPink : colors.pinkishBeige,
    // width: scaledValue(260),
    borderTopLeftRadius: scaledValue(20),
    borderTopRightRadius: scaledValue(20),
    borderBottomLeftRadius: sender == userId ? scaledValue(20) : 0,
    borderBottomRightRadius: sender == userId ? 0 : scaledValue(20),
    paddingVertical: scaledValue(16),
    // paddingLeft: scaledValue(20),
    // paddingRight: scaledValue(12),
    padding: scaledValue(20),
    marginRight: scaledValue(5),
    marginLeft: sender == userId ? '9%' : scaledValue(5),
    maxWidth: '92%',
  }),
  chatText: {
    color: colors.darkCharcoal,
    fontSize: getFontSize(15),
    lineHeight: getFontSize(21),
    letterSpacing: scaledValue(15 * 0.02),
  },
  chatTime: (message, fromIdDetail, userData) => ({
    color: colors.darkCharcoal,
    fontSize: scaledValue(12),
    lineHeight: scaledValue(15.6),
    letterSpacing: scaledValue(12 * 0.02),
    paddingLeft: scaledValue(14),
    top: scaledValue(4),
    opacity: 0.5,
    right:
      fromIdDetail?.cognitoUserId == userData?.cognitoUserId
        ? scaledValue(19)
        : 0,
    alignSelf:
      fromIdDetail?.cognitoUserId == userData?.cognitoUserId
        ? 'flex-end'
        : 'flex-start',
  }),
  userImage: {
    width: scaledValue(24),
    height: scaledValue(24),
    borderRadius: scaledValue(50),
  },
});
