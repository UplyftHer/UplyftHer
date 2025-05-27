import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Images} from '../../../../utils';
import GText from '../../../../components/GText';
import {styles} from './styles';
import {colors} from '../../../../../assets/colors';
import GradientButton from '../../../../components/GradientButton';
import {FlatList} from 'react-native-gesture-handler';
import {scaledHeightValue, scaledValue} from '../../../../utils/design.utils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppSelector} from '../../../../redux/store/storeUtils';
import {showToast} from '../../../../components/Toast';
import HeaderButton from '../../../../components/HeaderButton';

const SelectInterests = ({navigation, route}) => {
  const {fieldParams} = route?.params;
  const interestsList = useAppSelector(state => state.auth.interestsList);

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
          iconStyle={{
            width: scaledValue(40),
            height: scaledValue(40),
          }}
          style={{paddingHorizontal: scaledValue(20)}}
        />
      ),
      headerTitle: () => (
        <Text style={styles.headerText1}>
          Profile Setup <Text style={styles.headerText2}>(2 of 3)</Text>
        </Text>
      ),
    });
  };

  const insets = useSafeAreaInsets();
  const [selectedItems, setSelectedItems] = useState([]);
  const toggleSelectItem = item => {
    const isSelected = selectedItems.some(i => i.interestId === item._id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter(i => i.interestId !== item._id));
    } else {
      setSelectedItems([
        ...selectedItems,
        {interestId: item._id, name: item.name, icon: item?.icon},
      ]);
    }
  };

  const renderItem = ({item}) => {
    const isSelected = selectedItems.some(i => i.interestId === item._id);
    return (
      <TouchableOpacity
        onPress={() => toggleSelectItem(item)}
        style={[
          styles.flatListMain,
          isSelected && {backgroundColor: colors.themeColor},
        ]}>
        <Text style={[styles.flatListText, isSelected && {color: 'white'}]}>
          {item.name}
        </Text>
        {isSelected && (
          <TouchableOpacity onPress={() => toggleSelectItem(item)}>
            <Image source={Images.Cross} style={styles.crossIcon} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: scaledHeightValue(7),
            }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation?.goBack()}
              style={{position: 'absolute', left: scaledValue(20)}}>
              <Image
                source={Images.leftArrow}
                tintColor={colors.themeColor}
                style={{
                  width: scaledValue(40),
                  height: scaledValue(40),
                }}
              />
            </TouchableOpacity>
            <Text style={styles.headerText1}>
              Profile Setup <Text style={styles.headerText2}>(2 of 3)</Text>
            </Text>
          </View> */}
          {/* <Text style={styles.headerText1}>
            Profile Setup <Text style={styles.headerText2}>(2 of 3)</Text>
          </Text> */}
          <GText text="Select Interests" medium style={styles.basicInfoText} />
          <GText
            text={`Let others know what you are interested in`}
            beVietnamRegular
            style={styles.contentText}
          />
          <View>
            <FlatList
              data={interestsList}
              renderItem={renderItem}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
              contentContainerStyle={styles.flatListStyle}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View
            style={{
              marginTop: scaledValue(70),
              marginBottom: scaledValue(40),
            }}>
            <GradientButton
              title={'Next'}
              // disabled={selectedItems?.length > 0 ? false : true}
              style={styles.gradientButton}
              gradientstyle={styles.gradientStyle}
              textstyle={styles.textStyle}
              onPress={() => {
                if (selectedItems?.length < 3) {
                  showToast(0, 'Select at least three interests.');
                } else if (selectedItems?.length >= 3) {
                  navigation.navigate('AddBio', {
                    fieldParams: {
                      ...fieldParams,
                      ...{interests: selectedItems},
                    },
                  });
                }
              }}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default SelectInterests;
