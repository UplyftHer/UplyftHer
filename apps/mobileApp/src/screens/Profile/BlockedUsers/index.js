import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import {Images} from '../../../utils';
import HeaderButton from '../../../components/HeaderButton';
import GText from '../../../components/GText';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import {useSelector} from 'react-redux';
import GImage from '../../../components/GImage';

import {useAppDispatch} from '../../../redux/store/storeUtils';
import useDataFactory from '../../../components/UseDataFactory/useDataFactory';
import Spinner from 'react-native-loading-spinner-overlay';
import {colors} from '../../../../assets/colors';
import useMatchingProfiles from '../../../hooks/useMatchingProfiles';
import {block_unblock_user} from '../../../redux/slices/profileSlice';
import {setLoading} from '../../../redux/slices/loadingSlice';

const BlockedUsers = ({navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectItem, setSelectItem] = useState('');
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
  } = useDataFactory('getBlockedUsersList', true, '', 'POST');

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.cardContainer(index)}
        // onPress={() => {
        //   navigation?.navigate('StackScreens', {
        //     screen: 'ProfileScreen',
        //     params: {
        //       searchUserData: item,
        //       screen: 'BlockList',
        //       itemIndex: index,
        //     },
        //   });
        // }}
      >
        <GImage
          image={item?.profilePic}
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
                text={`${item?.fullName.split(' ')[0]}, ${item?.age}`}
                style={styles.userName}
              />
            </View>

            <GText
              beVietnamBold
              text={item?.location || item?.city}
              style={styles.userLocation}
            />
          </View>
        </LinearGradient>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setSelectItem(item);
            setShowModal(true);
          }}
          style={styles.menuTriggerImgView}>
          <Image source={Images.moreHorizontal} style={styles.menuImgStyle} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const blockUser = () => {
    const api_credentials = {
      cognitoUserId: selectItem?.cognitoUserId,
      status: '0',
    };
    dispatch(block_unblock_user(api_credentials)).then(res => {
      if (block_unblock_user.fulfilled.match(res)) {
        setData(
          data.filter(
            item => item?.cognitoUserId !== selectItem?.cognitoUserId,
          ),
        );
        setSelectItem({});
      }
    });
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
                        text={'Your Block List is Empty'}
                        style={{fontSize: scaledValue(20), textAlign: 'center'}}
                      />
                      <GText
                        text={
                          'Users you block will be listed here. You can block someone anytime from their profile.'
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
      <Modal isVisible={showModal} onBackdropPress={() => setShowModal(false)}>
        <View
          style={{
            width: '85%',
            paddingVertical: scaledValue(20),
            backgroundColor: colors.offWhite,
            alignSelf: 'center',
            borderRadius: scaledValue(12),
          }}>
          <GText
            semiBold
            text={`Unblock ${selectItem?.fullName?.split(' ')[0]}`}
            style={{
              textAlign: 'center',
              lineHeight: scaledHeightValue(19.08),
              fontSize: scaledValue(20),
              color: colors.charcoal,
              paddingVertical: scaledValue(4),
            }}
          />
          <GText
            beVietnamRegular
            text={`Are you sure you want to unblock ${
              selectItem?.fullName?.split(' ')[0]
            }? By unblocking, you will allow them to contact you and interact with your profile again.`}
            style={{
              textAlign: 'center',
              lineHeight: scaledHeightValue(19.08),
              fontSize: scaledValue(16),
              paddingVertical: scaledValue(8),
              paddingHorizontal: scaledValue(20),
              color: colors.charcoal,
              opacity: 0.8,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setShowModal(false);
              setTimeout(() => {
                blockUser();
              }, 400);
            }}
            style={{paddingVertical: scaledValue(15)}}>
            <GText
              beVietnamBold
              text={`Unblock`}
              style={{
                textAlign: 'center',
                lineHeight: scaledHeightValue(19.08),
                fontSize: scaledValue(18),
                color: colors.themeColor,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            style={{paddingVertical: scaledValue(5)}}>
            <GText
              beVietnamMedium
              text={`Cancel`}
              style={{
                textAlign: 'center',
                lineHeight: scaledHeightValue(19.08),
                fontSize: scaledValue(17),
                color: '#007AFF',
              }}
            />
          </TouchableOpacity>
        </View>
      </Modal>
      <Spinner
        color={colors.themeColor}
        visible={loading}
        overlayColor="transparent"
      />
    </View>
  );
};

export default BlockedUsers;
