import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Images} from '../../../../utils';
import GText from '../../../../components/GText';
import {styles} from './styles';
import Input from '../../../../components/Input';
import {colors} from '../../../../../assets/colors';
import GradientButton from '../../../../components/GradientButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scaledHeightValue, scaledValue} from '../../../../utils/design.utils';
import {useEffect, useRef, useState} from 'react';
import OptionMenuSheet from '../../../../components/OptionMenuSheet';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../redux/store/storeUtils';
import SubLocations from '../../../../components/SubLocations';
import GOptions from '../../../../components/GOptions';
import countriescities from '../../../../../assets/countriescities.json';
import {get_cities_api} from '../../../../redux/slices/authSlice';
import useDataFactory from '../../../../components/UseDataFactory/useDataFactory';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HeaderButton from '../../../../components/HeaderButton';

const BasicInfo = ({navigation, route}) => {
  const {responseData} = route?.params;
  const fullName = responseData?.linkedinProfileData?.name;
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const refRBSheet = useRef();
  const industryList = useAppSelector(state => state.auth.industryList);
  const [subCity, setSubCity] = useState([]);
  const [countryId, setCountryId] = useState();
  const refRBSheetCountry = useRef();
  const refRBSheetCity = useRef();
  const updatedIndustryList = industryList.map(({name, ...rest}) => ({
    title: name,
    ...rest,
  }));
  const industryRefRBSheet = useRef();
  const [field, setField] = useState({
    full_name: fullName || '',
    age: '',
    occupation: '',
    ['company name']: '',
    userType: '',
    industry: '',
    city: '',
    country: '',
  });

  const [errors, setErrors] = useState({
    full_name: '',
    industry: '',
    country: '',
    city: '',
    userType,
  });

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
          style={{paddingHorizontal: scaledValue(20)}}
        />
      ),
      headerTitle: () => (
        <Text style={styles.headerText1}>
          Profile Setup <Text style={styles.headerText2}>(1 of 3)</Text>
        </Text>
      ),
    });
  };

  const handleTextChange = input => {
    const filteredText = input
      .replace(/[^a-zA-Z ]/g, '')
      .replace(/\s+/g, ' ')
      .trimStart();
    setField({...field, full_name: filteredText});
    if (input?.trim()) setErrors(prev => ({...prev, full_name: ''})); // Remove error when typing
  };

  const sendParam = {
    fullName: field?.full_name,
    age: field?.age,
    country: field?.country,
    city: field?.city,
    userType: field?.userType?.id,
    occupation: field?.occupation,
    industry: field?.industry?.title,
    organizationName: field?.['company name'],
    responseData: responseData,
    iso2: countryId,
  };

  const handleSubmit = () => {
    let newErrors = {};

    if (!field?.full_name?.trim()) newErrors.full_name = '*';
    if (!field?.country?.trim()) newErrors.country = '*';
    if (!field?.city?.trim()) newErrors.city = '*';
    if (!field?.industry?.title?.trim()) newErrors.industry = '*';
    if (!field?.userType?.title?.trim()) newErrors.user_Type = '*';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      navigation.navigate('SelectInterests', {
        fieldParams: sendParam,
      });
    }
  };
  const dispatch = useAppDispatch();

  const getCitiesData = item => {
    setCountryId(item?.iso2);
    const input = {
      countryId: item?.iso2,
    };

    dispatch(get_cities_api(input)).then(res => {
      if (get_cities_api.fulfilled.match(res)) {
        console.log('res.payload', JSON.stringify(res.payload));

        setSubCity(res.payload);
      }
    });
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

  const handleSearch = text => {
    setSearchText(text);
    setField({...field, ['company name']: text});
    refreshData({
      search: text,
    });
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      extraHeight={Platform.OS == 'ios' ? scaledValue(200) : ''}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: insets.top + scaledValue(17),
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              navigation?.goBack();
            }}
            style={{
              position: 'absolute',
              left: 0,
              paddingHorizontal: scaledValue(20),
            }}>
            <Image
              source={Images.leftArrow}
              tintColor={colors.themeColor}
              style={{width: scaledValue(40), height: scaledValue(40)}}
            />
          </TouchableOpacity>
          <Text style={styles.headerText1}>
            Profile Setup <Text style={styles.headerText2}>(1 of 3)</Text>
          </Text>
        </View> */}
        <GText text="Basic Info" medium style={styles.basicInfoText} />
        <GText
          text={`Help us personalize your experience by\n sharing a few details about yourself.`}
          beVietnamRegular
          style={styles.contentText}
        />
        <GText
          text={`( * Fields are required )`}
          style={{
            color: 'red',
            fontSize: scaledValue(14),
            paddingLeft: scaledValue(12),
            marginBottom: scaledValue(31),
            textAlign: 'center',
            marginTop: scaledValue(5),
          }}
        />

        <View style={{paddingHorizontal: scaledValue(20)}}>
          <Input
            value={field?.full_name}
            placeholder={'Full name*'}
            onChangeText={handleTextChange}
            placeholderTextColor={colors.inputPlaceholder}
            style={[styles.input]}
            error={!!errors.full_name}
          />

          <Input
            value={field?.age}
            placeholder={'Age'}
            keyboardType={'number-pad'}
            placeholderTextColor={colors.inputPlaceholder}
            style={[styles.input]}
            onChangeText={val => setField({...field, age: val})}
          />

          <TouchableOpacity
            onPress={() => {
              refRBSheetCountry?.current?.open();
            }}
            style={{
              borderWidth: field?.country ? scaledValue(1) : scaledValue(0.5),
              borderColor: '#312943',
              height: scaledValue(48),
              borderRadius: scaledValue(12),
              justifyContent: 'space-between',
              paddingHorizontal: scaledValue(15),
              marginBottom: scaledValue(16),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <GText
              beVietnamRegular
              componentProps={{numberOfLines: 1, ellipsizeMode: 'tail'}}
              text={field?.country || 'Select Country*'}
              style={styles.organizationText}
            />
            <Image source={Images.downArrow} style={styles.rightIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              refRBSheetCity?.current?.open();
            }}
            style={{
              borderWidth: field?.city ? scaledValue(1) : scaledValue(0.5),
              borderColor: '#312943',
              height: scaledValue(48),
              borderRadius: scaledValue(12),
              justifyContent: 'space-between',
              paddingHorizontal: scaledValue(15),
              marginBottom: scaledValue(16),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <GText
              beVietnamRegular
              componentProps={{numberOfLines: 1, ellipsizeMode: 'tail'}}
              text={field?.city || 'Select City*'}
              style={styles.organizationText}
            />
            <Image source={Images.downArrow} style={styles.rightIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              refRBSheet?.current?.open();
            }}
            activeOpacity={0.7}
            style={{
              height: scaledValue(48),
              borderWidth: field?.userType?.title
                ? scaledValue(1)
                : scaledValue(0.5),
              borderColor: '#312943',
              borderRadius: scaledValue(12),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: scaledValue(16),
              marginBottom: scaledValue(16),
            }}>
            <GText
              beVietnamRegular
              text={field?.userType?.title || 'User Type*'}
              style={{
                color: '#5A5A5A',
                fontSize: scaledValue(16),
                lineHeight: scaledHeightValue(20.8),
                letterSpacing: scaledValue(16 * -0.02),
              }}
            />
            <Image source={Images.downArrow} style={styles.rightIcon} />
          </TouchableOpacity>

          <Input
            value={field?.occupation}
            placeholder={'Job'}
            onChangeText={val => setField({...field, occupation: val})}
            placeholderTextColor={colors.inputPlaceholder}
            style={styles.input}
          />
          <Input
            value={field?.['company name']}
            placeholder={'Company Name'}
            onChangeText={handleSearch}
            rightIcon={searchText && Images.Cross}
            onPressRightIcon={() => {
              setData([]);
              setSearchText('');
              setField({...field, ['company name']: ''});
            }}
            placeholderTextColor={colors.inputPlaceholder}
            style={[
              styles.input,
              {
                // marginBottom: scaledHeightValue(8),
              },
            ]}
          />
          {data?.length > 0 && (
            <FlatList
              data={data?.slice(0, 5)}
              style={{marginBottom: scaledValue(8)}}
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
                        setField({
                          ...field,
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

          <TouchableOpacity
            onPress={() => {
              industryRefRBSheet?.current?.open();
            }}
            activeOpacity={0.7}
            style={{
              height: scaledValue(48),
              borderWidth: field?.industry?.title
                ? scaledValue(1)
                : scaledValue(0.5),
              borderColor: '#312943',
              borderRadius: scaledValue(12),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: scaledValue(16),
            }}>
            <GText
              beVietnamRegular
              text={field?.industry?.title || 'Industry*'}
              style={styles.organizationText}
            />
            <Image source={Images.downArrow} style={styles.rightIcon} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: scaledValue(70),
            marginBottom: scaledValue(40),
          }}>
          <GradientButton
            title={'Next'}
            style={styles.gradientbutton}
            imagestyle={styles.imageStyle}
            gradientstyle={styles.gradientStyle}
            textstyle={styles.textStyle}
            onPress={() => handleSubmit()}
          />
        </View>
      </ScrollView>
      <OptionMenuSheet
        refRBSheet={refRBSheet}
        title={'Select User Type'}
        options={userType}
        onChoose={val => {
          setField({...field, userType: val});
          refRBSheet.current.close();
          if (val?.title?.trim()) setErrors(prev => ({...prev, user_Type: ''}));
        }}
        onPressCancel={() => refRBSheet.current.close()}
      />
      <OptionMenuSheet
        refRBSheet={industryRefRBSheet}
        title={'Select Industry Type'}
        options={updatedIndustryList}
        onChoose={val => {
          setField({...field, industry: val});
          industryRefRBSheet.current.close();

          if (val?.title?.trim()) setErrors(prev => ({...prev, industry: ''}));
        }}
        onPressCancel={() => industryRefRBSheet.current.close()}
      />
      <GOptions
        refRBSheet={refRBSheetCountry}
        title="Select Country"
        options={countriescities}
        search={true}
        onChoose={val => {
          getCitiesData(val);
          setField({...field, country: val?.name, city: ''});
          refRBSheetCountry?.current?.close();
          if (val?.name?.trim()) setErrors(prev => ({...prev, country: ''}));
        }}
      />
      <SubLocations
        refRBSheet={refRBSheetCity}
        title={'Select City'}
        options={subCity?.cities}
        search={true}
        onChoose={val => {
          setField({...field, city: val[0]});
          refRBSheetCity?.current?.close();
          if (val[0]?.trim()) setErrors(prev => ({...prev, city: ''}));
        }}
      />
    </KeyboardAwareScrollView>
  );
};

export default BasicInfo;

const userType = [
  {
    id: 0,
    title: 'Mentee',
    textColor: '#3E3E3E',
  },
  {
    id: 1,
    title: 'Mentor',
    textColor: '#3E3E3E',
  },
];
