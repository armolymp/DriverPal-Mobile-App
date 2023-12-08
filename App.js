import * as React from 'react';
import {Navigation} from './Navigation';
import { StyleSheet } from "react-native";

const App = () => {
  return <Navigation />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
