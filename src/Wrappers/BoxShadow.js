import React from 'react';
import {View, StyleSheet} from 'react-native';
import {node, number} from 'prop-types';

const BoxShadow = ({children, borderRadius}) => {
  const styles = StyleSheet.create({
    boxShdaow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
      borderRadius,
    },
  });
  return <View style={styles.boxShdaow}>{children}</View>;
};

BoxShadow.defaultProps = {
  borderRadius: 14,
};
BoxShadow.propTypes = {
  children: node,
  borderRadius: number,
};

export default BoxShadow;
