import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {scaledValue} from '../../../utils/design.utils';
import LinearGradient from 'react-native-linear-gradient';
import GText from '../../../components/GText';
import {colors} from '../../../../assets/colors';
import GImage from '../../../components/GImage';

const UserCard = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.cardContainer(props?.index)}
      onPress={props.onPress}>
      <GImage image={props?.itemData?.profilePic} style={styles.userImage} />
      <LinearGradient
        colors={['#4B164C00', '#4B164C']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.gradient}>
        <View style={[styles.userDetailsView, props.userDetailStyle]}>
          <View style={{flexDirection: 'row'}}>
            <GText
              componentProps={{
                numberOfLines: 1,
                ellipsizeMode: 'tail',
              }}
              beVietnamSemiBold
              text={props.userName}
              style={styles.userName}
            />
            <GText
              beVietnamSemiBold
              text={props.userAge ? `, ${props.userAge}` : ''}
              style={styles.userName}
            />
          </View>
          {props?.location && (
            <GText
              beVietnamBold
              text={props?.location}
              style={styles.userLocation}
            />
          )}
        </View>
        {props?.label && (
          <View style={styles.labelView}>
            <LinearGradient
              colors={['#DA7575', '#A45EB0']}
              start={{x: 0.5, y: 1.5}}
              end={{x: 0.5, y: 0}}
              style={styles.labelGradient}>
              <GText
                beVietnamMedium
                text={props?.label}
                style={styles.labelText}
              />
            </LinearGradient>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  cardContainer: index => ({
    marginLeft: index == 0 ? scaledValue(16) : scaledValue(12),
    width: scaledValue(105),
    height: scaledValue(160),
    alignItems: 'center',
    borderRadius: scaledValue(16),
  }),
  gradient: {
    position: 'absolute',
    height: '60%',
    width: '100%',
    borderBottomLeftRadius: scaledValue(16),
    borderBottomRightRadius: scaledValue(16),
    bottom: 0,
    alignItems: 'center',
    overflow: 'hidden',
  },
  userImage: {
    borderRadius: scaledValue(16),
    width: scaledValue(105),
    height: scaledValue(160),
  },
  userDetailsView: {
    alignItems: 'center',
    position: 'absolute',
    bottom: scaledValue(30),
  },
  userName: {
    fontSize: scaledValue(14),
    color: colors.white,
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
  },
  userLocation: {
    fontSize: scaledValue(12),
    color: colors.white,
    textTransform: 'uppercase',
    lineHeight: scaledValue(15.6),
  },
  labelView: {
    marginTop: 'auto',
    borderTopRightRadius: scaledValue(8),
    borderTopLeftRadius: scaledValue(8),
    overflow: 'hidden',
    width: scaledValue(80),
  },
  labelGradient: {
    alignItems: 'center',
    borderTopRightRadius: scaledValue(8),
    borderTopLeftRadius: scaledValue(8),
  },
  labelText: {
    fontSize: scaledValue(11),
    lineHeight: scaledValue(14.3),
    color: colors.white,
    marginVertical: scaledValue(4),
  },
});
