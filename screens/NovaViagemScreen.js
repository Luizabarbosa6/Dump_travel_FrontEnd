import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://192.168.1.3:3000';

export default function NovaViagemScreen({ navigation }) {
    const [traveltitle, setTitulo] = useState('');
    const [travelanotation, setAnotacoes] = useState('');
    const [data, setData] = useState(new Date());
    const [mostrarPicker, setMostrarPicker] = useState(false);
    const [fotos, setFotos] = useState([]); // Muda para array de fotos
    const [localizacao, setLocalizacao] = useState(null);

    useEffect(() => {
        const obterLocalizacao = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Permissão de localização é necessária');
                return;
            }

            try {
                const loc = await Location.getCurrentPositionAsync({});
                setLocalizacao(loc.coords);
            } catch (error) {
                console.error("Erro ao obter localização:", error);
            }
        };

        obterLocalizacao();
    }, []);

    // Função para tirar foto
    const tirarFoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão para acessar a câmera foi negada!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setFotos([...fotos, result.assets[0]]);
        } else {
            console.warn("Captura de imagem cancelada ou falhou.");
        }
    };

    // Função para escolher da galeria
    const escolherDaGaleria = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== ImagePicker.PermissionStatus.GRANTED) {
            Alert.alert('Permissão negada');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            allowsEditing: true,
            // allowsMultipleSelection: true, // REMOVIDO porque não funciona no Android
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setFotos([...fotos, ...result.assets]); // Mesmo com uma imagem, result.assets funciona
        } else {
            console.warn("Seleção de imagens cancelada ou falhou.");
        }
    };


    const handleSubmit = async () => {
        if (!traveltitle || !travelanotation || fotos.length === 0 || !localizacao) {
            Alert.alert("Erro", "Preencha todos os campos e adicione pelo menos uma foto!");
            return;
        }

        const formData = new FormData();
        formData.append('traveltitle', traveltitle);
        formData.append('travelanotation', travelanotation);
        formData.append('data', data.toISOString());

        fotos.forEach((foto, index) => {
            formData.append('photos', {
                uri: foto.uri,
                name: `photo_${index}.jpg`,
                type: 'image/jpeg',
            });
        });

        formData.append('latitude', localizacao.latitude.toString());
        formData.append('longitude', localizacao.longitude.toString());

        try {
            const response = await fetch(`${API_URL}/travel`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Erro do servidor: ${errorData}`);
            }

            Alert.alert('Sucesso 🎉', 'Viagem salva com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error("Erro ao enviar:", error);
            Alert.alert('Erro ao salvar viagem 😿', error.message);
        }
    };

    return (
        <LinearGradient colors={['#001933', '#003366']} style={styles.container}>
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.innerContainer}>
                    <Text style={styles.header}>Adicionar Viagem</Text>

                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Adicione os Dados</Text>
                            <Ionicons name="map" size={20} color="#001933" />
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Título da Viagem"
                            placeholderTextColor="#ccc"
                            value={traveltitle}
                            onChangeText={setTitulo}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Anotações sobre a viagem"
                            placeholderTextColor="#ccc"
                            value={travelanotation}
                            onChangeText={setAnotacoes}
                        />

                        {/* Botões separados para tirar foto e escolher da galeria */}
                        <TouchableOpacity style={styles.input} onPress={tirarFoto}>
                            <Ionicons name="camera-outline" size={24} color="white" />
                            <Text style={styles.inputLabel}>Tirar Foto</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.input} onPress={escolherDaGaleria}>
                            <Ionicons name="image-outline" size={24} color="white" />
                            <Text style={styles.inputLabel}>Selecionar da Galeria</Text>
                        </TouchableOpacity>

                        {/* Preview de todas as fotos */}
                        <View style={styles.previewContainer}>
                            {fotos.map((foto, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: foto.uri }}
                                    style={styles.previewImage}
                                />
                            ))}
                        </View>

                        <TouchableOpacity onPress={() => setMostrarPicker(true)} style={styles.input}>
                            <Ionicons name="calendar-outline" size={24} color="white" />
                            <Text style={styles.inputLabel}>
                                {format(data, 'dd/MM/yyyy')}
                            </Text>
                        </TouchableOpacity>

                        {mostrarPicker && (
                            <DateTimePicker
                                value={data}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setMostrarPicker(false);
                                    if (selectedDate) setData(selectedDate);
                                }}
                            />
                        )}

                        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                            <Text style={styles.saveButtonText}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButtonContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
    innerContainer: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        fontSize: 24,
        color: 'white',
        fontStyle: 'italic',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 30,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#001933',
    },
    input: {
        backgroundColor: '#001933',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        color: 'white',
    },
    inputLabel: {
        color: 'white',
        marginLeft: 10,
    },
    previewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#001933',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
