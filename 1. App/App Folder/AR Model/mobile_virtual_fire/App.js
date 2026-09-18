import React from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ARFireScreen from './src/screens/ARFireScreen';

// Ignore transient network & connection warnings in mobile LogBox
LogBox.ignoreLogs([
  '[ConnectionManager]',
  'WebSocket',
  'Possible Unhandled Promise Rejection',
]);

export default function App() {
  return (
    <SafeAreaProvider>
      <ARFireScreen />
    </SafeAreaProvider>
  );
}
