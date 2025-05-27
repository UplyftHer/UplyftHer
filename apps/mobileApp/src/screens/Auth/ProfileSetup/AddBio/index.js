import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Images} from '../../../../utils';
import GText from '../../../../components/GText';
import {styles} from './styles';
import Input from '../../../../components/Input';
import {colors} from '../../../../../assets/colors';
import GradientButton from '../../../../components/GradientButton';
import {scaledHeightValue, scaledValue} from '../../../../utils/design.utils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import {openSettings, PERMISSIONS, request} from 'react-native-permissions';
import {useAppDispatch} from '../../../../redux/store/storeUtils';
import {edit_user_profile} from '../../../../redux/slices/authSlice';
import fonts from '../../../../utils/fonts';
import HeaderButton from '../../../../components/HeaderButton';

const AddBio = ({navigation, route}) => {
  const {fieldParams} = route?.params;

  const wordLimit = 200;
  const dispatch = useAppDispatch();
  const [isFocused, setIsFocused] = useState(false);
  const [apiCallImage, setApiCallImage] = useState();
  const [image, setImage] = useState();
  const [inputValue, setInputValue] = useState('');
  const insets = useSafeAreaInsets();
  const getWordsCount = text => {
    if (text?.length <= wordLimit) {
      setInputValue(text);
    }
  };

  useEffect(() => {
    configureHeader();
  }, []);

  const configureHeader = () => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          icon={Images.leftArrow}
          onPress={() => navigation.goBack()}
          tintColor={'#966B9D'}
          iconStyle={{width: scaledValue(40), height: scaledValue(40)}}
          style={{paddingHorizontal: scaledValue(20)}}
        />
      ),
      headerTitle: () => (
        <Text style={styles.headerText1}>
          Profile Setup <Text style={styles.headerText2}>(3 of 3)</Text>
        </Text>
      ),
    });
  };

  // const preferenceTexts = [
  //   {
  //     text1: '“I would like a',
  //     text2: fieldParams?.userType === 0 ? 'mentee' : 'mentor',
  //     color: colors.themeColor,
  //   },
  //   {text1: 'from the ', text2: fieldParams?.industry, color: colors.softRed},
  //   {
  //     text1: 'with expertise in',
  //     text2: fieldParams?.occupation,
  //     color: colors.peachy,
  //   },
  //   {
  //     text1: 'who is based in',
  //     text2: fieldParams?.city,
  //     color: colors.themeColor,
  //   },
  // ];

  const preferenceTexts = [
    {
      text1: '“I would like a',
      text2: fieldParams?.userType === 0 ? 'mentee' : 'mentor',
      color: colors.themeColor,
    },
    {text1: 'from the ', text2: fieldParams?.industry, color: colors.softRed},
    fieldParams?.occupation !== ''
      ? {
          text1: 'with expertise in',
          text2: fieldParams?.occupation,
          color: colors.peachy,
        }
      : null,
    {
      text1: 'who is based in',
      text2: fieldParams?.city,
      color: colors.themeColor,
    },
  ].filter(Boolean); // removes any null or false values

  const handlePicker = async () => {
    if (Platform.OS == 'android') {
      const status = await PermissionsAndroid.request(
        'android.permission.READ_MEDIA_IMAGES',
      );

      if (
        status === 'granted' ||
        status === 'unavailable' ||
        status === 'never_ask_again'
      ) {
        console.log('underGranted');

        ImagePicker.openPicker({
          width: 800,
          height: 800,
          cropping: false,
          compressImageMaxHeight: 800,
          compressImageMaxWidth: 800,
          // mediaType: 'photo',
        })
          .then(image => {
            let name =
              Platform.OS == 'android'
                ? image?.path.substring(image?.path.lastIndexOf('/') + 1)
                : image?.filename;
            let type = image?.mime;
            let localUri = image?.path;
            console.log('herherhehher000', image);
            setImage(image?.path);
            setApiCallImage({name, uri: localUri, type});
          })
          .catch(error => {
            console.error('Error opening picker:', error);
          });
        console.log('Permission granted');
      } else if (status === 'denied' || status === 'blocked') {
        Alert.alert(
          'Permission Blocked',
          'Please grant permission to access photos in order to select an image.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => console.log('cancel'),
            },
            {
              text: 'Open Settings',
              onPress: () => openSettings(),
            },
          ],
        );
      }
    } else {
      const status = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (status === 'granted' || status === 'limited') {
        ImagePicker.openPicker({
          width: 800,
          height: 800,
          cropping: false,
          compressImageMaxHeight: 800,
          compressImageMaxWidth: 800,
          mediaType: 'photo',
        }).then(image => {
          console.log('imagePickertss', image);
          let name =
            Platform.OS == 'android'
              ? image?.path.substring(image?.path.lastIndexOf('/') + 1)
              : image?.filename;
          let type = image?.mime;
          let localUri = image?.path;
          setImage(image?.path);
          setApiCallImage({name, uri: localUri, type});
        });
      } else if (status === 'denied') {
        Alert.alert(
          'Permission Denied',
          'Please grant permission to access photos in order to select an image.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => console.log('cancel'),
            },
            {
              text: 'Open Settings',
              onPress: () => openSettings(),
            },
          ],
        );
      } else if (status === 'blocked') {
        Alert.alert(
          'Permission Blocked',
          'Please grant permission to access photos in order to select an image.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => console.log('cancel'),
            },
            {
              text: 'Open Settings',
              onPress: () => openSettings(),
            },
          ],
        );
      }
    }
  };

  const edit_user_profile_hit = () => {
    const api_credential = {
      fullName: fieldParams?.fullName,
      age: fieldParams?.age,
      country: fieldParams?.country,
      city: fieldParams?.city,
      userType: fieldParams?.userType,
      occupation: fieldParams?.occupation,
      industry: fieldParams?.industry,
      organizationName: fieldParams?.organizationName,
      interests: JSON.stringify(fieldParams?.interests),
      bio: inputValue,
      preference: fieldParams?.preference,
      profilePic: apiCallImage,
      preference: JSON.stringify([
        {
          preferenceId: '1',
          type: fieldParams?.userType === 0 ? 'mentee' : 'mentor',
        },
        {preferenceId: '2', type: fieldParams?.industry},
        {preferenceId: '4', type: fieldParams?.occupation},
        {preferenceId: '5', type: fieldParams?.city},
      ]),
      iso2: fieldParams?.iso2,
    };
    console.log('api_credentialapi_credential', api_credential);

    try {
      dispatch(edit_user_profile(api_credential));
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : ''}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: scaledHeightValue(7),
          }}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            activeOpacity={1}
            style={{position: 'absolute', left: scaledValue(20)}}>
            <Image
              source={Images.leftArrow}
              tintColor={colors.themeColor}
              style={{width: scaledValue(40), height: scaledValue(40)}}
            />
          </TouchableOpacity>
          <Text style={styles.headerText1}>
            Profile Setup <Text style={styles.headerText2}>(3 of 3)</Text>
          </Text>
        </View> */}
        {/* <Text style={styles.headerText1}>
          Profile Setup <Text style={styles.headerText2}>(3 of 3)</Text>
        </Text> */}
        <GText text="Add Bio" medium style={styles.basicInfoText} />
        <ImageBackground
          borderRadius={scaledValue(50)}
          source={image ? {uri: image} : Images.circularBg}
          style={styles.circularBg}>
          {!image && (
            <Image source={Images.gradientFace} style={styles.gradientFace} />
          )}

          <TouchableOpacity onPress={handlePicker} style={styles.cameraBg}>
            <Image
              source={Images.gradientCamera}
              resizeMode="contain"
              style={styles.gradientCamera}
            />
          </TouchableOpacity>
        </ImageBackground>
        <GText text="Upload Picture" medium style={styles.uploadText} />
        <Input
          value={inputValue}
          placeholderTextColor={colors.Gray}
          showLabel={isFocused}
          contentStyle={{
            fontSize: scaledValue(14),
            fontFamily: fonts?.BE_VIETNAM_MEDIUM,
            lineHeight: scaledHeightValue(18.2),
            textAlignVertical: 'top',
          }}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          placeholder="Write a brief description highlighting background, skills, interests, and other relevant information to personalize the profile and make meaningful connections"
          multiline
          style={styles.textInput}
          labelStyle={{flexWrap: 'wrap'}}
          activeOutlineColor={colors.slightlyPink}
          outlineColor={colors.slightlyPink}
          label={
            isFocused && (
              <GText
                beVietnamBold
                text={'Short Bio'}
                style={{
                  color: colors.themeColor,
                  textAlignVertical: 'top',
                }}
              />
            )
          }
          onChangeText={getWordsCount}
        />
        <View style={styles.wordCountText}>
          <GText
            beVietnamMedium
            style={styles.countingText}
            text={`${inputValue?.length}/${wordLimit}`}
          />
        </View>
        <View style={{paddingHorizontal: scaledValue(20)}}>
          <GText
            medium
            style={styles.preferenceHeader}
            text="Set Your Preference"
          />
          <View style={{gap: scaledValue(12)}}>
            {preferenceTexts.map((preference, index) => (
              <TouchableOpacity
                activeOpacity={0.6}
                key={index}
                style={styles.preferenceTextView}>
                {preference?.text2 && (
                  <>
                    <Text numberOfLines={1} style={styles.firstText}>
                      {preference.text1}
                    </Text>
                    <Text
                      style={[styles.secondText, {color: preference.color}]}>
                      {preference.text2}
                    </Text>
                  </>
                )}
                {/* <Image
                source={Images.downArrow}
                style={[styles.arrowStyle, {tintColor: preference.color}]}
              /> */}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View
          style={{
            marginTop: scaledValue(50),
            marginBottom: scaledValue(40),
          }}>
          <GradientButton
            title={'Complete Profile'}
            // disabled={!inputValue}
            style={styles.gradientbutton}
            gradientstyle={styles.gradientStyle}
            textstyle={styles.textStyle}
            onPress={() => {
              // console.log('Navigating to DashboardScreen');
              // navigation.navigate('DashBoardScreen');
              edit_user_profile_hit();
            }}
            imageSource={Images.verified}
            imagestyle={styles.verifiedImage}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddBio;
