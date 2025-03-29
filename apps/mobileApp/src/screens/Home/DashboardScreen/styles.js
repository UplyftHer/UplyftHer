import {StyleSheet} from 'react-native';
import {getFontSize, scaledValue} from '../../../utils/design.utils';
import {colors} from '../../../../assets/colors';
import fonts from '../../../utils/fonts';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.offWhite,
    flex: 1,
  },
  headerRightIconStyle: {
    width: scaledValue(48),
    height: scaledValue(48),
    marginRight: scaledValue(8),
  },

  headerLeftView: {
    marginLeft: scaledValue(20),
    width: scaledValue(102),
  },
  headerTextView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcons: {width: scaledValue(12), height: scaledValue(12)},
  bellIconStyle: {
    width: scaledValue(48),
    height: scaledValue(48),
    marginRight: scaledValue(20),
  },

  locationText: {
    fontSize: scaledValue(12),
    color: colors.themeColor,
    fontWeight: 700,
    lineHeight: scaledValue(15.6),
    paddingHorizontal: scaledValue(4),
  },
  headerText: {
    fontSize: scaledValue(28),
    fontFamily: fonts.SUSE_MEDIUM,
    color: colors.charcoal,
    lineHeight: scaledValue(33.6),
    letterSpacing: scaledValue(28 * -0.03),
  },

  upcomingText: {
    marginTop: scaledValue(32),
    marginBottom: scaledValue(10),
    marginHorizontal: scaledValue(20),
  },
  previouslyInteractedText: {
    marginBottom: scaledValue(12),
    marginTop: scaledValue(42),
  },
  userCardMainView: {marginBottom: scaledValue(0)},

  yourInterestsCardView: {
    marginLeft: scaledValue(20),
    marginBottom: scaledValue(47),
  },
  yourInterestsColumnWrapper: {flexDirection: 'row', flexWrap: 'wrap'},
  interestsCard: {
    marginRight: scaledValue(8),
    borderWidth: scaledValue(1),
    borderColor: colors.themeColor,
    borderRadius: scaledValue(8),
    paddingHorizontal: scaledValue(12),
    paddingVertical: scaledValue(8),
    marginBottom: scaledValue(16),
  },
  interestsTitle: {
    fontSize: getFontSize(16),
    color: colors.themeColor,
    lineHeight: getFontSize(19.2),
    letterSpacing: scaledValue(16 * -0.03),
  },
  peopleSimilarInterestText: {
    fontSize: scaledValue(14),
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
    marginBottom: scaledValue(22),
    color: colors.lightSlateGray,
    marginHorizontal: scaledValue(20),
  },
  similarText: {
    color: colors.themeColor,
    fontFamily: fonts.BE_VIETNAM_SEMIBOLD,
  },
  cardContainer: index => ({
    width: scaledValue(160),
    height: scaledValue(120),
    alignItems: 'center',
    borderRadius: scaledValue(16),
    marginLeft: index === 0 ? 20 : 0,
  }),
  gradient: {
    position: 'absolute',
    height: '50%',
    width: '100%',
    borderBottomLeftRadius: scaledValue(16),
    borderBottomRightRadius: scaledValue(16),
    bottom: 0,
    alignItems: 'center',
    overflow: 'hidden',
  },
  userImage: {
    borderRadius: scaledValue(16),
    width: scaledValue(160),
    height: scaledValue(120),
  },
  userDetailsView: {
    alignItems: 'center',
    position: 'absolute',
    bottom: scaledValue(13),
  },
  userName: {
    fontSize: scaledValue(14),
    color: colors.white,
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
  },
  age: {
    fontSize: scaledValue(14),
    color: colors.white,
    lineHeight: scaledValue(18.2),
    letterSpacing: scaledValue(14 * -0.02),
  },
  userLocation: {
    fontSize: scaledValue(12),
    color: colors.white,
    textTransform: 'uppercase',
    lineHeight: scaledValue(15.6),
    opacity: scaledValue(0.5),
  },
  labelView: {
    position: 'absolute',
    bottom: 0,
    paddingVertical: scaledValue(4),
    borderTopRightRadius: scaledValue(8),
    borderTopLeftRadius: scaledValue(8),
    width: scaledValue(80),
    alignItems: 'center',
  },
  labelText: {
    fontSize: scaledValue(11),
    lineHeight: scaledValue(14.3),
    color: colors.white,
  },
  circularView: {
    height: scaledValue(27.6),
    width: scaledValue(27.6),
    borderRadius: scaledValue(50),
    backgroundColor: colors.themeColor,
    position: 'absolute',
    top: scaledValue(8),
    right: scaledValue(7.4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saved: {
    height: scaledValue(13.8),
    width: scaledValue(13.8),
  },
  meetingEmptyPlaceHolderView: {
    marginHorizontal: scaledValue(20),
    backgroundColor: '#FFF4EC',
    paddingVertical: scaledValue(20),
    borderWidth: scaledValue(1.5),
    borderColor: '#FFF4EC80',
    borderRadius: scaledValue(16),
    shadowColor: '#473827',
    shadowOffset: {width: 10, height: 10},
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  emptyPlaceHolderText: {
    textAlign: 'center',
    fontSize: scaledValue(18),
    color: colors.charcoal,
  },
  emptyPlaceHolderDescription: {
    textAlign: 'center',
    fontSize: scaledValue(15),
    color: colors.charcoal,
    paddingHorizontal: scaledValue(40),
  },
  matchingProfileHeader: {
    marginBottom: scaledValue(0),
    marginTop: scaledValue(40),
  },
  loadingProfilesText: {
    textAlign: 'center',
    paddingVertical: scaledValue(25),
    fontSize: scaledValue(20),
  },
  userCardDetailStyle: {
    bottom: scaledValue(42),
  },
  matchingProfileEmptyPlaceHolder: {
    paddingHorizontal: scaledValue(20),
    gap: scaledValue(2),
    marginTop: scaledValue(12),
  },
  matchingEmptyPlaceHolderText: {
    textAlign: 'center',
    fontSize: scaledValue(18),
    color: colors.charcoal,
  },
  matchingEmptyPlaceHolderDescription: {
    textAlign: 'center',
    fontSize: scaledValue(15),
    color: colors.charcoal,
  },
  savedProfileView: {marginBottom: scaledValue(68)},
});
