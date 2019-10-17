import React, {useEffect} from 'react';
import {Animated} from 'react-native';
import {number, any, node} from 'prop-types';

const AnimateOpacity = ({animateOnState, duration, children}) => {
  //set initial value of opacity to 0 i.e. not visible
  const opacity = new Animated.Value(0);

  //hook to listen to the state change of passed prop (animateOnState)
  //if the prop state is changed the animation will start
  useEffect(() => {
    Animated.timing(opacity, {
      duration,
      toValue: 1 /* gradually increase opacity from 0 to 1 i.e. invisible to visible */,
    }).start();
  }, [animateOnState]);

  return (
    <Animated.View
      style={{
        opacity: opacity.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        }),
      }}>
      {children}
    </Animated.View>
  );
};

AnimateOpacity.defaultProps = {
  duration: 350,
};

AnimateOpacity.propTypes = {
  animateOnState: any.isRequired,
  children: node.isRequired,
  duration: number,
};

export default AnimateOpacity;
