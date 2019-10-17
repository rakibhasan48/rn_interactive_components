import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {string, number} from 'prop-types';
import TextComponent from '../Text/TextComponent';
import BoxShadow from '../Wrappers/BoxShadow';
import {fonts, colors} from '../styles/baseStyle';

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
  meter: {
    position: 'absolute',
    height: '120%',
    top: 15,
    left: 0,
    borderWidth: 1,
    borderColor: colors.red1,
  },
  utilizedLimitWrapper: {
    minWidth: '50%',
    paddingVertical: 15,
    justifyContent: 'center',
    paddingLeft: 10,
    alignItems: 'flex-start',
  },
  availableLimitWrapper: {
    minWidth: '50%',
    paddingVertical: 15,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: colors.secondary,
  },
  scale: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.colorSecondery,
    position: 'relative',
  },
  scaleMarks: {
    position: 'absolute',
    height: 12,
    top: 0,
    borderLeftWidth: 1,
    borderColor: colors.colorSecondery,
  },
});

const ProgressBar = ({
  title1,
  title2,
  utilizedLimit,
  totalLimit,
  budgetLimit,
}) => {
  const [utilizedWidth, setUtilizedWidth] = useState(0);
  const [limitWidth, setLimitWidth] = useState(new Animated.Value(0));
  const [translateX, setTranslateX] = useState(new Animated.Value(0));
  const [totalViewWidth, setTotalViewWidth] = useState(0);
  const [firstRender, setFirstRender] = useState(true);

  const animateWidth = toWidth => {
    Animated.timing(limitWidth, {
      toValue: toWidth,
      duration: 500,
    }).start();
  };

  const animateBudget = toWidth => {
    let widthTo = toWidth < totalViewWidth - 10 ? toWidth + 10 : toWidth;
    if (widthTo <= 0) {
      widthTo = 0;
    }
    Animated.timing(translateX, {
      toValue: widthTo,
      duration: 500,
    }).start(() => {
      setFirstRender(false);
    });
  };

  const calculateWidth = (total, utilized = utilizedLimit) => {
    if (utilized > totalLimit) {
      setUtilizedWidth(total);
      return total;
    }
    const utilizedPercent = parseInt((utilized * 100) / totalLimit, 10);

    const utilizedWidthValue = parseInt((total * utilizedPercent) / 100, 10);

    setUtilizedWidth(utilizedWidthValue);
    return utilizedWidthValue;
  };

  useEffect(() => {
    animateWidth(calculateWidth(totalViewWidth));
    if (firstRender) {
      animateBudget(calculateWidth(totalViewWidth, budgetLimit));
    }
  }, [utilizedLimit, totalViewWidth]);

  useEffect(() => {
    animateBudget(calculateWidth(totalViewWidth, budgetLimit));
  });

  const generateMarks = () => {
    const marks = [];
    let left = -1;
    const increment = totalViewWidth / 10;
    for (let i = 0; i <= 11; i++) {
      marks.push(<View key={i} style={[styles.scaleMarks, {left}]} />);
      left += increment;
    }

    return marks;
  };

  return (
    <View style={styles.rootContainer}>
      <BoxShadow>
        <View style={[styles.bar]}>
          <View
            style={styles.container}
            onLayout={event =>
              setTotalViewWidth(event.nativeEvent.layout.width)
            }>
            <Animated.View style={{...styles.overlay, width: limitWidth}}>
              <View style={[styles.overlay, styles.innerOverlay]} />
            </Animated.View>
            <Animated.View
              style={{
                ...styles.meter,
                transform: [{translateX}],
              }}
            />

            <View style={styles.utilizedLimitWrapper}>
              <TextComponent
                content={title1}
                color={colors.white}
                size={fonts.fs8}
                weight={fonts.medium}
              />
              <TextComponent
                content={utilizedLimit}
                color={colors.white}
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
                content={`${totalLimit - utilizedLimit}`}
                color={colors.black1}
                size={fonts.fs14}
                weight={fonts.medium}
              />
            </View>
          </View>
        </View>
      </BoxShadow>
      <View style={styles.scale}>{generateMarks()}</View>
    </View>
  );
};

ProgressBar.defaultProps = {
  title1: 'Utilized Limit',
  title2: 'Available Limit',
};

ProgressBar.propTypes = {
  title1: string,
  title2: string,
  utilizedLimit: number.isRequired,
  totalLimit: number.isRequired,
  budgetLimit: number.isRequired,
};

export default ProgressBar;
