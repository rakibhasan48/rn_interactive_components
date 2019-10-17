import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {string, func, number} from 'prop-types';
import TextComponent from '../Text/TextComponent';
import {colors} from '../styles/baseStyle';

const SimpleButton = ({buttonColor, buttonText, textColor, onPress}) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: buttonColor,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      borderRadius: 25,
      padding: 20,
    },
  });
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <TextComponent
        color={colors.white}
        content={buttonText}
        textColor={textColor}
      />
    </TouchableOpacity>
  );
};

SimpleButton.defaultProps = {
  buttonColor: colors.primary,
  textColor: colors.white,
  onPress: () => {},
};

SimpleButton.propTypes = {
  buttonColor: string,
  buttonText: string,
  onPress: func,
};

export default SimpleButton;
