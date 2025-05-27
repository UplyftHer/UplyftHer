import {
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from './styles';
import {
  scaledHeightValue,
  scaledValue,
  statusBarHeight,
} from '../../../utils/design.utils';
import {
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {leftArrow} from '../../../utils/Images';
import {colors} from '../../../../assets/colors';
import GText from '../../../components/GText';
import {useAppDispatch, useAppSelector} from '../../../redux/store/storeUtils';
import GImage from '../../../components/GImage';
import moment from 'moment';
import GradientButton from '../../../components/GradientButton';
import GradientBorderButton from '../../../components/GradientBorderButton';
import Spinner from 'react-native-loading-spinner-overlay';
import {accept_decline_request} from '../../../redux/slices/notificationSlice';
import useDataFactory from '../../../components/UseDataFactory/useDataFactory';
import {useEffect} from 'react';
import {setNewNotification} from '../../../redux/slices/authSlice';

const NotificationScreen = ({navigation}) => {
  const userData = useAppSelector(state => state.auth.user);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setNewNotification(false));
  }, []);

  const {loading, data, setData, refreshData, loadMore, Placeholder, Loader} =
    useDataFactory('notificationsList', true, '', 'POST');

  const formattedTime = timestamp => {
    const duration = moment.duration(moment().diff(moment(timestamp)));
    if (duration.asMinutes() < 60)
      return `${Math.floor(duration.asMinutes())}m ago`;
    if (duration.asHours() < 24)
      return `${Math.floor(duration.asHours())}h ago`;
    return `${Math.floor(duration.asDays())}d ago`;
  };

  const handleAction = (requestId, status, notificationId, itemData) => {
    dispatch(
      accept_decline_request({
        requestId,
        status: status.toString(),
        notificationId,
      }),
    ).then(res => {
      if (accept_decline_request.fulfilled.match(res)) {
        setData(prev => prev.filter(item => item.requestId !== requestId));
        if (status === 1) {
          navigation.navigate('MatchScreen', {
            itemData: itemData.fromUserDetail,
            screen: 'Notification',
            requestId: itemData.requestId,
            setData,
          });
        }
      }
    });
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      disabled={item?.isTakeAction !== 1 || item?.type === 'meeting'}
      onPress={() => {
        if (item?.startConversation?.includes(userData?.cognitoUserId)) {
          navigation.navigate('Inbox');
        } else {
          navigation.navigate('MatchScreen', {
            itemData: item?.fromUserDetail,
            screen: 'Notification',
            requestId: item?.requestId,
            setData,
          });
        }
      }}
      style={styles.newFlatlist}>
      <View style={styles.ImageView}>
        <GImage
          image={item?.fromUserDetail?.profilePic}
          style={styles.ProfilePic}
        />
      </View>
      <View style={styles.textViewNew}>
        <Text style={styles.Content}>{item?.message}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.Timing}>{formattedTime(item?.createdAt)}</Text>
          {item?.type === 'connect' && item?.isTakeAction === 0 && (
            <View style={styles.actionButtons}>
              <GradientButton
                gradientColor={['#DA7575', '#A45EB0']}
                title="Accept"
                gradientstyle={{
                  height: scaledValue(30),
                }}
                textstyle={{
                  fontSize: scaledValue(14),
                  letterSpacing: scaledValue(14 * -0.02),
                  marginHorizontal: scaledValue(20),
                }}
                onPress={() => handleAction(item.requestId, 1, item._id, item)}
              />
              <GradientBorderButton
                title="Decline"
                inner={styles.innerStyle}
                buttonTextStyle={styles.buttonTextStyle}
                buttonStyle={styles.buttonStyle}
                onPress={() => handleAction(item.requestId, 2, item._id, item)}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const groupedData = {
    new: data.filter(item => moment(item.createdAt).isSame(moment(), 'week')),
    lastWeek: data.filter(item =>
      moment(item.createdAt).isSame(moment().subtract(1, 'week'), 'week'),
    ),
    earlier: data.filter(item =>
      moment(item.createdAt).isBefore(moment().subtract(1, 'week')),
    ),
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#A45EB0"
        barStyle="dark-content"
        translucent
      />
      <LinearGradient
        colors={['#A45EB0', '#A45EB0', '#DA7575']}
        style={[
          styles.headerContainer(statusBarHeight, SafeAreaInsetsContext.top),
          {height: insets.top + scaledValue(95)},
        ]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Image
              source={leftArrow}
              tintColor={colors.offWhite}
              style={styles.headerLeftArrowImage}
            />
          </TouchableOpacity>
          <GText medium text="Notifications" style={styles.mainHeader} />
        </View>
      </LinearGradient>
      <FlatList
        data={[1]}
        onEndReached={loadMore}
        ListFooterComponent={Loader}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refreshData} />
        }
        renderItem={() => (
          <>
            {!loading && data?.length < 1 ? (
              <View style={styles.emptyPlaceHolder}>
                <GText
                  text={'No Notifications yet!'}
                  style={{fontSize: scaledValue(20)}}
                />
              </View>
            ) : (
              <View style={styles.contentContainer}>
                {Object.entries(groupedData).map(([key, items]) =>
                  items.length > 0 ? (
                    <View key={key}>
                      <GText
                        beVietnamSemiBold
                        text={key.charAt(0).toUpperCase() + key.slice(1)}
                        style={styles.Header}
                      />
                      {items.map((item, index) => renderItem({item, index}))}
                      <View style={styles.lineView} />
                    </View>
                  ) : null,
                )}
              </View>
            )}
          </>
        )}
      />
      <Spinner
        color={colors.themeColor}
        visible={loading}
        overlayColor="transparent"
      />
    </View>
  );
};

export default NotificationScreen;
