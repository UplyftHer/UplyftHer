import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

import {Images} from '../../../utils';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GText from '../../../components/GText';
import {scaledValue} from '../../../utils/design.utils';
import {styles} from './styles';
import {colors} from '../../../../assets/colors';
import CustomRating from '../../../components/CustomRating';
import Input from '../../../components/Input';
import GradientButton from '../../../components/GradientButton';

const FeedbackScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const wordLimit = 200;
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const getWordsCount = text => {
    if (text?.length <= wordLimit) {
      setInputValue(text);
    }
  };
  return (
    <View style={styles.container}>
      {/* <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      /> */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingStyle}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={Images.gradientRect}
            resizeMode="cover"
            style={styles.imgBg}>
            <Image source={Images.whiteLines} style={styles.whiteLines} />
            <View style={styles.headerTitleView(insets)}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={Images.leftArrow}
                  style={styles.leftArrowStyle}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>Feedback</Text>
            </View>

            <View style={{top: scaledValue(-56)}}>
              <GText
                medium
                text="You’ve Uplyfted Yourself! 🚀"
                style={styles.titleStyle}
              />
              <GText
                beVietnamRegular
                text="Tell your mentor how they helped you grow!"
                style={styles.subtitleStyle}
              />
            </View>
          </ImageBackground>

          <View style={styles.ratingView}>
            <Image style={styles.profileImage} source={Images.profileDummy} />
            <GText style={styles.nameText} medium text="Emma Clark" />
            <GText
              style={styles.placeText}
              beVietnamRegular
              text="Manchester, UK"
            />
            <GText style={styles.ratingText} medium text="Rate Emma" />
            <CustomRating
              maxRating={5}
              filledStar={Images.star}
              unfilledStar={Images.unfilledStar}
              onRatingChange={rating => console.log('Rating selected:', rating)}
              starContainerStyle={{marginHorizontal: 8}}
              imageStyle={styles.starImage}
            />
          </View>
          <View style={styles.textInputView}>
            <Input
              value={inputValue}
              placeholder="Tell your mentor what you found helpful or suggest areas for future focus (optional)"
              multiline
              style={styles.textInput}
              labelStyle={{flexWrap: 'wrap'}}
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
              activeOutlineColor={colors.slightlyPink}
              outlineColor={colors.slightlyPink}
              label={
                isFocused ? (
                  <GText
                    beVietnamBold
                    text={'Your Feedback for Emma'}
                    style={{
                      color: colors.themeColor,
                    }}
                  />
                ) : (
                  ''
                )
              }
              onChangeText={getWordsCount}
            />
            <View style={styles.wordCountText}>
              <GText text={`${inputValue?.length}/${wordLimit}`} />
            </View>
          </View>
          <GradientButton
            title={'💁‍♀️  Submit Feedback'}
            textstyle={styles.buttonText}
            gradientstyle={styles.buttonStyle}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default FeedbackScreen;
