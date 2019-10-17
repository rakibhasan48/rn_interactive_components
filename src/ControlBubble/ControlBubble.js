import React, {Component} from 'react';
import {View, StyleSheet, Animated, PanResponder, Image} from 'react-native';
import {string, func} from 'prop-types';
import {getSwipeDirection, isTap, swipeDirections} from './detectSwipe';
import {fonts, colors} from '../styles/baseStyle';
import assets from '../assets';
import TextComponent from '../Text/TextComponent';

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 50,
    width: 62,
    height: 62,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: colors.primary,
  },
  arrowContainer: {
    position: 'relative',
  },
  arrow: {
    position: 'absolute',
  },
  arrowIcon: {
    width: 10,
    height: 10,
  },
  upArrow: {
    bottom: 13,
    left: 25,
  },
  leftArrow: {
    top: 22,
    right: 75,
    flexDirection: 'row',
  },
  rightArrow: {
    left: 70,
    top: 21,
    flexDirection: 'row',
  },
  downArrow: {
    left: 25,
  },
  verticalLabel: {
    marginLeft: -8,
    paddingVertical: 5,
    alignSelf: 'center',
  },
  horizontalLabel: {
    justifyContent: 'center',
    // paddingHorizontal: 5,
    marginTop: -2,
    marginRight: 5,
  },
});

const BUBBLE_SCALE_TO = 1.1;
const INDICATOR_SCALE_TO = 1.2;

class Control extends Component {
  state = {
    bubblePosition: new Animated.ValueXY(),
    bubbleScale: new Animated.Value(1),
    upArrowOpacity: new Animated.Value(0),
    downArrowOpacity: new Animated.Value(0),
    leftArrowOpacity: new Animated.Value(0),
    rightArrowOpacity: new Animated.Value(0),
    upArrowPosition: new Animated.Value(0),
    downArrowPosition: new Animated.Value(0),
    leftArrowPosition: new Animated.Value(0),
    rightArrowPosition: new Animated.Value(0),
    indicatorScale: new Animated.Value(1),
    indicatorScaleToValue: INDICATOR_SCALE_TO,
    scaleToValue: BUBBLE_SCALE_TO,
    firstTap: true,
  };

  setIndicatorVisibility = (direction, toValue = 1, duration = 150) => {
    const {SWIPE_LEFT, SWIPE_RIGHT, SWIPE_DOWN, SWIPE_UP} = swipeDirections;
    // console.warn(direction);
    switch (direction) {
      case SWIPE_LEFT:
        this.changeLeftArrowOpacity(toValue, duration);
        break;

      case SWIPE_RIGHT:
        this.changeRightArrowOpacity(toValue, duration);
        break;
      case SWIPE_UP:
        this.changeUpArrowOpacity(toValue, duration);
        break;
      case SWIPE_DOWN:
        this.changeDownArrowOpacity(toValue, duration);
        break;

      default:
        break;
    }
  };

  handleSwipe = direction => {
    const {SWIPE_LEFT, SWIPE_RIGHT, SWIPE_DOWN, SWIPE_UP} = swipeDirections;
    // console.warn(direction);
    const {onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown} = this.props;
    switch (direction) {
      case SWIPE_LEFT:
        onSwipeLeft();
        break;

      case SWIPE_RIGHT:
        onSwipeRight();
        break;
      case SWIPE_UP:
        onSwipeUp();
        break;
      case SWIPE_DOWN:
        onSwipeDown();
        break;

      default:
        break;
    }
  };

  scaleBubble = () => {
    const {scaleToValue, bubbleScale, firstTap} = this.state;

    let toScale = scaleToValue;

    if (firstTap) {
      toScale = BUBBLE_SCALE_TO;
    } else if (toScale > 1) {
      toScale = 1;
    } else {
      toScale = BUBBLE_SCALE_TO;
    }

    Animated.timing(bubbleScale, {
      toValue: toScale,
      friction: 3,
      duration: 150,
    }).start();

    let nextScaleValue = 1;
    if (firstTap) {
      nextScaleValue = BUBBLE_SCALE_TO;
    }
    if (!firstTap && scaleToValue === 1) {
      nextScaleValue = BUBBLE_SCALE_TO;
    }
    if (!firstTap && scaleToValue === BUBBLE_SCALE_TO) {
      nextScaleValue = 1;
    }
    this.setState({scaleToValue: nextScaleValue, firstTap: false});
  };

