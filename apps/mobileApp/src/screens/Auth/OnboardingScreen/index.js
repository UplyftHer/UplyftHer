import {ImageBackground, StatusBar, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

import {Images} from '../../../utils';
import GButton from '../../../components/GButton';
import {scaledValue} from '../../../utils/design.utils';
import {styles} from './styles';
import {colors} from '../../../../assets/colors';
import GText from '../../../components/GText';
import {useDispatch} from 'react-redux';
import {setOnBoarding} from '../../../redux/slices/authSlice';

const OnBoardingScreen = ({route}) => {
  const dispatch = useDispatch();

  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const swiperRef = useRef();
  const handleIndexChanged = newIndex => {
    setIndex(newIndex);
  };

  const pages = [
    {
      backgroundColor: '#FFF7FE',
      image: Images.onboardingImageOne,
      title: 'Welcome to Mentorship',
      subtitle:
        'Explore a platform for meaningful connections and personal growth through mentorship and guidance.',
      dotColor: colors.themeColor,
      buttonColor: colors.themeColor,
      buttonTitle: 'Next',
      height: 37,
      marginBottom: 35,
    },
    {
      backgroundColor: '#FFF7FE',
      image: Images.onboardingImageTwo,
      title: 'Discover Growth Here',
      subtitle:
        'Find opportunities for learning and development in a supportive community of mentors and mentees.',
      dotColor: colors.slightlyRed,
      buttonColor: colors.slightlyRed,
      buttonTitle: 'Next',
      height: 37,
      marginBottom: 35,
    },
    {
      backgroundColor: '#FFF7FE',
      image: Images.onboardingImageThree,
      title: 'Join Us Today',
      subtitle:
        'Become part of a dynamic mentorship community, fostering collaboration and empowerment for all members.',
      dotColor: colors.softOrange,
      buttonColor: colors.softOrange,
      buttonTitle: 'Get started',
      height: 49,
      marginBottom: 23,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent />
      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={false}
        onIndexChanged={handleIndexChanged}
        showsButtons={false}>
        {pages.map((item, index) => (
          <ImageBackground
            key={index}
            source={item?.image}
            style={styles.imageBackground}
          />
        ))}
      </Swiper>
      <View style={styles.cardView(insets)}>
        <GText medium style={styles.titleText} text={pages[index].title} />
        <GText
          beVietnamRegular
          style={styles.descriptions}
          text={pages[index].subtitle}
        />
        <GButton
          onPress={() => {
            if (index < pages.length - 1) {
              swiperRef.current.scrollBy(1);
            } else {
              dispatch(setOnBoarding(true));
            }
          }}
          title={pages[index].buttonTitle}
          style={styles.nextButton(pages[index])}
          textStyle={styles.nextButtonText(pages[index].buttonTitle)}
        />
        <View style={styles.dotsContainer}>
          {pages.map((_, dotIndex) => (
            <View
              key={dotIndex}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    dotIndex === index
                      ? pages[dotIndex].dotColor
                      : colors.lightGrayishOrange,
                  width:
                    dotIndex === index ? scaledValue(22.86) : scaledValue(10),
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default OnBoardingScreen;
