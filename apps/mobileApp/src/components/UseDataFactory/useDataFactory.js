import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Dimensions, View} from 'react-native';
import {scaledValue} from '../../utils/design.utils';
import API from '../../services/API';

const useDataFactory = (
  type,
  paginate = false,
  bodyData = {},
  method = 'GET',
  route,
  url = '',
  headers,
) => {
  const EmptyPlaceholder = () =>
    !loading && (
      <View
        style={{
          flex: 1,
          height: Dimensions.get('window').height / 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <GText
          SemiBold
          text={'No Data Found'}
          style={{
            fontSize: scaledValue(25),
            color: colors.themeColor,
            textAlign: 'center',
          }}
        />
      </View>
    );

  const LoginRequiredPlaceholder = () => (
    <Placeholder subTitle="Oops! No data found in list." />
  );
  const internetPlaceholder = () => (
    <Placeholder subTitle="Oops! No Internet connection found." />
  );
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [loadNext, setLoadNext] = useState(true);
  const [body, setBody] = useState(bodyData);
  const [extraData, setExtraData] = useState({});
  const [pagination, setPagination] = useState({
    total: 10,
    current_page: 0,
  });

  const [loginRequired, setLoginRequired] = useState(false);
  const [internetFailed, setInternetFailed] = useState(false);

  const routes = {
    notificationsList: 'profile/getNotifications',
    recentMatchesList: 'profile/recentMatches',
    conversationList: 'profile/getOldConversations',
    chatList: 'profile/getChatSingleUser',
    upComingMeetingsList: 'profile/getUpcomingMeetings',
    searchUser: 'profile/searchUser',
    PastMeetingsList: 'profile/getPastMeetings',
    getSavedProfileData: 'profile/getSavedProfile',
    getMatchingProfiles: 'profile/getMatchingProfile',
    getUsersFeedBack: 'profile/getFeedbackDetails',
    getBlockedUsersList: 'profile/getBlockedUsers',
    searchCompany: 'auth/getOrganizations',
  };

  const Loader = () => (
    <View
      style={{
        width: Dimensions.get('window').width - scaledValue(40),
        paddingVertical: 10,
        alignItems: 'center',
      }}>
      {loadNext &&
        !internetFailed &&
        pagination.current_page != 0 &&
        data?.length != 0 && <ActivityIndicator size={'small'} />}
    </View>
  );

  const fetchData = () => {
    if (paginate) {
      if (!loadNext) {
        console.log('here 2');
        return;
      }
      API({
        route: routes[type],
        body: {...body, ...{offset: pagination.current_page}},
        method: method,
      }).then(response => {
        if (response.status === 26) {
          setInternetFailed(true);
          setLoading(false);
          return;
        } else {
          setInternetFailed(false);
        }

        if (response.status === 401) {
          setLoginRequired(true);
          setLoading(false);
          return;
        } else {
          setLoginRequired(false);
        }
        console.log('responseData=>>>', JSON.stringify(response?.data));

        setLoading(false);
        console.log('routes[type]', routes[type]);

        if (routes[type] === 'profile/getChatSingleUser') {
          setData([...data, ...response?.data?.data?.ChatList]);
          setExtraData(response?.data?.data?.profile);
        } else if (routes[type] === 'profile/getFeedbackDetails') {
          console.log('response123456', response?.data);

          setData([...data, ...response?.data?.feedback]);
          setExtraData(response?.data?.reviewCountRating);
        } else {
          setData([...data, ...response?.data?.data]);
        }

        setPagination({
          total: response?.total,
          current_page: pagination.current_page + 10,
        });

        if (
          (Array.isArray(
            response?.data?.data ||
              response?.data?.data?.ChatList ||
              response?.data?.feedback,
          ) &&
            response?.data?.data?.length < 10) ||
          response?.data?.data?.ChatList?.length < 10 ||
          response?.data?.feedback?.length < 10
        ) {
          setLoadNext(false);
        }
      });
    } else {
      API({
        route: routes[type],
        body: body,
        method: method,
        headers: headers,
      }).then(response => {
        if (response.status === 26) {
          setInternetFailed(true);
          setLoading(false);
          return;
        } else {
          setInternetFailed(false);
        }

        if (response.status === 401) {
          setLoginRequired(true);
          setLoading(false);
          return;
        } else {
          setLoginRequired(false);
        }

        setData(response.data);
        setLoading(false);
      });
    }
  };

  const loadMore = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const refreshData = (filters = {}) => {
    setBody(filters);
    setLoadNext(true);
    setPagination({
      total: 10,
      current_page: 0,
    });
    setData([]);
    setExtraData({});
    setLoading(true);
    setRefresh(!refresh);
  };

  return {
    loading: loading,
    Shimmer: LoadingShimmer,
    Placeholder: internetFailed
      ? internetPlaceholder
      : loginRequired
      ? LoginRequiredPlaceholder
      : EmptyPlaceholder,
    data: data,
    setData: setData,
    loadMore: loadMore,
    pagination: pagination,
    refreshData: refreshData,
    internetFailed: internetFailed,
    Loader: Loader,
    extraData: extraData,
    setExtraData: setExtraData,
  };
};

export default useDataFactory;

const LoadingShimmer = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size={'small'} />
    </View>
  );
};

const Placeholder = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size={'small'} />
    </View>
  );
};
