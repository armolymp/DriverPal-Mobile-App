import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from "react-native";
import { BASE_URL } from "./urlManager";

const LoginScreen = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
  // Replace 'your_base_url' with your actual base URL
  fetch("http://192.168.1.194:5000/login", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email, // Make sure email and password are defined and populated
      password: password,
    }),
  })
    .then(response => response.text())
    .then(data => {
      if (data === "S1000") {
        setIsLoggedIn(true);
        // After successful login, reset the navigation stack
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        setIsLoggedIn(false);
        console.log("User not found");
      }
    })
    .catch(error => {
      console.error("Login error:", error);
      // Handle the error appropriately
    });
};


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={"black"}
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={"black"}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true} // To hide the password characters
      />
      <Button title="Login" onPress={navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })} />
      <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
        <Text style={styles.link}>Register Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    color:'black',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  link: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
  },
});

export default LoginScreen;
