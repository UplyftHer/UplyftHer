import React, {useState, useEffect} from 'react';
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
// import {gChecked, gUnChecked} from '../../utils/images.utils';
// import GTextButton from '../GTextButton/GTextButton';
import GText from './GText';
import GTextButton from './GTextButton';

const SubLocations = props => {
  const refRBSheet = props.refRBSheet;
  const title = props.title || 'Choose';
  const options = props.options || [];
  const onChoose = props.onChoose || null;
  const value = props.value || [];
  // const [value, setValue] = useState('');
  const titleKey = props.titleKey || 'name';
  const idKey = props.idKey || '_id';
  const searchVisible = props.search ? true : false;
  const [optionsCount, setOptionsCount] = useState(20);
  const [search, setSearch] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  useEffect(() => {
    setFilteredOptions(options.filter(o => o[titleKey].includes(search)));
  }, [search, props]);
  return (
    <RBSheet
      ref={refRBSheet}
      height={500}
      closeOnDragDown={true}
      closeOnPressMask={true}
      onClose={() => setSearch('')}
      customStyles={{
        draggableIcon: {
          backgroundColor: '#ddd',
        },
        container: {
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
      }}>
      <ScrollView
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            setOptionsCount(optionsCount + 20);
          }
        }}
        scrollEventThrottle={400}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={{paddingVertical: 20, paddingHorizontal: 20}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <GText bold text={title} style={{}} />
            {value.length != 0 && (
              <GTextButton
                onPress={() => {
                  refRBSheet?.current?.close();
                }}
                title={'Done'}
                titleStyle={{
                  color: '#35689B',
                }}
              />
            )}
          </View>
          {searchVisible && (
            <TextInput
              placeholder="Search.."
              placeholderTextColor="rgba(106, 113, 135, 1)"
              style={{
                padding: 10,
                marginVertical: 5,
                fontSize: 13,
                color: '#171717',
                // fontFamily: 'OpenSans-Regular',
                borderRadius: 10,
                backgroundColor: '#eee',
              }}
              onChangeText={text => setSearch(text)}
            />
          )}
          {filteredOptions.length == [] && (
            <GText
              style={{
                textAlign: 'center',
                marginTop: 100,
              }}
              text={'No city available for selected country.'}
            />
          )}
          {filteredOptions.slice(0, optionsCount).map((c, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                // if (value.includes(c?.name)) {
                //   onChoose(value.filter(d => d != c?.name));
                //   // setValue(value.filter(d => d != c?.name));
                // } else {
                //   onChoose([...value, c?.name]);
                //   // setValue([...value, c?.name]);
                // }
                onChoose([c?.name]);
                // onChoose(c)
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Option title={c[titleKey]} />
                {/* {props.multiSelect == true ? (
                  value.includes(c?.name) ? (
                    <Image style={{height: 20, width: 20}} source={gChecked} />
                  ) : (
                    <Image
                      style={{height: 20, width: 20, tintColor: '#ddd'}}
                      source={gUnChecked}
                    />
                  )
                ) : null} */}
              </View>

              <View
                style={{
                  height: 1,
                  backgroundColor: '#ddd',
                  marginVertical: 5,
                }}></View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </RBSheet>
  );
};

export default SubLocations;

const Option = ({title}) => {
  return (
    <View
      style={{
        height: 60,
        alignContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <GText semiBold text={title} />
    </View>
  );
};
