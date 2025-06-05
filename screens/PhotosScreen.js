import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function PhotosScreen({ route, navigation }) {
  const { albumName, photos: initialPhotos } = route.params;
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = 'http://192.168.1.3:3000';

  useEffect(() => {
    const carregarFotos = async () => {
      if (initialPhotos && initialPhotos.length > 0) {
        setPhotos(initialPhotos);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/travel`);
        const viagem = res.data.find(item => item.traveltitle === albumName);

        if (viagem) {
          const allPhotos = Array.isArray(viagem.photos)
            ? viagem.photos
            : viagem.photo
              ? [viagem.photo]
              : [];

          const cleanPaths = allPhotos.map((p) =>
            `${BASE_URL}/${p.replace(/\\/g, '/')}`
          );
          setPhotos(cleanPaths);
        }
      } catch (error) {
        console.error('Erro ao buscar fotos da viagem:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarFotos();
  }, [albumName]);

  if (loading) {
    return <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />;
  }

  return (
    <LinearGradient colors={['#001933', '#003366']} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>📍 {albumName}</Text>

      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('FullPhotoScreen', { photoUri: item })}
          >
            <Image source={{ uri: item }} style={styles.image} />
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 10,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 15,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    padding: 5,
    width: '45%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
});
