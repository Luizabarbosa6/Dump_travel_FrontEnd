import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import BottomTabNavigator from './BottomTabNavigator';

export default function App() {
  return (
    <PaperProvider>
      <BottomTabNavigator />
    </PaperProvider>
  );
}
