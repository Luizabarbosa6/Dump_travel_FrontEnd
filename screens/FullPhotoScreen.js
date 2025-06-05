// src/screens/FullPhotoScreen.tsx
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function FullPhotoScreen({ route, navigation }) {
  const { photoUri } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
      <Image source={{ uri: photoUri }} style={styles.fullImage} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 8,
    borderRadius: 20,
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
  },
});