  changeUpArrowOpacity = (toValue, duration) => {
    const {upArrowOpacity} = this.state;
    Animated.timing(upArrowOpacity, {
      duration,
      toValue,
    }).start();
    // let nextOpacityValue = 0;
    // if (arrowOpacityToValue === 0) {
    //   nextOpacityValue = 1;
    // }
    // this.setState({ arrowOpacityToValue: nextOpacityValue });
  };

  changeDownArrowOpacity = (toValue, duration) => {
    const {downArrowOpacity} = this.state;
    Animated.timing(downArrowOpacity, {
      duration,
      toValue,
    }).start();
  };

  changeLeftArrowOpacity = (toValue, duration) => {
    const {leftArrowOpacity} = this.state;
    Animated.timing(leftArrowOpacity, {
      duration,
      toValue,
    }).start();
  };

  changeRightArrowOpacity = (toValue, duration) => {
    const {rightArrowOpacity} = this.state;
    Animated.timing(rightArrowOpacity, {
      duration,
      toValue,
    }).start();
  };

  scaleIndicator = () => {
    const {indicatorScale, indicatorScaleToValue} = this.state;

    Animated.timing(indicatorScale, {
      toValue: indicatorScaleToValue,
      friction: 3,
      duration: 200,
    }).start();

    let nextIndicatorScaleValue = 1;
    if (indicatorScaleToValue === 1) {
      nextIndicatorScaleValue = INDICATOR_SCALE_TO;
    }
    this.setState({indicatorScaleToValue: nextIndicatorScaleValue});
  };

  handleTap = () => {
    const {scaleToValue, firstTap} = this.state;

    let opacityTo = 1;

    if (!firstTap && scaleToValue > 1) {
      opacityTo = 0;
    }

    let opacityDuration = 80;

    if (opacityTo === 0) {
      opacityDuration = 150;
    }

    this.changeUpArrowOpacity(opacityTo, opacityDuration);
    this.changeDownArrowOpacity(opacityTo, opacityDuration);
    this.changeLeftArrowOpacity(opacityTo, opacityDuration);
    this.changeRightArrowOpacity(opacityTo, opacityDuration);

    this.scaleIndicator();
    this.scaleBubble();
  };

  onBubbleRelease = (e, gestureState) => {
    const direction = getSwipeDirection(gestureState);
    this.handleSwipe(direction);
    // this.setIndicatorVisibility(direction, 1);

    const {bubblePosition, scaleToValue} = this.state;

    if (direction === swipeDirections.TAP) {
      this.handleTap();
    } else {
      Animated.timing(bubblePosition, {
        toValue: 0,
        duration: 150,
      }).start();
      // setTimeout(() => {
      //   if (scaleToValue === 1) { this.setIndicatorVisibility(direction, 0, 350); }
      // }, 700);
    }

    bubblePosition.flattenOffset();
  };

  movementInit = (e, gestureState) => {
    const {bubblePosition} = this.state;
    bubblePosition.setOffset({
      x: bubblePosition.x._value,
      y: bubblePosition.y._value,
    });
    bubblePosition.setValue({x: 0, y: 0});
  };

  onBubbleMove = (e, gestureState) => {
    const {scaleToValue, firstTap} = this.state;
    const direction = getSwipeDirection(gestureState);
    this.setIndicatorVisibility(direction, 1, 150);
    setTimeout(() => {
      if ((!firstTap && scaleToValue === 1) || firstTap) {
        this.setIndicatorVisibility(direction, 0, 150);
      }
    }, 700);
    return Animated.event([
      null,
      {
        dx:
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
            ? this.state.bubblePosition.x
            : 0,
        dy:
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
            ? this.state.bubblePosition.y
            : 0,
      },
    ])(e, gestureState);
  };

  handleShouldSetResponder = (e, gestureState) => {
    if (isTap(gestureState)) {
      return false;
    }
    if (e.nativeEvent.touches.length === 1) {
      return false;
    }
    return true;
  };

