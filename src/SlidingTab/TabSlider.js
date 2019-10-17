import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {string, func} from 'prop-types';

import TextComponent from '../Text/TextComponent';
import BoxShadow from '../Wrappers/BoxShadow';
import {fonts, colors} from '../styles/baseStyle';

const styles = StyleSheet.create({
  tabWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    width: '55%',
    height: '100%',
    top: 0,
    left: 0,
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  title: {
    minWidth: '50%',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Tab = ({title1, title2, setCurrentTab}) => {
  const [active, setActive] = useState(1);
  const [tab1XPosition, setTab1XPosition] = useState(0);
  const [tab2XPosition, setTab2XPosition] = useState(0);
  const [translateX, setTranslateX] = useState(new Animated.Value(0));

  const slideTab = (tabPosition, tabNo) => {
    Animated.timing(translateX, {
      toValue: tabNo === 2 ? tabPosition - 15 : tabPosition,
      duration: 250,
    }).start();
  };

  const onTab1Press = () => {
    setActive(1);
    setCurrentTab(1);
    slideTab(tab1XPosition, 1);
  };

  const onTab2Press = () => {
    setActive(2);
    setCurrentTab(2);
    slideTab(tab2XPosition, 2);
  };

  return (
    <BoxShadow>
      <View style={styles.tabWrapper}>
        <Animated.View style={{...styles.overlay, transform: [{translateX}]}} />

        <TouchableOpacity
          style={styles.title}
          onLayout={event => setTab1XPosition(event.nativeEvent.layout.x)}
          onPress={onTab1Press}>
          <TextComponent
            content={title1}
            weight={fonts.medium}
            size={fonts.fs14}
            color={active === 1 ? colors.white1 : colors.grey1}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.title}
          onLayout={event => setTab2XPosition(event.nativeEvent.layout.x)}
          onPress={onTab2Press}>
          <TextComponent
            content={title2}
            weight={fonts.medium}
            size={fonts.fs14}
            color={active === 2 ? colors.white1 : colors.grey1}
          />
        </TouchableOpacity>
      </View>
    </BoxShadow>
  );
};

Tab.propTypes = {
  title1: string,
  title2: string,
  setCurrentTab: func,
};

export default Tab;
