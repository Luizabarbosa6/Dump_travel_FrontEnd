// src/navigation/BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/HomeScreen';
import TravelStack from './TravelStack';
import GalleryStack from './GalleryStack';
import MapScreen from './screens/MapScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = '';

            if (route.name === 'Home') iconName = 'log-out-outline';
            else if (route.name === 'Travel') iconName = 'airplane-outline';
            else if (route.name === 'Gallery') iconName = 'image-outline';
            else if (route.name === 'Map') iconName = 'location-outline';

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarStyle: route.name === 'Home' ? { display: 'none' } : {
            backgroundColor: '#fff',
            height: 60,
            borderTopWidth: 0,
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#003366',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Travel" component={TravelStack} />
        <Tab.Screen name="Gallery" component={GalleryStack} />

        <Tab.Screen name="Map" component={MapScreen} />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}
