import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import {string, func, number} from 'prop-types';
import TextComponent from '../Text/TextComponent';
import BoxShadow from '../Wrappers/BoxShadow';
import {fonts, colors} from '../styles/baseStyle';
import assets from '../assets';

const styles = StyleSheet.create({
  rootContainer: {
    marginBottom: 40,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    height: '100%',
    top: 0,
    left: 0,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  innerOverlay: {
    width: '100%',
  },
  utilizedLimitWrapper: {
    position: 'absolute',
    left: '10%',
    minWidth: '50%',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  availableLimitWrapper: {
    minWidth: '50%',
    paddingVertical: 15,
    paddingRight: 10,
    marginLeft: '45%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: colors.secondary,
  },
  slider: {
    position: 'absolute',
    height: 60,
    top: 1,
    width: 35,
    // backgroundColor: colors.white,
    zIndex: 999,
  },
  sliderIcon: {
    height: 22,
    width: 22,
    backgroundColor: colors.primary,
    borderRadius: 50,
    marginBottom: 10,
  },
});

class ProgressSlider extends Component {
  constructor(props) {
    super(props);

    const {initialUtilized, limit} = props;
    const utilizedPercent = parseInt((initialUtilized * 100) / limit, 10);

    const viewWidth = Dimensions.get('window').width - 20;

    const utilizedWidthValue = parseInt(
      (viewWidth * utilizedPercent) / 100,
      10,
    );

    this.state = {
      limitWidth: new Animated.Value(0),
      translateX: new Animated.Value(0),
      sliderPosition: new Animated.ValueXY(),
      totalViewWidth: viewWidth,
      firstRender: true,
      utilizedLimit: initialUtilized,
      initialUtilizedWidth: utilizedWidthValue,
    };
    this.animateWidth(utilizedWidthValue, 150, true);
  }

  animateWidth = (toWidth, duration = 10, translatePos = false) => {
    const {limitWidth, translateX, totalViewWidth} = this.state;
    Animated.timing(limitWidth, {
      toValue: toWidth === totalViewWidth ? toWidth : toWidth - 20,
      duration,
    }).start();
    if (translatePos) {
      Animated.timing(translateX, {
        toValue: toWidth,
        duration: 10,
      }).start();
    }
  };

  calculateWidth = utilizedLimit => {
    const {limit} = this.props;
    const {totalViewWidth} = this.state;
    if (utilizedLimit >= limit) {
      return totalViewWidth;
    }
    const utilizedPercent = parseInt((utilizedLimit * 100) / limit, 10);

    const utilizedWidthValue = parseInt(
      (totalViewWidth * utilizedPercent) / 100,
      10,
    );
    return utilizedWidthValue;
  };

  setUtilizedLimit = amount => {
    this.setState({utilizedLimit: amount});
  };

  calculateLimit = e => {
    let newLimit = 0;
    const {limit} = this.props;
    const {pageX} = e.nativeEvent;
    if (pageX > 30) {
      const {totalViewWidth} = this.state;
      const unit = parseInt(limit / totalViewWidth, 10);
      const amountUnit = parseInt(Math.abs(pageX), 10);
      newLimit = amountUnit * unit;
      if (pageX < 5 || newLimit <= 0) {
        newLimit = 0;
      } else if (newLimit >= limit) {
        newLimit = limit;
      }
    }

    return newLimit;
  };

  onMoveSlider = (e, gestureState) => {
    const {sliderPosition} = this.state;
    const {onChange} = this.props;
    const newLimit = this.calculateLimit(e, gestureState);
    this.animateWidth(this.calculateWidth(newLimit), 1);
    this.setUtilizedLimit(newLimit);
    onChange(newLimit);
    return Animated.event([
      null,
      {
        dx: sliderPosition.x,
      },
    ])(e, gestureState);
  };

  movementInit = () => {
    const {sliderPosition} = this.state;
    sliderPosition.setOffset({
      x: sliderPosition.x._value,
    });
    sliderPosition.setValue({x: 0, y: 0});
    this.setState({firstRender: false});
  };

  onSliderRelease = () => {
    const {sliderPosition} = this.state;
    sliderPosition.flattenOffset();
  };

  handleShouldSetResponder = () => true;

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: this.handleShouldSetResponder,
    onMoveShouldSetPanResponder: this.handleShouldSetResponder,
    onPanResponderGrant: this.movementInit,
    onPanResponderMove: (e, gestureState) => this.onMoveSlider(e, gestureState),
    onPanResponderRelease: this.onSliderRelease,
    onPanResponderTerminate: () => {},
  });

  setTotalViewWidth = width => {
    this.setState({
      totalViewWidth: width,
    });
  };

  render() {
    const {title1, title2, limit} = this.props;
    const {
      limitWidth,
      sliderPosition,
      totalViewWidth,
      utilizedLimit,
      initialUtilizedWidth,
      firstRender,
    } = this.state;

    const range = [1, totalViewWidth - 30];

    if (firstRender) {
      sliderPosition.setValue({x: initialUtilizedWidth - 35});
    }

    const translateX = sliderPosition.x.interpolate({
      inputRange: range,
      outputRange: range,
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rootContainer}>
        <BoxShadow>
          <View style={[styles.bar]}>
            <View
              style={styles.container}
              onLayout={event =>
                this.setTotalViewWidth(event.nativeEvent.layout.width)
              }>
              <Animated.View style={{...styles.overlay, width: limitWidth}}>
                <View style={[styles.overlay, styles.innerOverlay]} />
              </Animated.View>
              <Animated.Image
                {...this.panResponder.panHandlers}
                style={{...styles.slider, transform: [{translateX}]}}
                source={assets.naruto}
              />
              {/* <Image
                style={styles.sliderIcon}
                  pointerEvents="none"
                /> */}
              {/* </Animated.View> */}

              <View style={styles.utilizedLimitWrapper}>
                <TextComponent
                  content={title1}
                  color={colors.white1}
                  size={fonts.fs8}
                  weight={fonts.medium}
                />
                <TextComponent
                  content={utilizedLimit}
                  color={colors.white1}
                  size={fonts.fs14}
                  weight={fonts.medium}
                />
              </View>

              <View style={styles.availableLimitWrapper}>
                <TextComponent
                  content={title2}
                  color={colors.black1}
                  size={fonts.fs8}
                  weight={fonts.medium}
                />
                <TextComponent
                  content={`${limit - utilizedLimit}`}
                  color={colors.black1}
                  size={fonts.fs14}
                  weight={fonts.medium}
                />
              </View>
            </View>
          </View>
        </BoxShadow>
      </View>
    );
  }
}

ProgressSlider.defaultProps = {
  title1: 'Utilized',
  title2: 'Left',
  initialUtilized: 0,
  onChange: () => {},
};

ProgressSlider.propTypes = {
  title1: string,
  title2: string,
  initialUtilized: number,
  limit: number.isRequired,
  onChange: func,
};

export default ProgressSlider;
