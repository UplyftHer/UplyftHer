import {Image, ImageBackground, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Images} from '../../../../utils';
import GText from '../../../../components/GText';
import {styles} from './styles';
import GImage from '../../../../components/GImage';
import {colors} from '../../../../../assets/colors';
import {scaledValue} from '../../../../utils/design.utils';

const ProfileCard = props => {
  console.log('props?.item', props?.item);

  return (
    <View style={[styles.gradientContainer, props?.style]}>
      <ImageBackground
        source={Images.radialGradientBg}
        style={styles.linearGradientBg}>
        <View style={styles.profileMainView}>
          <View style={styles.profileView}>
            <View style={styles.userDetailStyle}>
              <GImage image={props?.userImage} style={styles.userImage} />
            </View>
            <View>
              <GText text={props?.firstName} style={styles.userName} />
              <GText text={props?.lastName} style={styles.userName} />
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={props.onPressMenu}>
            <Image source={Images.menuThreeDotFill} style={styles.menuIcon} />
          </TouchableOpacity>
        </View>
        <GText medium text={props?.content} style={styles.contentStyle} />
        <View style={styles.dateView}>
          <Image source={Images.calendarFill} style={styles.bottomIcon} />
          <GText
            beVietnamBold
            text={props?.date}
            style={styles.bottomContent}
          />
        </View>
        <View style={styles.timeView}>
          <Image source={Images.clockFill} style={styles.bottomIcon} />
          <GText text={props?.time} style={styles.bottomContent} />
        </View>
        {/* {props?.videoText && ( */}
        <View style={styles.timeView}>
          <Image
            tintColor={colors.offWhite}
            source={
              props?.item?.mode == 'videoCall'
                ? Images.videoCamera
                : props?.item?.mode == 'audioCall'
                ? Images.phoneFill
                : Images.cup
            }
            style={styles.bottomIcon}
          />
          <GText
            text={
              props?.item?.mode == 'videoCall'
                ? 'Video call'
                : props?.item?.mode == 'audioCall'
                ? 'Phone call'
                : 'In-person'
            }
            style={styles.bottomContent}
          />
        </View>
        {/* )} */}
        {props?.item?.mode != 'inPerson' && (
          <View
            style={{
              flexDirection: props?.item?.status === 1 ? 'row' : 'column',
              // justifyContent: 'space-between',
              width: '100%',
              gap: scaledValue(10),
              justifyContent: 'center',
            }}>
            {props?.item?.status === 1 && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  props?.endMeetingOnPress();
                }}
                style={[
                  styles.buttonStyle,
                  {backgroundColor: colors.darkShadeOfPurple, borderWidth: 0},
                ]}>
                <GText
                  medium
                  text={'End meeting'}
                  style={styles.buttonTextStyle}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                props?.meetingOnPress();
              }}
              style={styles.buttonStyle}>
              <Image source={Images.VideoIcon} style={styles.iconStyle} />
              <GText
                medium
                text={'Join meeting'}
                style={styles.buttonTextStyle}
              />
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

export default ProfileCard;
