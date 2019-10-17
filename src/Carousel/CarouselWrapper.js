import React, {useState, useEffect, useRef} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {node, bool, number} from 'prop-types';
import {colors} from '../styles/baseStyle';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

export const slideHeight = viewportHeight * 0.3;
const slideWidth = wp(70);
export const itemHorizontalMargin = wp(1);

export const sliderWidth = viewportWidth;
export const itemWidth = (slideWidth + itemHorizontalMargin * 2) / 1;

const styles = StyleSheet.create({
  activeDotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: colors.primary,
  },
  inactiveDotStyle: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 1,
  },
});

const CarouselWrapper = ({
  componentArray,
  isPagination,
  isMaxWidth,
  activeIndex,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const renderItem = ({item, index}) => <View>{item}</View>;

  const renderPagination = () => (
    <Pagination
      dotsLength={componentArray.length}
      activeDotIndex={activeTab}
      containerStyle={{}}
      dotStyle={styles.activeDotStyle}
      inactiveDotStyle={styles.inactiveDotStyle}
      inactiveDotOpacity={0.9}
      inactiveDotScale={0.7}
    />
  );

  const carouselRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      carouselRef.current.snapToItem(activeIndex);
    }, 500);
  }, []);

  return (
    <>
      <Carousel
        ref={carouselRef}
        data={componentArray}
        renderItem={renderItem}
        sliderWidth={sliderWidth}
        itemWidth={isMaxWidth ? viewportWidth - 30 : itemWidth}
        onSnapToItem={idx => setActiveTab(idx)}
      />
      {isPagination && renderPagination()}
    </>
  );
};

CarouselWrapper.defaultProps = {
  isPagination: false,
  isMaxWidth: false,
  activeIndex: 0,
};

CarouselWrapper.propTypes = {
  componentArray: node.isRequired,
  isPagination: bool,
  isMaxWidth: bool,
  activeIndex: number,
};

export default CarouselWrapper;
