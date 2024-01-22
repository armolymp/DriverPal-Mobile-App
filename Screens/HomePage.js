import React from "react";
import { Button, View, Text, TouchableOpacity, StyleSheet, ImageBackground} from "react-native";

export default function HomePage({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("DriverAssistant")}>
      <ImageBackground source={require('./Images/driver.png')} style={styles.backgroundImage}>
        <Text style={styles.buttonText}>Driver Assistant</Text>
      </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("LiveSpeed")}>
      <ImageBackground source={require('./Images/speed.png')} style={styles.backgroundImage}>
        <Text style={styles.buttonText}>Live Speed</Text>
      </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Settings")}>
      <ImageBackground source={require('./Images/settings.png')} style={styles.backgroundImage}>
        <Text style={styles.buttonText}>Settings</Text>
      </ImageBackground>
      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    flex: 1,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    margin: 5,
    // alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

