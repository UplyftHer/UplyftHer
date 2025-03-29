import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  Alert,
  PermissionsAndroid,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import GText from '../../../components/GText';
import HeaderButton from '../../../components/HeaderButton';
import {Images} from '../../../utils';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {colors} from '../../../../assets/colors';
import Input from '../../../components/Input';
import fonts from '../../../utils/fonts';
import GradientButton from '../../../components/GradientButton';
import {styles} from './styles';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';
import OptionMenuSheet from '../../../components/OptionMenuSheet';
import {openSettings, PERMISSIONS, request} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import GImage from '../../../components/GImage';
import {
  edit_user_profile,
  get_cities_api,
  get_industry_api,
  get_interests_api,
  search_location,
} from '../../../redux/slices/authSlice';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import debounce from 'lodash.debounce';
import countriescities from '../../../../assets/countriescities.json';
import SubLocations from '../../../components/SubLocations';
import GOptions from '../../../components/GOptions';
import {showToast} from '../../../components/Toast';
import GTextButton from '../../../components/GTextButton';
import useDataFactory from '../../../components/UseDataFactory/useDataFactory';

const EditProfile = ({navigation}) => {
  const authState = useAppSelector(state => state.auth.user);
  const [subCity, setSubCity] = useState([]);
  const [selectLocation, setSelectLocation] = useState({iso3: 'Country'});
  const [selectSubLocation, setSubSelectLocation] = useState('City');
  const interestsList = useAppSelector(state => state.auth.interestsList);
  const industryList = useAppSelector(state => state.auth.industryList);
  const updatedIndustryList = industryList.map(({name, ...rest}) => ({
    title: name,
    ...rest,
  }));
  const industryRefRBSheet = useRef();
  const [searchText, setSearchText] = useState('');
  const wordLimit = 200;
  const refRBSheetCountry = useRef();
  const refRBSheetCity = useRef();
  const [inputValue, setInputValue] = useState(authState?.bio);
  const [apiCallImage, setApiCallImage] = useState();
  const [image, setImage] = useState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // dispatch(get_industry_api());
    // dispatch(get_interests_api());
  }, []);

  const [isFocused, setIsFocused] = useState(false);
  const [selectedItems, setSelectedItems] = useState(authState?.interests);
  const toggleSelectItem = item => {
    const isSelected = selectedItems.some(i => i.interestId === item._id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter(i => i.interestId !== item._id));
    } else {
      setSelectedItems([
        ...selectedItems,
        {interestId: item._id, name: item.name, icon: item?.icon},
      ]);
    }
  };
  const [fields, setFields] = useState({
    name: authState?.fullName,
    email: authState?.email,
    age: authState?.age,
    country: authState?.country,
    city: authState?.city,
    occupation: authState?.occupation,
    ['company name']: authState?.organizationName,
    industry: authState?.industry,
    bio: '',
  });

  const handleTextChange = input => {
    // Allow only alphabets (A-Z, a-z)
    // const filteredText = input.replace(/[^a-zA-Z]/g, '');
    const filteredText = input
      .replace(/[^a-zA-Z ]/g, '')
      .replace(/\s+/g, ' ')
      .trimStart();
    // setText(filteredText);
    setFields({...fields, name: filteredText});
  };

  const fieldLabels = {
    name: 'Full Name',
    email: 'Email Address',
    age: 'Age',
    // location: 'Location',
    occupation: 'Job',
    organization: 'Organization',
    bio: 'Short Bio',
  };

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
          iconStyle={styles.headerIconStyle}
          style={{paddingHorizontal: 0}}
        />
      ),
      headerTitle: () => (
        <GText text="Edit Profile" medium style={styles.headerTitleStyle} />
      ),
    });
  };

  const edit_user_profile_hit = () => {
    const api_credential = {
      fullName: fields?.name,
      age: fields?.age,
      country: fields?.country,
      city: fields?.city,
      occupation: fields?.occupation,
      industry: fields?.industry,
      organizationName: fields?.['company name'],
      interests: JSON.stringify(selectedItems),
      bio: inputValue,
      profilePic: apiCallImage,
      userType: authState?.userType,
      preference: JSON.stringify([
        {
          preferenceId: '1',
          type: authState?.userType === 0 ? 'mentee' : 'mentor',
        },
        {preferenceId: '2', type: fields?.industry},
        {preferenceId: '4', type: fields?.occupation},
        {preferenceId: '5', type: fields?.city + fields?.country},
      ]),
      iso2: countryId,
    };

    try {
      dispatch(edit_user_profile(api_credential));
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Handler to update field values for all fields except 'bio'
  const handleInputChange = (key, value) => {
    setFields(prevFields => ({...prevFields, [key]: value}));
  };

  // Function to handle word count limit for the bio field
  const getWordsCount = text => {
    if (text?.length <= wordLimit) {
      setInputValue(text);
      setFields(prevFields => ({...prevFields, bio: text})); // Update bio field
    }
  };

  const [searchList, setSearchList] = useState([]);

  const handleSearch = text => {
    setSearchText(text);
    setFields({...fields, ['company name']: text});
    refreshData({
      search: text,
      // filter: selectedFilter,
    });
  };

  const search_user_location = text => {
    dispatch(
      search_location({
        query: text,
      }),
    ).then(res => {
      if (search_location.fulfilled.match(res)) {
        setSearchList(res?.payload?.data);
      }
    });
  };

  useEffect(() => {
    // getCitiesData(authState);
  }, [authState?.iso2]);

  const [countryId, setCountryId] = useState();

  const getCitiesData = item => {
    setCountryId(item?.iso2);
    const input = {
      countryId: item?.iso2,
    };

    dispatch(get_cities_api(input)).then(res => {
      if (get_cities_api.fulfilled.match(res)) {
        setSubCity(res.payload);
      }
    });
  };

  // Dynamically generate Input fields with custom labels

  const renderInputs = () =>
    Object.keys(fields).map(key => {
      const isBio = key === 'bio';
      const isCountry = key === 'country';
      const isCity = key === 'city';
      const isAge = key === 'age';
      const isEmail = key === 'email';
      const isOrganization = key === 'company name';
      const isLabel2 = key === 'industry';

      return (
        <View key={key} style={styles.renderView}>
          {!isLabel2 && !isCountry && !isCity && (
            <Input
              showLabel
              value={isBio ? inputValue : fields[key]}
              rightIcon={
                key === 'company name' &&
                fields?.['company name'] &&
                Images.Cross
              }
              onPressRightIcon={() => {
                setData([]);
                setSearchText('');
                setFields({...fields, ['company name']: ''});
              }}
              keyboardType={isAge ? 'number-pad' : 'default'}
              onChangeText={
                isBio
                  ? getWordsCount
                  : key === 'name'
                  ? handleTextChange
                  : key === 'company name'
                  ? handleSearch
                  : value => handleInputChange(key, value)
              }
              editable={!isEmail}
              multiline={isBio}
              numberOfLines={isBio ? 4 : 1}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={styles.inputStyle(isBio)}
              labelStyle={styles.labelStyle(isBio)}
              activeOutlineColor={colors.themeColor}
              outlineColor={'#7E7E7E'}
              label={
                <GText
                  text={
                    fieldLabels[key] ||
                    key.charAt(0).toUpperCase() + key.slice(1)
                  }
                  style={styles.labelStyling(isFocused, fields)}
                />
              }
            />
          )}

          {key === 'company name' && (
            <FlatList
              data={data?.slice(0, 5)}
              keyboardShouldPersistTaps="handled"
              renderItem={({item, index}) => {
                return (
                  <View
                    key={item?._id}
                    style={{
                      backgroundColor: '#fff',
                      gap: scaledValue(10),
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setFields({
                          ...fields,
                          ['company name']: item?.organizationName,
                        });
                        setData([]);
                      }}
                      style={{
                        paddingLeft: scaledValue(15),
                        paddingVertical: scaledValue(12),
                        justifyContent: 'center',
                        top: scaledValue(5),
                      }}>
                      <GText text={item?.organizationName} />
                    </TouchableOpacity>
                    {data?.length !== index + 1 && (
                      <View
                        style={{
                          borderWidth: scaledValue(0.5),
                          borderColor: '#ccc',
                          marginHorizontal: 10,
                        }}
                      />
                    )}
                  </View>
                );
              }}
            />
          )}

          {isEmail && (
            <GTextButton
              onPress={() => navigation?.navigate('ChangeEmail')}
              title={'Change email'}
              style={{
                alignSelf: 'flex-end',
                position: 'absolute',
                bottom: scaledValue(-20),
              }}
              titleStyle={{
                color: colors.themeColor,
                fontFamily: fonts.SUSE_SEMIBOLD,
              }}
            />
          )}

          {isCountry && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    refRBSheetCountry?.current?.open();
                  }}
                  style={{
                    borderWidth: scaledValue(1),
                    borderColor: '#7E7E7E',
                    height: scaledValue(48),
                    borderRadius: scaledValue(12),
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: scaledValue(15),
                    flexDirection: 'row',
                  }}>
                  <GText
                    beVietnamRegular
                    componentProps={{numberOfLines: 1, ellipsizeMode: 'tail'}}
                    text={fields?.country || 'Select Country'}
                    style={styles.organizationText}
                  />
                  <Image source={Images.downArrow} style={styles.rightIcon} />
                </TouchableOpacity>
              </View>
            </>
          )}
          {isCity && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    refRBSheetCity?.current?.open();
                  }}
                  style={{
                    borderWidth: scaledValue(1),
                    borderColor: '#7E7E7E',
                    height: scaledValue(48),
                    borderRadius: scaledValue(12),
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: scaledValue(15),
                    flexDirection: 'row',
                  }}>
                  <GText
                    beVietnamRegular
                    componentProps={{numberOfLines: 1, ellipsizeMode: 'tail'}}
                    text={fields?.city || 'Select City'}
                    style={styles.organizationText}
                  />
                  <Image source={Images.downArrow} style={styles.rightIcon} />
                </TouchableOpacity>
              </View>
            </>
          )}
          {isBio && (
            <View style={styles.wordCountText}>
              <GText
                beVietnamMedium
                style={styles.countingText}
                text={`${inputValue.length}/${wordLimit}`}
              />
            </View>
          )}

          {isOrganization && (
            <TouchableOpacity
              onPress={() => industryRefRBSheet?.current?.open()}
              style={styles.organizationButton}>
              <GText
                beVietnamRegular
                text={fields?.industry || 'Industry'}
                style={styles.organizationText}
              />
              <Image source={Images.downArrow} style={styles.rightIcon} />
            </TouchableOpacity>
          )}
        </View>
      );
    });

  const renderItem = ({item}) => {
    const isSelected = selectedItems.some(i => i.interestId === item._id);
    return (
      <TouchableOpacity
        onPress={() => toggleSelectItem(item)}
        style={[
          styles.interestsView,
          isSelected && {backgroundColor: colors.themeColor},
        ]}>
        <Text
          style={[styles.interestsTextStyle, isSelected && {color: 'white'}]}>
          {item.name}
        </Text>
        {isSelected && (
          <TouchableOpacity onPress={() => toggleSelectItem(item)}>
            <Image source={Images.Cross} style={styles.crossIconStyle} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const {
    loading: loading,
    data,
    setData,
    refreshData,
    loadMore,
    Placeholder,
    Loader,
  } = useDataFactory(
    'searchCompany',
    true,
    {
      search: searchText || '',
    },
    'POST',
  );

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.scrollView}
      extraHeight={Platform.OS == 'ios' ? scaledValue(200) : ''}>
      <View style={{alignSelf: 'center'}}>
        <GImage
          image={image ? image : authState?.profilePic}
          directUrl={image && true}
          style={styles.userImgStyle}
        />
        <TouchableOpacity
          onPress={handlePicker}
          style={styles.cameraPickerViewStyle}>
          <Image
            source={Images.gradientCamera}
            style={styles.cameraIconStyle}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputViewStyle}>{renderInputs()}</View>
      <GText
        beVietnamSemiBold
        text={'Select Interests'}
        style={styles.interestsTitleStyle}
      />
      <View style={styles.interestMainView}>
        {interestsList.map((item, index) => renderItem({item}))}
      </View>
      <View style={styles.buttonView}>
        <GradientButton
          onPress={() => {
            if (!fields?.name?.trim()) {
              showToast(0, 'Name is required');
            } else if (!fields?.country?.trim()) {
              showToast(0, 'Country is required');
            } else if (!fields?.city?.trim()) {
              showToast(0, 'City is required');
            } else if (!fields?.industry) {
              showToast(0, 'Industry is required');
            } else {
              edit_user_profile_hit();
            }
          }}
          title={'Update Profile'}
          gradientstyle={styles.gradientButtonStyle}
          textstyle={styles.gradientTitleStyle}
        />
      </View>
      <OptionMenuSheet
        refRBSheet={industryRefRBSheet}
        title={'Select Industry Type'}
        options={updatedIndustryList}
        onChoose={val => {
          setFields(prevFields => ({...prevFields, industry: val?.title}));
          industryRefRBSheet.current.close();
        }}
        onPressCancel={() => industryRefRBSheet.current.close()}
      />
      <GOptions
        refRBSheet={refRBSheetCountry}
        title="Select Country"
        options={countriescities}
        search={true}
        onChoose={val => {
          setSelectLocation(val);
          getCitiesData(val);
          setSubSelectLocation([]);
          // setDetails({...details, country: val.iso3});
          setFields({...fields, country: val?.name, city: ''});
          refRBSheetCountry?.current?.close();
        }}
      />
      <SubLocations
        refRBSheet={refRBSheetCity}
        options={subCity?.cities}
        title={'Select City'}
        search={true}
        onChoose={val => {
          setSubSelectLocation(val);
          // setSelectCity(val);
          // setDetails({...details, city: val[0]});
          // console.log('val[]', val[0]);

          setFields({...fields, city: val[0]});
          refRBSheetCity?.current?.close();
        }}
      />
    </KeyboardAwareScrollView>
  );
};

export default EditProfile;
