import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const API_URL = 'http://192.168.1.3:3000';

export default function MapScreen() {
  const [plantations, setPlantations] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/travel`);
        const data = await res.json();
        setPlantations(data);
        setLoading(false);

        if (data.length > 0 && mapRef.current) {
          const coordinates = data.map(p => ({
            latitude: Number(p.latitude),
            longitude: Number(p.longitude),
          }));

          if (coordinates.length === 1) {
            // Apenas 1 ponto — define região com zoom manual
            const { latitude, longitude } = coordinates[0];
            mapRef.current.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            },);
          } else {
            // Vários pontos — ajusta dinamicamente
            setTimeout(() => {
              mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
                animated: true,
              });
            },);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar plantações:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Localizações</Text>
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {plantations.map((p) => (
          <Marker
            key={p._id}
            coordinate={{
              latitude: Number(p.latitude),
              longitude: Number(p.longitude),
            }}
            title={p.traveltitle}
            description={p.travelanotation}
            pinColor="blue"
          />
        ))}
      </MapView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#003366',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 10,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  map: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
