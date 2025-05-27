import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Images} from '../../../utils';
import {scaledValue} from '../../../utils/design.utils';
import {colors} from '../../../../assets/colors';
import fonts from '../../../utils/fonts';
import GImage from '../../../components/GImage';

const ProfileCard = ({image, name, likes, place, emailDomainVerified}) => {
  return (
    <LinearGradient
      colors={['#DA7575', '#A45EB0']}
      start={{x: 0.5, y: 1}}
      end={{x: 0.5, y: 0}}
      style={styles.profileCardGradient}>
      <View style={styles.profileCardContainer}>
        <View style={styles.backgroundView}>
          <GImage image={image} style={styles.profileImage} />
          {/* <Image source={image} style={styles.profileImage} /> */}
        </View>
        <View style={styles.textview}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: scaledValue(4),
            }}>
            <Text style={styles.nameStyle}>{name}</Text>
            {emailDomainVerified === 1 && (
              <Image
                source={Images.verified}
                style={{width: scaledValue(16), height: scaledValue(16)}}
              />
            )}
          </View>
          <View style={styles.likesview}>
            <Image
              source={Images.heart}
              style={styles.heartImage}
              resizeMode="contain"
            />
            <Text style={styles.likesText}>{likes}</Text>
          </View>
          <View style={styles.placeview}>
            <Image
              source={Images.location}
              style={styles.locationImage}
              resizeMode="contain"
            />
            <Text style={styles.placeText}>{place}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  profileCardGradient: {
    borderRadius: scaledValue(12),
    marginTop: scaledValue(22),
    marginBottom: scaledValue(40),
    marginHorizontal: scaledValue(20),
  },
  profileCardContainer: {
    borderRadius: scaledValue(12),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaledValue(16),
    paddingVertical: scaledValue(16),
  },
  backgroundView: {
    height: scaledValue(72),
    width: scaledValue(72),
    borderRadius: scaledValue(50),
    backgroundColor: colors.lightLavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scaledValue(11),
  },
  profileImage: {
    width: '90%',
    height: '90%',
    borderRadius: scaledValue(50),
  },
  nameStyle: {
    fontSize: scaledValue(19),
    fontFamily: fonts.SUSE_MEDIUM,
    color: colors.offWhite,
    marginBottom: scaledValue(5),
  },
  likesview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartImage: {
    height: scaledValue(16),
    width: scaledValue(16),
    marginRight: scaledValue(5),
  },
  likesText: {
    fontSize: scaledValue(14),
    fontFamily: fonts.BE_VIETNAM_REGULAR,
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
    color: colors.offWhite,
  },
  placeview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationImage: {
    height: scaledValue(16),
    width: scaledValue(16),
    marginRight: scaledValue(5),
  },

  placeText: {
    fontSize: scaledValue(14),
    fontFamily: fonts.BE_VIETNAM_REGULAR,
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
    color: colors.offWhite,
    textTransform: 'capitalize',
  },
});
