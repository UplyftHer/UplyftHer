import {Image, ImageBackground, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {Images} from '../../../utils';
import GText from '../../../components/GText';
import GButton from '../../../components/GButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SessionLocked = ({navigation}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <ImageBackground source={Images.gradientBackground} style={styles.imgBg}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={Images.leftArrow}
            style={styles.leftArrowStyle(insets)}
          />
        </TouchableOpacity>
        <View>
          <GText
            medium
            style={styles.headerTitle}
            text="Meeting Confirmed! 🥳"
          />
        </View>

        <ImageBackground style={styles.whiteLines} source={Images.whiteLines}>
          <View style={styles.imageContainer}>
            <View style={[styles.backgroundView, {right: -25}]}>
              <Image style={styles.matchImageSecond} source={Images.avatar} />
            </View>
            <View style={[styles.backgroundView, {left: -25}]}>
              <Image
                style={styles.matchImageFirst}
                source={Images.profileDummy}
              />
            </View>
          </View>
        </ImageBackground>
        <GText
          medium
          style={styles.titleText}
          text={`Your session with\nEmma is locked in!`}
        />

        <GText
          beVietnamRegular
          style={styles.subtitle}
          text={`Get ready to connect and dive into your goals!\nCheck your calendar for details, and we’ll remind you\n before it starts.Time to grow!`}
        />

        <GButton
          textStyle={styles.buttonText}
          title="📥  Add to Calendar"
          style={styles.buttonStyle}
          onPress={() => navigation.navigate('FeedbackScreen')}
        />
      </ImageBackground>
    </View>
  );
};

export default SessionLocked;
