import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {scaledValue} from '../../utils/design.utils';

const CustomRating = ({
  maxRating = 5,
  size = 30,
  onRatingChange,
  filledStar,
  unfilledStar,
  starContainerStyle,
  imageStyle,
  value,
  disabled,
}) => {
  const [rating, setRating] = useState(Number(value) || 0);

  const handleRatingPress = value => {
    setRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({length: maxRating}, (_, index) => (
        <TouchableOpacity
          disabled={disabled}
          key={index}
          onPress={() => handleRatingPress(index + 1)}
          style={[styles.starContainer, starContainerStyle]}>
          <Image
            source={rating >= index + 1 ? filledStar : unfilledStar}
            style={[
              {width: scaledValue(size), height: scaledValue(size)},
              imageStyle,
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starContainer: {},
});

export default CustomRating;
