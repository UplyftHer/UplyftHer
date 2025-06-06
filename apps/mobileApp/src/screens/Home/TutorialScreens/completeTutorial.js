import {Dimensions, StyleSheet, View} from 'react-native';
import React from 'react';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import GText from '../../../components/GText';
import {colors} from '../../../../assets/colors';
import GradientButton from '../../../components/GradientButton';
import {Images} from '../../../utils';
import {setShowTutorial} from '../../../redux/slices/authSlice';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';

const {width} = Dimensions.get('window');

const CompleteTutorial = ({setTutorialVisible}) => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(state => state.auth.user);
  const user = userData?.userType === 0 ? 'Mentor' : 'Mentee';
  const gradientText = `Find Your ${user} Now`;

  return (
    <View style={styles.container}>
      <View style={styles.innerView}>
        <GText medium text={`You're all set! 🎉`} style={styles.allSetText} />
        <GradientButton
          title={gradientText}
          gradientstyle={styles.gradientStyle}
          textstyle={styles.buttonTextStyle}
          onPress={() => {
            setTutorialVisible(false);
            dispatch(setShowTutorial(false));
          }}
          imageSource={Images.lightningFill}
          imagestyle={styles.imgStyle}
        />
      </View>
    </View>
  );
};

export default CompleteTutorial;

const styles = StyleSheet.create({
  container: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scaledValue(20),
  },
  innerView: {
    justifyContent: 'center',
    height: '100%',
    marginTop: scaledValue(70),
  },
  allSetText: {
    color: colors.white,
    fontSize: scaledValue(33),
    letterSpacing: scaledValue(33 * -0.03),
    textAlign: 'center',
    lineHeight: scaledHeightValue(33 * 1.2),
  },
  gradientStyle: {
    height: scaledValue(48),
    marginTop: scaledValue(16),
  },
  buttonTextStyle: {
    color: colors.white,
    fontSize: scaledValue(19),
    letterSpacing: scaledValue(19 * -0.03),
    lineHeight: scaledHeightValue(19 * 1.2),
    marginRight: scaledValue(40),
  },
  imgStyle: {
    height: scaledValue(20),
    width: scaledValue(20),
    marginLeft: scaledValue(40),
  },
});
