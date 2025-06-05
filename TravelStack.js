// src/navigation/TravelStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TravelScreen from './screens/travelScreen';

import NovaViagemScreen from './screens/NovaViagemScreen';

const Stack = createNativeStackNavigator();

export default function TravelStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TravelMain" component={TravelScreen} />
      <Stack.Screen name="NovaViagem" component={NovaViagemScreen} />
    </Stack.Navigator>
  );
}
