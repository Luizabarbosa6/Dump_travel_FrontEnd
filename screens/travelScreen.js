import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function TravelScreen({ navigation }) {
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = 'http://192.168.1.3:3000'; // Ajuste conforme necessário

 useEffect(() => {
  const fetchData = async () => {
    try {
      const [travelRes, photosRes] = await Promise.all([
        axios.get(`${BASE_URL}/travel`),
        axios.get(`${BASE_URL}/photos`)
      ]);

      const viagensComFotos = travelRes.data.map(viagem => {
        const fotosDaViagem = photosRes.data
          .filter(photo => photo.travelId === viagem._id)
          .map(photo => photo.photoUrl); // <- aqui o ajuste

        return {
          ...viagem,
          photos: fotosDaViagem,
        };
      });

      setViagens(viagensComFotos);
    } catch (error) {
      console.error('Erro ao buscar viagens ou fotos:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  
  const getPhotosFromViagem = (viagem) => {
  if (Array.isArray(viagem.photos) && viagem.photos.length > 0) {
    return viagem.photos;
  }
  if (viagem.photo) {
    // quando só tem uma foto única como string
    return [viagem.photo];
  }
  return [];
};


  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#fff"
        style={{ flex: 1, justifyContent: 'center' }}
      />
    );

  return (
    <LinearGradient colors={['#001933', '#003366']} style={styles.container}>
      <Text style={styles.headerTitle}>Minhas coleções</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('NovaViagem')}
      >
        <Text style={styles.addButtonText}>Adicionar Viagem</Text>
        <Ionicons name="add-circle" size={22} color="#001933" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
       {viagens.map((viagem, index) => {
  const photos = getPhotosFromViagem(viagem);
  const firstPhotoUri = photos.length > 0 ? photos[0] : null;
  const photosCount = photos.length;

  return (
    <View key={index} style={styles.card}>
      <Text style={styles.cardTitle}>
        {viagem.traveltitle}{' '}
        <Ionicons name="image" size={16} color="#001933" />
      </Text>

      <View style={styles.photoRow}>
        {firstPhotoUri ? (
          <Image
            source={{ uri: firstPhotoUri }}
            style={styles.imagePreview}
          />
        ) : (
          <View style={[styles.imagePreview, styles.placeholder]}>
            <Text style={styles.placeholderText}>Sem imagem</Text>
          </View>
        )}

        <View style={styles.photosCountContainer}>
          <Ionicons name="images" size={28} color="#001933" />
          <Text style={styles.photosCountText}>
            {photosCount} {photosCount === 1 ? 'foto' : 'fotos'}
          </Text>
        </View>
      </View>

      <Text style={styles.cardDate}>
        Data: {new Date(viagem.data).toLocaleDateString()}
      </Text>
      <Text style={styles.cardLocation}>
        <Ionicons name="location-sharp" size={14} color="red" />{' '}
        {viagem.travelanotation}
      </Text>
    </View>
  );
})}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#001933',
    marginRight: 8,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 16,
    color: '#001933',
    marginBottom: 12,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePreview: {
    width: 280,
    height: 180,
    borderRadius: 16,
    marginBottom: 12,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  placeholderText: {
    color: '#666',
    fontStyle: 'italic',
  },
  photosCountContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photosCountText: {
    marginTop: 6,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#001933',
  },
  cardDate: {
    color: '#001933',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 6,
  },
  cardLocation: {
    color: '#001933',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
