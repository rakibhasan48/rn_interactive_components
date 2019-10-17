import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';

import * as shape from 'd3-shape';
import * as path from 'svg-path-properties';

import {scaleTime, scaleLinear, scaleQuantile} from 'd3-scale';
import {colors} from '../styles/baseStyle';
import TextComponent from '../Text/TextComponent';
import BoxShadow from '../Wrappers/BoxShadow';

const height = 100;
const width = Dimensions.get('window').width - 20;
const verticalPadding = 10;
const cursorRadius = 6;
const labelWidth = 100;

const d3 = {
  shape,
};

const data = [
  {x: new Date(2018, 9, 1), y: 0},
  {x: new Date(2018, 9, 16), y: 0},
  {x: new Date(2018, 9, 17), y: 200},
  {x: new Date(2018, 10, 1), y: 200},
  {x: new Date(2018, 10, 2), y: 300},
  {x: new Date(2018, 10, 5), y: 300},
  {x: new Date(2018, 10, 5), y: 300},
];

const scaleX = scaleTime()
  .domain([new Date(2018, 9, 1), new Date(2018, 10, 5)])
  .range([0, width - 10]);

const scaleY = scaleLinear()
  .domain([0, 300])
  .range([height - verticalPadding, verticalPadding]);

const scaleLabel = scaleQuantile()
  .domain([0, 300])
  .range([0, 200, 300]);

const line = d3.shape
  .line()
  .x(d => scaleX(d.x))
  .y(d => scaleY(d.y))
  .curve(d3.shape.curveBasis)(data);

const properties = path.svgPathProperties(line);
const lineLength = properties.getTotalLength();

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  graphContainer: {
    height,
    width,
    // marginHorizontal: 10,
    alignItems: 'center',
  },
  cursor: {
    width: cursorRadius * 2,
    height: cursorRadius * 2,
    borderRadius: cursorRadius,
    borderColor: colors.colorSecondery,
    borderWidth: 2,
    backgroundColor: colors.white1,
  },
  label: {
    position: 'absolute',
    top: -45,
    left: 0,
    // backgroundColor: 'lightgray',
    width: labelWidth,
  },
});

export class AccountGraph extends Component {
  state = {
    x: new Animated.Value(0),
  };

  cursor = React.createRef();

  label = React.createRef();

  moveCursor(value) {
    const {x, y} = properties.getPointAtLength(lineLength - value);
    this.cursor.current.setNativeProps({
      top: y - cursorRadius,
      left: x - cursorRadius,
    });
    const label = scaleLabel(scaleY.invert(y));
    this.label.current.setNativeProps({text: `${label} CHF`});
  }

  componentDidMount() {
    this.state.x.addListener(({value}) => this.moveCursor(value));
    this.moveCursor(0);
  }

  render() {
    const {x} = this.state;
    const translateX = x.interpolate({
      inputRange: [0, lineLength],
      outputRange: [width - labelWidth, 0],
      extrapolate: 'clamp',
    });

    return (
      <SafeAreaView style={styles.rootContainer}>
        <View style={styles.graphContainer}>
          <Svg {...{width, height}}>
            <Defs>
              <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="gradient">
                <Stop stopColor="#6cf8ff" offset="0%" />
                <Stop stopColor="#b5fbff" offset="20%" />
                <Stop stopColor="#FEFFFF" offset="100%" />
              </LinearGradient>
            </Defs>
            <Path
              d={line}
              fill="transparent"
              stroke={colors.colorSecondery}
              strokeWidth={5}
            />
            <Path
              d={`${line} L ${width - 10} ${height} L 0 ${height}`}
              fill="url(#gradient)"
            />
            <View ref={this.cursor} style={styles.cursor} />
          </Svg>
          <Animated.View style={[styles.label, {transform: [{translateX}]}]}>
            <View ref={this.label}>
              <BoxShadow>
                <TextComponent content="bla" />
              </BoxShadow>
            </View>
          </Animated.View>
          <Animated.ScrollView
            style={StyleSheet.absoluteFill}
            contentContainerStyle={{width: lineLength * 2}}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            bounces={false}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {x},
                  },
                },
              ],
              {useNativeDriver: true},
            )}
            horizontal
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default AccountGraph;
