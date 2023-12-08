import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { BASE_URL } from "./urlManager";

const Registration = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [backendFirstName, setBackendFirstName] = useState("");
  const [backendLastName, setBackendLastName] = useState("");
  const [backendEmail, setBackendEmail] = useState("");
  // Other state variables for backend data

  // useEffect(() => {
  //   // Fetch data from the backend and set the state variables
  //   // For example:
  //   // fetchUserDataFromBackend()
  //   //   .then(data => {
  //   //     setBackendFirstName(data.firstName);
  //   //     setBackendLastName(data.lastName);
  //   //     setBackendEmail(data.email);
  //   //     // Set other state variables with backend data
  //   //   })
  //   //   .catch(error => {
  //   //     console.error('Error fetching data from the backend', error);
  //   //   });
  // }, []);

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
    } else {
      fetch("http://192.168.1.194:5000/register", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fName: backendFirstName,
          lName: backendLastName,
          email: backendEmail,
          password: password,
        }),
      }).then(response => response.text()).then(data => {
        if (data === "S1000") {
          alert("Registration successful");
          navigation.navigate("Home");
          console.log("Registration successful");
        } else if (data === "E1000") alert("User already exist");
        else alert("Error please try again later!");
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Registration</Text>
      <TextInput
        label="First Name"
        value={backendFirstName}
        onChangeText={(text) => setBackendFirstName(text)}
        style={styles.input}
      />
      <TextInput
        label="Last Name"
        value={backendLastName}
        onChangeText={(text) => setBackendLastName(text)}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={backendEmail}
        onChangeText={(text) => setBackendEmail(text)}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="New Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        style={styles.input}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login here.</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  link: {
    marginTop: 16,
    color: "blue",
    textAlign: "center",
  },
});

export default Registration;
