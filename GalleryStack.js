import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import GalleryScreen from './screens/GalleryScreen';
import PhotosScreen from './screens/PhotosScreen';
import FullPhotoScreen from './screens/FullPhotoScreen';

const Stack = createStackNavigator();  // ✅ OBRIGATÓRIO os parênteses!

export default function GalleryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GalleryScreen" component={GalleryScreen} />
      <Stack.Screen name="PhotosScreen" component={PhotosScreen} />
      <Stack.Screen name="FullPhotoScreen" component={FullPhotoScreen} />
    </Stack.Navigator>
  );
}
