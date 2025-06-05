import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#ffffff', '#ffffff', '#001933']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[0, 0.6, 1]} // Começa o azul logo abaixo do botão
      style={styles.container}
    >

      <View style={styles.topContainer}>
        <Image
          source={require('../assets/airplane.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>DumpTravel</Text>
        <Text style={styles.subtitle}>Guarde o mundo que você já viveu..</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Travel')}
      >
        <Text style={styles.buttonText}>Começar</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 70,
    alignItems: 'center',
  },
  topContainer: {
    alignItems: 'center',
    marginTop: -60,
  },
  logo: {
    width: 300,
    height: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#001933',
    marginTop: -30,
  },
  subtitle: {
    fontSize: 14,
    color: '#001933',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#001933',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 70,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
