import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const plants = [
  {
    id: 'alocasia',
    name: 'Alocasia Portora',
    description: 'Tropical de hojas grandes. Sensible al frío.',
    idealConditions: {
      temperature: { min: 18, max: 27 }, // °C
      soilHumidity: { min: 60, max: 80 }, // %
      uvIndex: { max: 6 }, // Índice UV
      light: { min: 5000, max: 15000 }, // lux (luz brillante indirecta)
      color: { red: 80, green: 120, blue: 60 } // RGB
    }
  },
  {
    id: 'potus',
    name: 'Potus',
    description: 'Resistente y adaptable. Perfecta para principiantes.',
    idealConditions: {
      temperature: { min: 15, max: 30 }, // °C
      soilHumidity: { min: 40, max: 70 }, // %
      uvIndex: { max: 8 }, 
      light: { min: 2000, max: 10000 }, // lux (sombra parcial a luz indirecta)
      color: { red: 70, green: 130, blue: 50 }
    }
  },
  {
    id: 'monstera',
    name: 'Monstera Deliciosa',
    description: 'Necesita espacio y humedad ambiental.',
    idealConditions: {
      temperature: { min: 20, max: 30 }, // °C
      soilHumidity: { min: 50, max: 70 }, // %
      uvIndex: { max: 7 },
      light: { min: 8000, max: 20000 }, // lux (luz filtrada brillante)
      color: { red: 90, green: 140, blue: 70 },
      airHumidity: { min: 60 } // %
    }
  },
  {
    id: 'chamadorea',
    name: 'Palmera Chamadorea',
    description: 'Palmera pequeña. Sensible al cloro en el agua.',
    idealConditions: {
      temperature: { min: 18, max: 25 }, // °C
      soilHumidity: { min: 50, max: 75 }, // %
      uvIndex: { max: 5 },
      light: { min: 3000, max: 8000 }, // lux (sombra luminosa)
      color: { red: 100, green: 150, blue: 80 },
      waterQuality: { maxChlorine: 0.5 } // ppm
    }
  },
  {
    id: 'ligustrina',
    name: 'Ligustrina',
    description: 'Arbusto resistente. Tolera podas frecuentes.',
    idealConditions: {
      temperature: { min: 10, max: 35 }, // °C (muy resistente)
      soilHumidity: { min: 30, max: 60 }, // %
      uvIndex: { max: 10 }, 
      light: { min: 10000, max: 30000 }, // lux (pleno sol a sombra parcial)
      color: { red: 60, green: 110, blue: 40 }
    }
  }
];

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'Monitor'>;
  };

const PlantSelectionScreen = ({ navigation }: Props) => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Elige tu planta</Text>
        
        <ScrollView contentContainerStyle={styles.plantsContainer}>
          {plants.map((plant) => (
            <TouchableOpacity
              key={plant.id}
              style={styles.plantCard}
              onPress={() => navigation.navigate('Monitor', { plant })}
            >
              <View style={styles.textContainer}>
                <Text style={styles.plantName}>{plant.name}</Text>
                <Text style={styles.plantDescription}>{plant.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#2e7d32" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  plantsContainer: {
    paddingBottom: 20,
  },
  plantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  plantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  plantName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  plantDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default PlantSelectionScreen;