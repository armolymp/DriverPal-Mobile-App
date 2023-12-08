import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Button, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export default function LiveSpeed({ navigation }) {
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
      <Text style={styles.speedText}>Current Speed: {(speed*3.6).toFixed(2)} Kmph</Text>
      {/* You can format the speed as per your requirement */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Change to your desired background color
  },
  speedText: {
    fontSize: 20, // Change to your desired font size
    fontWeight: 'bold', // You can adjust the font weight
    color: 'blue', // Change to your desired text color
  },
});

