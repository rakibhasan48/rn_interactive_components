export const swipeDirections = {
  SWIPE_UP: 'SWIPE_UP',
  SWIPE_DOWN: 'SWIPE_DOWN',
  SWIPE_LEFT: 'SWIPE_LEFT',
  SWIPE_RIGHT: 'SWIPE_RIGHT',
  TAP: 'TAP'
};

const swipeConfig = {
  velocityThreshold: 0.5,
  directionalOffsetThreshold: 60,
  gestureIsClickThreshold: 5
};

const isValidSwipe = (
  velocity,
  velocityThreshold,
  directionalOffset,
  directionalOffsetThreshold,
) => (
  Math.abs(velocity) > velocityThreshold
  && Math.abs(directionalOffset) < directionalOffsetThreshold
);

export const isTap = gestureState => (
  Math.abs(gestureState.dx) < swipeConfig.gestureIsClickThreshold
      && Math.abs(gestureState.dy) < swipeConfig.gestureIsClickThreshold
);

export const getSwipeDirection = (gestureState) => {
  const {
    SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN, TAP
  } = swipeDirections;
  const { dx, dy } = gestureState;
  if (isTap(gestureState)) {
    return TAP;
  }
  if (isValidHorizontalSwipe(gestureState)) {
    return dx > 0 ? SWIPE_RIGHT : SWIPE_LEFT;
  } if (isValidVerticalSwipe(gestureState)) {
    return dy > 0 ? SWIPE_DOWN : SWIPE_UP;
  }
  return null;
};

const isValidHorizontalSwipe = (gestureState) => {
  const { vx, dy } = gestureState;
  const { velocityThreshold, directionalOffsetThreshold } = swipeConfig;
  return isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
};

const isValidVerticalSwipe = (gestureState) => {
  const { vy, dx } = gestureState;
  const { velocityThreshold, directionalOffsetThreshold } = swipeConfig;
  return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
};
