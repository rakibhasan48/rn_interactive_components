import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import ControlBubble from '../ControlBubble/ControlBubble';
import ProgressBar from '../ProgressBar/ProgressBar';
import ProgressSlider from '../ProgressBar/ProgressSlider';
import SimpleButton from '../Button/SimpleButton';

const Example = () => {
  const [limit, setLimit] = useState(10000);

  return (
    <View style={styles.container}>
      {/* <ControlBubble /> */}
      {/* <View style={styles.progressBarContainer}>
        <ProgressBar
          utilizedLimit={limit}
          totalLimit={50000}
          title1="Utilized"
          title2="Available"
        />
        <View style={styles.progressControl}>
          <SimpleButton
            buttonText="Increase"
            onPress={() => setLimit(limit + 5000)}
          />
          <SimpleButton
            buttonText="Decrease"
            onPress={() => setLimit(limit - 5000)}
          />
        </View>
      </View> */}
      <ProgressSlider limit={50000} initialUtilized={10000} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 20,
  },
  progressBarContainer: {},
  progressControl: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export default Example;
