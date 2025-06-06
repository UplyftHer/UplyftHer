import {
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  View,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {Images} from '../../../utils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';

import GText from '../../../components/GText';
import {avatar} from '../../../utils/Images';
import {styles} from './styles';
import GradientButton from '../../../components/GradientButton';
import {Text} from 'react-native-paper';
import fonts from '../../../utils/fonts';
import {colors} from '../../../../assets/colors';
import {useAppSelector} from '../../../redux/store/storeUtils';
import Clipboard from '@react-native-clipboard/clipboard';
import {showToast} from '../../../components/Toast';
import GImage from '../../../components/GImage';

const MeetingConfirmed = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const userData = useAppSelector(state => state.auth.user);

  return (
    // <View style={styles.container}>
    <ImageBackground source={Images.InvitationBg} style={{height: '100%'}}>
      {/* <ScrollView showsVerticalScrollIndicator={false} style={{flexGrow: 1}}> */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* <Image source={Images.whiteLines} style={styles.whiteLines} /> */}
      <View style={styles.headerTitileView(insets)}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={Images.leftArrow} style={styles.leftArrowStyle} />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: scaledValue(47),
            fontSize: scaledValue(19),
            lineHeight: scaledHeightValue(22.8),
            letterSpacing: scaledValue(19 * -0.03),
            fontFamily: fonts.SUSE_MEDIUM,
            color: colors.white,
          }}>
          Your Invitation Code
        </Text>
      </View>

      <View>
        <GText
          medium
          text={'Here’s your exclusive \n invite code! 💫'}
          style={styles.subtitleStyle}
        />
      </View>

      <View style={styles.meetingCardMainContainer(insets)}>
        <View style={styles.profileCardMainView}>
          <View style={styles.profileCardView}>
            {/* <View style={styles.userDetailView}> */}
            <GImage image={userData?.profilePic} style={styles.userImage} />
            {/* </View> */}
            <GText medium text={userData?.fullName} style={styles.userName} />
          </View>
        </View>
        <View style={styles.centerCircleView} />
        <View style={[styles.dottedImageView, {marginTop: 0}]}>
          <Image style={styles.dottedImage} source={Images.dottedDivider} />
        </View>

        <View style={styles.dottedLineView}>
          <View style={styles.leftCircleView} />
          <GText
            medium
            text={userData?.myInvitationCode}
            style={styles.codeText}
          />

          <View style={styles.rightCircleView} />
        </View>

        <View style={styles.dottedImageView}>
          <Image style={styles.dottedImage} source={Images.dottedDivider} />
        </View>
        <GText
          style={styles.codeValidText}
          beVietnamSemiBold
          text={'Code valid for 3 sign-ups only.'}
        />

        <GradientButton
          title={'Copy Code'}
          onPress={() => {
            Clipboard.setString(userData?.myInvitationCode);
            showToast(1, 'Invitation code copied!');
          }}
          imagestyle={{width: scaledValue(19), height: scaledValue(19)}}
          gradientstyle={styles.gradientStyle}
          textstyle={{
            fontSize: scaledValue(19),
            lineHeight: scaledValue(22.8),
            letterSpacing: scaledValue(19 * -0.03),
            marginHorizontal: scaledValue(20),
          }}
        />
      </View>
      {/* </ScrollView> */}
    </ImageBackground>
    // </View>
  );
};

export default MeetingConfirmed;
