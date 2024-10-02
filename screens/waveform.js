import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const WaveAnimation = ({ isRecording, audioLevel }) => {
  const animatedValue = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: audioLevel,
            duration: 250, // Increased duration
            useNativeDriver: false,
          }),
        ]),
      ).start();
    } else {
      animatedValue.setValue(0); // Reset when not recording
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, audioLevel]);

  return (
    <View style={styles.waveContainer}>
      <Animated.View style={[styles.wave, { height: animatedValue }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  waveContainer: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    // borderRadius: 32,
  },
  wave: {
    width: '100%',
    backgroundColor: '#90dacd', // Color for the wave
    borderRadius: 32,

  },
});

export default WaveAnimation;
