import React, {createContext, useContext} from 'react';
import useDataFactory from '../components/UseDataFactory/useDataFactory';

// Create a Context
const MatchingProfileContext = createContext();

export const MatchingProfileProvider = ({children}) => {
  const {
    loading: matchingProfileLoading,
    data: matchingProfileData,
    setData: setMatchingProfileData,
    refreshData: matchingProfileRefreshData,
    loadMore: matchingProfileLoadMore,
    Placeholder,
    Loader: matchingProfileLoader,
  } = useDataFactory(
    'getMatchingProfiles',
    true,
    {
      limit: 1000,
    },
    'POST',
  );

  return (
    <MatchingProfileContext.Provider
      value={{
        matchingProfileLoader,
        matchingProfileData,
        setMatchingProfileData,
        matchingProfileRefreshData,
        matchingProfileLoadMore,
        matchingProfileLoading,
      }}>
      {children}
    </MatchingProfileContext.Provider>
  );
};

export default () => useContext(MatchingProfileContext);
