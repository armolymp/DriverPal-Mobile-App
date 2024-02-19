import React from 'react';
import { View, Button } from 'react-native';
import TTS from 'react-native-tts';

const TTSExample = () => {
  const handleButtonClick = () => {
    TTS.speak("Hello, I am a simple text-to-speech example.");
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Speak" onPress={handleButtonClick} />
    </View>
  );
};

export default TTSExample;
