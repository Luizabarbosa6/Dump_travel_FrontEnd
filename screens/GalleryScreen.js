import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function GalleryScreen({ navigation }) {
  const [albums, setAlbums] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get('http://192.168.1.3:3000/photos');

        const grouped = res.data.reduce((acc, item) => {
          const loc = item.location?.trim() || 'Desconhecida';
          acc[loc] = acc[loc] || [];

          if (item.photoUrl?.trim()) {
            acc[loc].push(item.photoUrl); // Usa diretamente o URL completo
          }

          return acc;
        }, {});

        setAlbums(grouped);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar fotos:', err);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />;

  return (
    <LinearGradient colors={['#001933', '#003366']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Galeria de Fotos</Text>

        {Object.entries(albums).map(([location, images]) => (
          <View key={location} style={styles.card}>
            <Image source={{ uri: images[0] }} style={styles.image} />

            <View style={styles.captionRow}>
              <Text style={styles.caption}>
                <Text style={styles.captionLabel}>Álbum:</Text> {location}
              </Text>
              <Ionicons name="image-outline" size={16} color="#003366" />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('PhotosScreen', {
                  albumName: location,
                  photos: images,
                })
              }
            >
              <Text style={styles.buttonText}>Ver todas as fotos</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 60,
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 10,
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  caption: {
    fontSize: 14,
    fontStyle: 'italic',
    marginRight: 4,
  },
  captionLabel: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#003366',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
