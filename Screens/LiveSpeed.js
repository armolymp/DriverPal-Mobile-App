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
      <LiveSpeed speed={speed} />
      <DigitalPanel value={(speed * 3.6).toFixed(2)} />
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
          fontSize="40"
          textAnchor="middle"
          fill="white"
          fontFamily="Arial"
        >
          {value}
        </SvgText>
      </Svg>
    </View>
  );
};

const LiveSpeed = ({ speed }) => {
  return (
    <View style={styles.liveSpeedContainer}>
      <Text style={styles.speedText}>Current Speed: {(speed * 3.6).toFixed(2)} Kmph</Text>
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
    width: 100,
    height: 60,
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
