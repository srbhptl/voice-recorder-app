import React, { useState, useEffect } from 'react';
import { View, Text, PermissionsAndroid, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import WaveAnimation from './screens/waveform';

const audioRecorderPlayer = new AudioRecorderPlayer();

const App = () => {
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [uri, setUri] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone to record audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    };

    requestPermissions();
  }, []);

  const generateDynamicFileName = (baseFileName: string) => {
    return `${baseFileName}_${new Date().getTime()}.mp4`;
  };

  const startRecording = async () => {
    const path = Platform.OS === 'android'
      ? `${RNFS.DownloadDirectoryPath}/${generateDynamicFileName('myRecording')}`
      : `${RNFS.DocumentDirectoryPath}/${generateDynamicFileName('myRecording')}`;

    try {
      await audioRecorderPlayer.startRecorder(path);
      setRecording(true);
      setUri('');

      setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);

      console.log('Audio is recording...');
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setRecording(false);
      setUri(result);
      console.log('Recording stopped and saved at:', result);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const startPlaying = async () => {
    if (!uri) { return; }

    try {
      setPlaying(true);
      await audioRecorderPlayer.startPlayer(uri);

      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition === e.duration) {
          setPlaying(false);
          audioRecorderPlayer.removePlayBackListener();
        }
      });
    } catch (error) {
      console.error('Failed to start playing:', error);
    }
  };

  const stopPlaying = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      setPlaying(false);
      audioRecorderPlayer.removePlayBackListener();
    } catch (error) {
      console.error('Failed to stop playing:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WaveAnimation isRecording={recording} audioLevel={audioLevel} />
      <Text style={styles.title}>{recording ? 'Recording...' : 'Press to Record'}</Text>
      <TouchableOpacity
        style={[styles.button, recording ? styles.stopButton : styles.recordButton]}
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
      </TouchableOpacity>

      {uri ? (
        <>
          <Text style={styles.recordedText}>Recording Ready!</Text>
          <TouchableOpacity
            style={[styles.button, playing ? styles.stopButton : styles.playButton]}
            onPress={playing ? stopPlaying : startPlaying}
          >
            <Text style={styles.buttonText}>{playing ? 'Stop Playing' : 'Play Recording'}</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dd207a',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 5,
    width: 250,
  },
  recordButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  playButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordedText: {
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
  },
});

export default App;
