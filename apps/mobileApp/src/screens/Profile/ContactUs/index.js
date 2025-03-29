import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {styles} from './styles';
import {Images} from '../../../utils';
import HeaderButton from '../../../components/HeaderButton';
import GText from '../../../components/GText';
import ContactOption from '../../../components/ContactOption';
import {colors} from '../../../../assets/colors';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import fonts from '../../../utils/fonts';
import Input from '../../../components/Input';
import GradientButton from '../../../components/GradientButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppDispatch} from '../../../redux/store/storeUtils';
import {contact_us} from '../../../redux/slices/profileSlice';
import OptionMenuSheet from '../../../components/OptionMenuSheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {showToast} from '../../../components/Toast';

const ContactUs = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [contactOption, setContactOption] = useState('general');
  const [selectTitle, setSelectTitle] = useState('General Enquiry');
  const refRBSheet = useRef();
  const [selectedSubmitRequest, setSelectedSubmitRequest] = useState({});
  const [selectedSubmitRequestTo, setSelectedSubmitRequestTo] = useState({});
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useAppDispatch();
  // const [selectedConfirmTerm, setSelectedConfirmTerm] = useState('');
  const [selectedConfirmTerms, setSelectedConfirmTerms] = useState([]);
  const toggleSelection = id => {
    setSelectedConfirmTerms(
      prevSelected =>
        prevSelected.includes(id)
          ? prevSelected.filter(item => item !== id) // Remove if already selected
          : [...prevSelected, id], // Add if not selected
    );
  };

  const [selectLaw, setSelectLaw] = useState('');
  // console.log('selectedSubmitRequest', selectedSubmitRequest?.name);

  const options = [
    {type: 'general', title: 'General Enquiry'},
    {type: 'feature', title: 'Feature Request'},

    {type: 'dsar', title: 'Data Subject Access Request'},
  ];
  const submitRequestToList = [
    {
      id: 1,
      name: 'Know what information is being collected from you',
    },
    {
      id: 2,
      name: 'Have your information deleted',
    },
    {
      id: 3,
      name: 'Opt-out of having your data sold to third-parties',
    },
    {
      id: 4,
      name: 'Opt-in to the sale of your personal data to third-parties',
    },

    {
      id: 10,
      name: 'Access your personal information',
    },
    {
      id: 5,
      name: 'Fix inaccurate information',
    },
    {
      id: 6,
      name: 'Receive a copy of your personal information',
    },
    {
      id: 7,
      name: 'Opt-out of having your data shared for cross-context behavioral advertising',
    },
    {
      id: 8,
      name: 'Limit the use and disclosure of your sensitive personal information',
    },
    {
      id: 9,
      name: 'Others (please specify in the comment box below)',
    },
  ];
  const submitRequestList = [
    {
      id: 1,
      name: 'The person, or the parent / guardian of the person, whose name appears above',
    },
    {
      id: 2,
      name: 'An agent authorized by the consumer to make this request on their behalf',
    },
  ];
  const confirmList = [
    {
      id: 1,
      name: 'Under penalty of perjury, I declare all the above information to be true and accurate.',
    },
    {
      id: 2,
      name: 'I understand that the deletion or restriction of my personal data is irreversible and may result in the termination of services with UplyftHer.',
    },
    {
      id: 3,
      name: 'I understand that I will be required to validate my request my email, and I may be contacted in order to complete the request.',
    },
  ];

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
        <GText text="Contact us" medium style={styles.headerTitleStyle} />
      ),
    });
  };

  const renderContactOption = (optionType, title) => (
    <ContactOption
      icon={
        contactOption === optionType
          ? Images.filledRadioButton
          : Images.radioButton
      }
      title={title}
      onPress={() => {
        {
          setContactOption(optionType);
          setSelectTitle(title);
        }
      }}
      titleStyle={{
        color: contactOption === optionType ? colors.themeColor : colors.black,
        fontSize: scaledValue(16),
        fontFamily:
          contactOption === optionType
            ? fonts.BE_VIETNAM_SEMIBOLD
            : fonts.BE_VIETNAM_REGULAR,

        letterSpacing: scaledValue(16 * -0.02),
      }}
    />
  );

  const contactUs = () => {
    const input = {
      type: selectTitle,
      subject: subject,
      message: message,
    };

    const requests = [
      {
        question: 'You are submitting this request as',
        answer: selectedSubmitRequest?.name,
        type: 'requestAs',
      },
      {
        question: 'Under the rights of which law are you making this request?',
        answer: selectLaw?.title,
        type: 'laws',
      },
      {
        question: 'You are submitting this request to',
        answer: selectedSubmitRequestTo?.name,
        type: 'requestTo',
      },
    ];

    const DSARinput = {
      type: selectTitle,
      message: message,
      requests: JSON.stringify(requests),
    };

    if (contactOption === 'dsar') {
      if (
        !selectedSubmitRequest?.name ||
        !selectedSubmitRequestTo?.name ||
        !selectLaw?.title
      ) {
        showToast(
          0,
          'Please select the relevant points to submit your request.',
        );
      } else {
        dispatch(contact_us(contactOption == 'dsar' ? DSARinput : input)).then(
          res => {
            if (contact_us.fulfilled.match(res)) {
              setSubject('');
              setMessage('');
              setSelectedSubmitRequest({});
              setSelectedSubmitRequestTo({});
            }
          },
        );
      }
    } else {
      dispatch(contact_us(contactOption == 'dsar' ? DSARinput : input)).then(
        res => {
          if (contact_us.fulfilled.match(res)) {
            setSubject('');
            setMessage('');
            setSelectedSubmitRequest({});
            setSelectedSubmitRequestTo({});
          }
        },
      );
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{flexGrow: 1, backgroundColor: '#FFF4EC'}}
      extraHeight={Platform.OS == 'ios' ? scaledValue(100) : ''}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <GText
              medium
              style={styles.headerText}
              text="We’d Love to Hear from You!"
            />

            <GText
              beVietnam
              style={[styles.subHeaderText, {textAlign: 'center'}]}
              text={
                "Questions or feedback?\n Reach out, and we'll get back to you soon!"
              }
            />

            <GText
              beVietnamMedium
              style={[styles.optionsHeading, {marginTop: scaledValue(51)}]}
              text={'Type of request'}
            />
            <View style={styles.contactOptionMainView}>
              {options.map(option =>
                renderContactOption(option.type, option.title),
              )}
            </View>
            {['general', 'feature']?.includes(contactOption) && (
              <>
                <Input
                  value={subject}
                  onChangeText={text => setSubject(text)}
                  placeholder={'Subject'}
                  placeholderTextColor={colors.darkPurple}
                  style={{
                    width: '100%',
                    backgroundColor: colors.offWhite,
                    marginTop: scaledValue(26),
                    borderColor: '#312943',
                  }}
                />
                {/* <GText text="*Required" style={{marginTop: scaledValue(20)}} /> */}
                <TextInput
                  value={message}
                  onChangeText={text => setMessage(text)}
                  multiline={true}
                  placeholder={'Your message (Required)'}
                  placeholderTextColor={colors.darkPurple}
                  style={[
                    styles.textInputStyle,
                    {marginTop: scaledValue(20), borderColor: '#312943'},
                  ]}
                />
                <GradientButton
                  onPress={contactUs}
                  title={'✉️   Submit Request'}
                  textstyle={styles.gradientButtonText}
                  style={[
                    ,
                    {
                      marginBottom: insets.bottom || scaledValue(20),
                      marginTop: scaledValue(40),
                    },
                  ]}
                />
              </>
            )}

            {contactOption == 'dsar' && (
              <>
                <GText
                  beVietnamMedium
                  style={[styles.optionsHeading, {marginTop: scaledValue(28)}]}
                  text={'You are submitting this request as'}
                />

                {submitRequestList?.map((item, index) => (
                  <TouchableOpacity
                    key={item?.id}
                    style={styles.submitRequestView(index, submitRequestList)}
                    onPress={() => setSelectedSubmitRequest(item)}>
                    <Image
                      source={
                        selectedSubmitRequest?.id == item?.id
                          ? Images.filledRadioButton
                          : Images.radioButton
                      }
                      style={styles.radioButton}
                    />
                    <GText
                      text={item?.name}
                      style={styles.submitRequestItemName(
                        selectedSubmitRequest?.id,
                        item,
                      )}
                    />
                  </TouchableOpacity>
                ))}
                <GText
                  medium
                  style={[styles.optionsHeading, {marginTop: scaledValue(40)}]}
                  text={
                    'Under the rights of which law are you\n making this request?'
                  }
                />
                <TouchableOpacity
                  onPress={() => {
                    refRBSheet?.current?.open();
                  }}
                  style={{
                    borderWidth: scaledValue(0.5),
                    borderColor: '#312943',
                    borderRadius: scaledValue(12),
                    height: scaledValue(48),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: scaledValue(16),
                    marginBottom: scaledValue(35),
                  }}>
                  <GText
                    beVietnamRegular
                    text={selectLaw?.title || 'Select One'}
                    style={{
                      fontSize: scaledValue(16),
                      lineHeight: scaledHeightValue(20.8),
                      letterSpacing: scaledValue(16 * -0.02),
                      color: selectLaw?.title ? colors.black : colors.Gray,
                    }}
                  />
                  <Image
                    source={Images.downArrow}
                    tintColor={'#000000'}
                    style={{width: scaledValue(20), height: scaledValue(20)}}
                  />
                </TouchableOpacity>
                {/* <Input
                  placeholder={'Select One'}
                  rightIcon={Images.downArrowBlack}
                  iconRightStyle={styles.iconRightStyle}
                  placeholderTextColor={colors.Gray}
                  style={{
                    width: '100%',
                    backgroundColor: colors.offWhite,
                    marginBottom: scaledValue(40),
                  }}
                /> */}

                <GText
                  medium
                  text="You are submitting this request to"
                  style={styles.submittingRequestToText}
                />

                {submitRequestToList?.map((item, index) => (
                  <TouchableOpacity
                    key={item?.id}
                    style={styles.submitRequestView(index, submitRequestToList)}
                    onPress={() => setSelectedSubmitRequestTo(item)}>
                    <Image
                      source={
                        selectedSubmitRequestTo?.id == item?.id
                          ? Images.filledRadioButton
                          : Images.radioButton
                      }
                      style={styles.radioButton}
                    />
                    <GText
                      beVietnamRegular
                      text={item?.name}
                      style={styles.submitRequestItemName(
                        selectedSubmitRequestTo?.id,
                        item,
                      )}
                    />
                  </TouchableOpacity>
                ))}
                <GText
                  medium
                  text="Please leave details regarding your action request or question"
                  style={[
                    styles.optionsHeading,
                    {marginTop: scaledValue(40), marginBottom: scaledValue(20)},
                  ]}
                />
                <TextInput
                  multiline={true}
                  value={message}
                  onChangeText={text => setMessage(text)}
                  placeholder={'Your message (Required)'}
                  placeholderTextColor={colors.darkPurple}
                  style={[
                    styles.textInputStyle,
                    {
                      marginTop: scaledValue(8),
                      marginBottom: scaledValue(36),
                      color: colors.darkPurple,
                      borderColor: '#312943',
                    },
                  ]}
                />
                <GText
                  medium
                  text="I Confirm that"
                  style={[
                    styles.optionsHeading,
                    {marginTop: 0, marginBottom: scaledValue(16)},
                  ]}
                />
                {confirmList?.map((item, index) => (
                  <TouchableOpacity
                    key={item?.id}
                    style={styles.submitRequestView(index, confirmList)}
                    // onPress={() => setSelectedConfirmTerm(item.id)}
                    onPress={() => toggleSelection(item.id)}>
                    <Image
                      source={
                        selectedConfirmTerms.includes(item.id)
                          ? Images.Check
                          : Images.UnCheck
                      }
                      style={styles.checkButton}
                    />
                    <GText
                      text={item?.name}
                      style={styles.submitRequestItemName(
                        selectedConfirmTerms.includes(item.id), // Pass boolean for styling
                        item,
                      )}
                    />
                  </TouchableOpacity>
                ))}
                <GradientButton
                  disabled={selectedConfirmTerms?.length < 3}
                  onPress={contactUs}
                  title={'✉️   Submit Request'}
                  textstyle={styles.gradientButtonText}
                  style={styles.gradientButton}
                />
              </>
            )}
          </ScrollView>
        </View>
      </View>
      <OptionMenuSheet
        refRBSheet={refRBSheet}
        title={'Select Law'}
        options={lawsList}
        onChoose={val => {
          setSelectLaw(val);
          refRBSheet.current.close();
        }}
        onPressCancel={() => refRBSheet.current.close()}
      />
    </KeyboardAwareScrollView>
  );
};

export default ContactUs;

const lawsList = [
  {
    id: 0,
    title: 'Personal laws',
    textColor: '#3E3E3E',
  },
  {
    id: 1,
    title: 'Labour',
    textColor: '#3E3E3E',
  },
];
