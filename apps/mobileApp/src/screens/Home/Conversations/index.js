import {
  ImageBackground,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import {Images} from '../../../utils';
import GText from '../../../components/GText';
import {scaledHeightValue, scaledValue} from '../../../utils/design.utils';
import GradientButton from '../../../components/GradientButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Conversations = ({navigation}) => {
  const data = [
    {recentMatchImage: Images.profileDummy},
    {recentMatchImage: Images.profileDummy},
    {recentMatchImage: Images.profileDummy},
    {recentMatchImage: Images.profileDummy},
    {recentMatchImage: Images.profileDummy},
    {recentMatchImage: Images.profileDummy},
    {recentMatchImage: Images.profileDummy},
    {recentMatchImage: Images.profileDummy},
  ];

  const newConvo = [
    {
      profileImage: Images.profileDummy,
      Name: 'Emma Clark',
      message: 'Emma accepted your connection request. Say hello 👋',
      timing: '09:18',
    },
    {
      profileImage: Images.profileDummy,
      Name: 'Emma Clark',
      message: 'Emma accepted your connection request. Say hello 👋',
      timing: '09:18',
    },
  ];
  const oldConvo = [
    {
      profileImage: Images.profileDummy,
      Name: 'Halima Rooman',
      message:
        'That totally makes sense! 💡 Have you tried approaching it from a different angle?',
      days: '2d ago',
    },
    {
      profileImage: Images.profileDummy,
      Name: 'Vanessa Paul',
      message: 'Haha, I’ve definitely been there too! 😅',
      days: '1w ago',
    },
    {
      profileImage: Images.profileDummy,
      Name: 'Selena Julia',
      message:
        'Exactly! 🎯 It’s all about taking small steps, and you’re already on the right track.',
      days: '1w ago',
    },
    {
      profileImage: Images.profileDummy,
      Name: 'Vanessa Paul',
      message: 'Haha, I’ve definitely been there too! 😅',
      days: '1w ago',
    },
    {
      profileImage: Images.profileDummy,
      Name: 'Selena Julia',
      message:
        'Exactly! 🎯 It’s all about taking small steps, and you’re already on the right track.',
      days: '1w ago',
    },
  ];

  const [visiblePassword, setVisiblePassword] = useState(false);
  const togglePasswordVisibility = () => {
    setVisiblePassword(!visiblePassword);
  };

  const insets = useSafeAreaInsets();
  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          marginLeft: index == 0 ? scaledValue(24) : scaledValue(12),
        }}>
        <Image source={item.recentMatchImage} style={styles.flatListImage} />
      </View>
    );
  };
  const renderNewConvo = ({item, index}) => {
    return (
      <TouchableOpacity
        // onPress={() => navigation.navigate('ChatScreen')}
        onPress={() => {
          navigation?.navigate('StackScreens', {
            screen: 'ChatScreen',
          });
        }}
        style={styles.newConvoFlatList}>
        <Image source={item.profileImage} style={styles.newConvoImage} />
        <View style={styles.textView}>
          <Text style={styles.nameStyle}>{item.Name}</Text>
          <Text numberOfLines={2} style={styles.messageStyle}>
            {item.message}
          </Text>
        </View>
        <View style={styles.timingView}>
          <View style={styles.newView}>
            <GradientButton
              gradientstyle={styles.gradientButton}
              textstyle={styles.buttonTextStyle}
              title={'New'}
            />
          </View>
          <Text style={styles.timingStyle}>{item.timing}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const renderOldConvo = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation?.navigate('StackScreens', {
            screen: 'ChatScreen',
          });
        }}
        style={styles.newConvoFlatList}>
        <Image source={item.profileImage} style={styles.newConvoImage} />
        <View style={styles.textView}>
          <Text style={styles.nameStyle}>{item.Name}</Text>
          <Text numberOfLines={2} style={styles.messageStyle}>
            {item.message}
          </Text>
        </View>
        <View style={styles.daysView}>
          <Text style={styles.daysStyle}>{item.days}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const {height, width} = Dimensions.get('window');
  const hasNotch = () => {
    const aspectRatio = height / width;

    return (
      Platform.OS === 'ios' &&
      (aspectRatio > 2 || height >= 812 || width >= 812) // iPhone X or later has an aspect ratio > 2
    );
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      /> */}
      <ImageBackground
        source={Images.gradientRect}
        resizeMode="cover"
        style={styles.imgBg}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            top:
              Platform.OS == 'ios'
                ? insets?.top + scaledValue(13)
                : insets.top > 50
                ? insets.top
                : insets.top + scaledValue(13),
            paddingHorizontal: scaledValue(20),
            zIndex: 1,
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              marginRight: scaledValue(59),
            }}>
            <Image
              source={Images.leftArrow}
              style={styles.leftArrowStyle(insets)}
            />
          </TouchableOpacity>

          <Text style={styles.headerText}>Conversations</Text>
        </View>
        <Image
          source={Images.whiteLines}
          style={[
            styles.whiteLines,
            {
              bottom:
                Platform.OS == 'ios' && insets.top > 50
                  ? -insets.bottom + scaledHeightValue(15)
                  : -insets.bottom + scaledHeightValue(26),
              marginTop: Platform.OS == 'android' && scaledValue(20),
            },
          ]}
        />

        <View
          style={{
            position: 'absolute',
            marginTop:
              Platform.OS == 'android'
                ? insets.top > 50
                  ? insets.top + scaledValue(65)
                  : insets.top + scaledValue(77)
                : insets.top + scaledValue(77),
          }}>
          <Text style={styles.subHeaderText}>Recent Matches</Text>
          <View style={{paddingTop: scaledHeightValue(14)}}>
            <FlatList
              data={data}
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
              horizontal
              style={{}}
            />
          </View>
        </View>
      </ImageBackground>
      <View
        style={[
          styles.containerView,
          {
            marginTop:
              Platform.OS == 'android'
                ? scaledValue(-40)
                : hasNotch()
                ? scaledValue(-25)
                : scaledValue(-50),
          },
        ]}>
        <ScrollView>
          <View style={styles.contentView}>
            <GText
              medium
              text="👋 New Conversation"
              style={styles.newConversationText}
            />
          </View>
          <View>
            <FlatList
              data={newConvo}
              renderItem={renderNewConvo}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <GText
            semiBold
            text="Older Conversations"
            style={styles.oldConvoText}
          />

          <FlatList
            data={oldConvo}
            renderItem={renderOldConvo}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default Conversations;
