import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect} from 'react';
import {styles} from './styles';
import {Images} from '../../../utils';
import HeaderButton from '../../../components/HeaderButton';
import GText from '../../../components/GText';

import LinearGradient from 'react-native-linear-gradient';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {useSelector} from 'react-redux';
import GImage from '../../../components/GImage';
import {
  get_saved_profile,
  saved_profile,
  setSavedProfile,
} from '../../../redux/slices/profileSlice';
import {useAppDispatch} from '../../../redux/store/storeUtils';
import useDataFactory from '../../../components/UseDataFactory/useDataFactory';
import Spinner from 'react-native-loading-spinner-overlay';
import {colors} from '../../../../assets/colors';
import useMatchingProfiles from '../../../hooks/useMatchingProfiles';

const SavedProfiles = ({navigation, route}) => {
  const savedProfileData = useSelector(state => state.profile.savedProfile);
  const {matchingProfileData, setMatchingProfileData} = useMatchingProfiles();
  const dispatch = useAppDispatch();
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
        <GText text="Saved Profiles" medium style={styles.headerTitleStyle} />
      ),
    });
  };

  // console.log('matchingProfileData58', matchingProfileData);

  const saved_profile_hit = id => {
    const input = {
      cognitoUserIdSave: id,
      status: '0',
    };
    const filteredData = data.filter(
      item => item?.cognitoUserIdSave?.cognitoUserId !== id,
    );
    dispatch(saved_profile(input)).then(res => {
      if (saved_profile.fulfilled.match(res)) {
        dispatch(setSavedProfile(filteredData));
        setData(filteredData);
        setMatchingProfileData(
          matchingProfileData?.map(i =>
            i?.cognitoUserId === id ? {...i, isSaved: false} : i,
          ),
        );
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
  } = useDataFactory('getSavedProfileData', true, '', 'POST');

  console.log('datadata', data?.length, !loading);

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.cardContainer(index)}
        onPress={() => {
          navigation?.navigate('StackScreens', {
            screen: 'ProfileScreen',
            params: {
              searchUserData: {
                ...item?.cognitoUserIdSave,
                isRequestSent: item?.isRequestSent,
                isMeetingEnable: item?.isMeetingEnable,
                rating: item?.rating,
                isSaved: item?.isSaved,
              },
              screen: 'SavedProfile',
              itemIndex: index,
              setUserListData: setData,
              userListData: data,
            },
          });
        }}>
        <GImage
          image={item?.cognitoUserIdSave?.profilePic}
          style={styles.userImage}
          resizeMode="contain"
        />
        <LinearGradient
          colors={['#4B164C00', '#4B164C']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.gradient}>
          <View style={[styles.userDetailsView]}>
            <View style={{flexDirection: 'row'}}>
              <GText
                beVietnamSemiBold
                text={`${item?.cognitoUserIdSave?.fullName?.split(' ')[0]}, ${
                  item?.cognitoUserIdSave?.age
                }`}
                style={styles.userName}
              />
            </View>

            <GText
              beVietnamBold
              text={
                item?.cognitoUserIdSave?.location ||
                item?.cognitoUserIdSave?.city
              }
              style={styles.userLocation}
            />
          </View>
        </LinearGradient>
        <TouchableOpacity
          onPress={() =>
            saved_profile_hit(item.cognitoUserIdSave.cognitoUserId)
          }
          style={styles.circularView}>
          <Image source={Images.saved} style={styles.saved} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <ScrollView>
          <FlatList
            onEndReached={() => loadMore()}
            ListFooterComponent={Loader}
            ListEmptyComponent={() => {
              return (
                <>
                  {!loading && data?.length < 1 && (
                    <View style={styles.emptyPlaceHolder}>
                      <GText
                        text={'No Saved Profiles yet!'}
                        style={{fontSize: scaledValue(20), textAlign: 'center'}}
                      />
                      <GText
                        text={
                          'Your saved profiles will appear here. Start exploring and save your favorites!'
                        }
                        style={{
                          fontSize: scaledValue(16),
                          textAlign: 'center',
                          marginTop: scaledValue(5),
                          lineHeight: scaledHeightValue(19.8),
                        }}
                      />
                    </View>
                  )}
                </>
              );
            }}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={refreshData} />
            }
            data={data}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={{
              marginTop: scaledValue(30),
              marginBottom: scaledValue(40),
              rowGap: scaledValue(16),
            }}
          />
        </ScrollView>
      </View>
      <Spinner
        color={colors.themeColor}
        visible={loading}
        overlayColor="transparent"
      />
    </View>
  );
};

export default SavedProfiles;
