import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const AudioRecorder = () => {
  const audioRecorderPlayer = new AudioRecorderPlayer();
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [playbackPosition, setPlaybackPosition] = useState({ currentPositionSec: 0, currentDurationSec: 0 });
  const [audioFilePath, setAudioFilePath] = useState('');

  const onStartRecord = async () => {
    setRecording(true);
    const result = await audioRecorderPlayer.startRecorder();
    setAudioFilePath(result);
    audioRecorderPlayer.addRecordBackListener((e) => {
      setRecordSecs(e.currentPosition);
      return;
    });
    console.log(result);
  };

  const onStopRecord = async () => {
    setRecording(false);
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    console.log(result);
  };

  const onStartPlay = async () => {
    console.log('onStartPlay');
    if (audioFilePath) {
      setPlaying(true);
      const msg = await audioRecorderPlayer.startPlayer(audioFilePath);
      audioRecorderPlayer.addPlayBackListener((e) => {
        setPlaybackPosition({
          currentPositionSec: e.currentPosition,
          currentDurationSec: e.duration,
        });
        return;
      });
      console.log(msg);
    } else {
      console.log('No audio file to play');
    }
  };

  const onPausePlay = async () => {
    console.log('onPausePlay');
    await audioRecorderPlayer.pausePlayer();
    setPlaying(false);
  };

  const onStopPlay = async () => {
    console.log('onStopPlay');
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setPlaying(false);
  };

  const mmssss = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={{ padding: 20 }}>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? onStopRecord : onStartRecord}
      />
      <Text>Recording Time: {mmssss(Math.floor(recordSecs))}</Text>

      <Button
        title={playing ? "Pause" : "Play"}
        onPress={playing ? onPausePlay : onStartPlay}
        disabled={!audioFilePath || recording}
      />
      <Button
        title="Stop"
        onPress={onStopPlay}
        disabled={!playing}
      />
      <Text>
        {playing
          ? `Playing: ${mmssss(Math.floor(playbackPosition.currentPositionSec))} / ${mmssss(Math.floor(playbackPosition.currentDurationSec))}`
          : ''
        }
      </Text>
    </View>
  );
};

export default AudioRecorder;
