import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Svg, { Text as SvgText } from 'react-native-svg';

export default function App() {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getLocation();
          } else {
            console.warn('Location permission denied');
          }
        } else {
          getLocation();
        }
      } catch (err) {
        console.warn(err);
      }
    };

    const getLocation = () => {
      const watchId = Geolocation.watchPosition(
        (position) => {
          const newSpeed = position.coords.speed || 0;
          setSpeed(newSpeed);
        },
        (error) => {
          console.warn(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0.5, // Update speed when the user has moved 10 meters
        }
      );

      return () => {
        Geolocation.clearWatch(watchId);
      };
    };

    requestLocationPermission();

    return () => {
      Geolocation.stopObserving();
    };
  }, []);

  return (
    <View style={styles.container}>
      <DigitalPanel value={(speed * 3.6).toFixed(0)} />
      {/* You can add other components or UI elements as needed */}
    </View>
  );
}

const DigitalPanel = ({ value }) => {
  return (
    <View style={styles.digitalPanel}>
    <Svg height="100%" width="100%">
      <SvgText
        x="50%"
        y="50%"
        fontSize="200"
        textAnchor="middle"
        fill="white"
        fontFamily="Arial"
      >
        {value}
      </SvgText>
      {/* Adding Kmph text below the value */}
      <SvgText
        x="50%"
        y="70%"  
        fontSize="50"
        textAnchor="middle"
        fill="white"
        fontFamily="Arial"
      >
        Kmph
      </SvgText>
    </Svg>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  digitalPanel: {
    width: '90%',
    height: "50%",
    backgroundColor: '#333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  liveSpeedContainer: {
    marginBottom: 20,
  },
  speedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'blue',
  },
});
