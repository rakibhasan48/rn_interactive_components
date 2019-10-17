import React from 'react';
import {Text} from 'react-native';
import {string} from 'prop-types';

const TextComponent = ({content, color, size, weight}) => {
  return (
    <Text
      style={{
        color,
        fontFamily: weight,
        fontSize: size,
      }}>
      {content}
    </Text>
  );
};

TextComponent.propTypes = {
  content: string,
  color: string,
  size: string,
  weight: string,
};

export default TextComponent;
