import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import HeaderButton from '../../../components/HeaderButton';
import {Images} from '../../../utils';
import GText from '../../../components/GText';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scaledValue} from '../../../utils/design.utils';
import debounce from 'lodash.debounce';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../../assets/colors';
import useDataFactory from '../../../components/UseDataFactory/useDataFactory';
import GImage from '../../../components/GImage';
import {useAppSelector} from '../../../redux/store/storeUtils';
import CustomActivityIndicator from '../../../components/CustomActivityIndicator';

const SearchScreen = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const userData = useAppSelector(state => state.auth.user);

  const {
    loading: loading,
    data,
    setData,
    refreshData,
    loadMore,
    Placeholder,
    Loader,
  } = useDataFactory(
    'searchUser',
    true,
    {
      search: searchText || '',
    },
    'POST',
  );

  const [selectedIndex, setSelectedIndex] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([]);

  const handleSearch = text => {
    setSearchText(text);
    refreshData({
      search: text,
    });
  };

  const handlePress = (index, item) => {
    if (selectedIndex.includes(index)) {
      setSelectedIndex(selectedIndex.filter(i => i !== index));
      setSelectedFilter(selectedFilter.filter(i => i !== item?.name));
    } else {
      setSelectedIndex([...selectedIndex, index]);
      setSelectedFilter([...selectedFilter, item?.name]);
    }
  };

  useEffect(() => {
    refreshData({
      search: searchText || '',
      filter: selectedFilter,
    });
  }, [selectedFilter?.length > 0]);

  const insets = useSafeAreaInsets();
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.cardContainer(index)}
        onPress={() => {
          navigation?.navigate('ProfileScreen', {
            searchUserData: item,
            screen: 'SearchUser',
            setUserListData: setData,
            userListData: data,
          });
          /* Handle press here */
        }}>
        <GImage image={item?.profilePic} style={styles.userImage} />
        <LinearGradient
          colors={['#4B164C00', '#4B164C']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.gradient}>
          <View style={[styles.userDetailsView]}>
            <View style={{flexDirection: 'row'}}>
              <GText
                beVietnamSemiBold
                text={`${item?.fullName?.split(' ')[0]}, `}
                style={styles.userName}
              />
              <GText beVietnamSemiBold text={item.age} style={styles.age} />
            </View>
            {(item?.location || item?.city) && (
              <GText
                beVietnamBold
                text={item?.location || item?.city}
                style={styles.userLocation}
              />
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.headerView, {marginTop: insets.top + scaledValue(9)}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={Images.leftArrow} style={styles.leftArrow} />
        </TouchableOpacity>
        <View style={styles.searchView}>
          <View style={{width: scaledValue(186)}}>
            <TextInput
              value={selectedFilter}
              onChangeText={debounce(handleSearch, 600)}
              placeholder="Search by interest"
              style={styles.searchViewInput}
              placeholderTextColor={'#7E7E7E'}
            />
          </View>
          <Image
            style={styles.searchImage}
            source={Images.searchIconWithoutBorder}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('NotificationScreen')}>
          <Image style={styles.bellIcon} source={Images.bellIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.contentView}>
        <GText
          medium
          text="Suggested interests"
          style={styles.interestsHeader}
        />

        <View style={styles.yourInterestsCardView}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: scaledValue(8),
            }}>
            {selectedFilter?.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedFilter([]);
                  setSelectedIndex([]);
                }}>
                <GText
                  text={'Clear All'}
                  style={{fontSize: scaledValue(14), color: colors.black}}
                />
              </TouchableOpacity>
            )}
            <FlatList
              data={userData?.interests}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{gap: scaledValue(8)}}
              renderItem={({item, index}) => {
                const isSelected = selectedIndex.includes(index);
                return (
                  <TouchableOpacity
                    onPress={() => handlePress(index, item)}
                    style={[
                      styles.interestsCard,
                      isSelected && {backgroundColor: colors.themeColor},
                    ]}>
                    <GText
                      beVietnamSemiBold
                      text={item?.name}
                      style={[
                        styles.interestsTitle,
                        {
                          color: isSelected
                            ? colors.offWhite
                            : colors.themeColor,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
        {loading ? (
          <CustomActivityIndicator />
        ) : (
          <View style={{flex: 1}}>
            <FlatList
              data={data}
              showsVerticalScrollIndicator={false}
              onEndReached={loadMore}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: Dimensions.get('screen').height / 2.5,
                    }}>
                    <GText
                      text={'No results found.'}
                      style={{fontSize: scaledValue(20)}}
                    />
                  </View>
                );
              }}
              ListFooterComponent={Loader}
              renderItem={renderItem}
              keyExtractor={item => item?._id.toString()}
              numColumns={2}
              contentContainerStyle={{
                paddingBottom: scaledValue(40),
                rowGap: scaledValue(16),
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchScreen;