  movementController = PanResponder.create({
    onStartShouldSetPanResponder: this.handleShouldSetResponder,
    onMoveShouldSetPanResponder: this.handleShouldSetResponder,
    onStartShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: this.movementInit,
    onPanResponderMove: (e, gestureState) => this.onBubbleMove(e, gestureState),
    onPanResponderRelease: this.onBubbleRelease,
  });

  render() {
    const {
      bubblePosition,
      bubbleScale,
      scaleToValue,
      indicatorScale,
      upArrowOpacity,
      downArrowOpacity,
      leftArrowOpacity,
      rightArrowOpacity,
      firstTap,
    } = this.state;
    const {topLabel, bottomLabel, leftLabel, rightLabel} = this.props;

    const translateX = bubblePosition.x.interpolate({
      inputRange: [-10, 10],
      outputRange: [-10, 10],
      extrapolate: 'clamp',
    });
    const translateY = bubblePosition.y.interpolate({
      inputRange: [-10, 10],
      outputRange: [-10, 10],
      extrapolate: 'clamp',
    });

    const upOpacity = upArrowOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    const downOpacity = downArrowOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    const leftOpacity = leftArrowOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    const rightOpacity = rightArrowOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const transformStyle = {
      transform: [{translateX}, {translateY}, {scale: bubbleScale}],
    };

    const indicatorTransformStyle = {
      transform: [{scale: indicatorScale}],
    };

    return (
      <View style={styles.arrowContainer}>
        <Animated.View style={[{opacity: upOpacity}, indicatorTransformStyle]}>
          <View style={[styles.arrow, styles.upArrow]}>
            <TextComponent
              extraStyle={styles.verticalLabel}
              content={topLabel}
              size={fonts.fs10}
              color={colors.primary}
              weight={fonts.medium}
            />
            <Image style={styles.arrowIcon} source={assets.UpIndicator} />
          </View>
        </Animated.View>
        <Animated.View
          style={[{opacity: leftOpacity}, indicatorTransformStyle]}>
          <View style={[styles.arrow, styles.leftArrow]}>
            <TextComponent
              extraStyle={styles.horizontalLabel}
              content={leftLabel}
              size={fonts.fs10}
              color={colors.primary}
              weight={fonts.medium}
            />
            <Image style={styles.arrowIcon} source={assets.LeftIndicator} />
          </View>
        </Animated.View>
        <Animated.View
          style={[{opacity: rightOpacity}, indicatorTransformStyle]}>
          <View style={[styles.arrow, styles.rightArrow]}>
            <Image style={styles.arrowIcon} source={assets.RightIndicator} />
            <TextComponent
              extraStyle={styles.horizontalLabel}
              content={rightLabel}
              size={fonts.fs10}
              color={colors.primary}
              weight={fonts.medium}
            />
          </View>
        </Animated.View>
        <Animated.View
          style={[{opacity: downOpacity}, indicatorTransformStyle]}>
          <View
            style={[
              styles.arrow,
              styles.downArrow,
              {top: (!firstTap && scaleToValue === 1) || firstTap ? 80 : 67},
            ]}>
            <Image style={styles.arrowIcon} source={assets.DownIndicator} />
            <TextComponent
              extraStyle={styles.verticalLabel}
              content={bottomLabel}
              size={fonts.fs10}
              color={colors.primary}
              weight={fonts.medium}
            />
          </View>
        </Animated.View>

        <Animated.View
          // source={assets.ControlButton}
          {...this.movementController.panHandlers}
          style={[styles.bubble, transformStyle]}
        />
      </View>
    );
  }
}

Control.defaultProps = {
  topLabel: 'Up',
  bottomLabel: 'Down',
  leftLabel: 'Left',
  rightLabel: 'Right',
  onSwipeDown: () => {},
  onSwipeUp: () => {},
  onSwipeLeft: () => {},
  onSwipeRight: () => {},
};

Control.propTypes = {
  topLabel: string,
  bottomLabel: string,
  leftLabel: string,
  rightLabel: string,
  onSwipeDown: func,
  onSwipeUp: func,
  onSwipeLeft: func,
  onSwipeRight: func,
};

export default Control;
