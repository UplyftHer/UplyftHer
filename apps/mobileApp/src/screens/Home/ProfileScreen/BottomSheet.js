import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {colors} from '../../../../assets/colors';
import {scaledValue} from '../../../utils/design.utils';
import GText from '../../../components/GText';
import {styles} from './styles';
import {Images} from '../../../utils';

const BottomSheet = props => {
  return (
    <RBSheet
      ref={props.refRBSheet}
      draggable={true}
      onClose={() => {
        props?.setReduceImgSize(false);
      }}
      height={Dimensions.get('screen').height / 2.2}
      customStyles={{
        wrapper: {
          backgroundColor: 'transparent',
        },
        draggableIcon: {
          backgroundColor: colors.midGray,
          width: scaledValue(48),
        },
        container: {
          padding: 20,
          borderTopRightRadius: scaledValue(24),
          borderTopLeftRadius: scaledValue(24),
          backgroundColor: colors.offWhite,
        },
      }}
      customModalProps={{
        statusBarTranslucent: true,
      }}
      customAvoidingViewProps={{
        enabled: false,
      }}>
      <View style={styles.rbsheetContentView}>
        <GText medium text="About" style={styles.rbsheetHeader} />
        <GText
          beVietnamRegular
          text={props.aboutText}
          style={styles.rbsheetContent}
        />
      </View>
      {/* {props?.screen ? null : (
        <View
          style={{
            height: scaledValue(72),
            width: scaledValue(248),
            borderRadius: scaledValue(40),
            backgroundColor: colors.offWhite,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 10,
            shadowColor: '#75227726',
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.9,
            position: 'absolute',
            bottom: props?.insets?.bottom + scaledValue(27),
          }}>
          <View style={styles.rectView}>
            <View style={styles.rejectView}>
              <Image source={Images.rejectImage} style={styles.rejectImage} />
            </View>
            <TouchableOpacity
              onPress={() => {
                props.refRBSheet?.current?.close();
                setTimeout(() => {
                  props?.navigation.navigate('MatchScreen');
                }, 250);
              }}
              style={styles.acceptedView}>
              <Image source={Images.checkCircle} style={styles.acceptedImage} />
            </TouchableOpacity>
            <View style={styles.saveView}>
              <Image source={Images.bookmark} style={styles.saveImage} />
            </View>
          </View>
        </View>
      )} */}
    </RBSheet>
  );
};

export default BottomSheet;
