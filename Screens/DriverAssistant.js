import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const DriverAssistant = () => {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://453a-2402-d000-a400-f586-d1a5-b62c-fce-755e.ngrok-free.app' }} // Replace with your desired URL
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the entire screen
  },
  webview: {
    flex: 1, // Take up the entire container
  },
});

export default DriverAssistant;
