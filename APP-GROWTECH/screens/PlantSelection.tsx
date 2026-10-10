import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Plant, RootStackParamList } from '../Navigation';
import { Alert, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { clearSession } from '../services/api';
import { colors, typography } from '../theme';

const plants: (Plant & { icon: React.ComponentProps<typeof Ionicons>['name'] })[] = [
  {
    id: 'alocasia',
    name: 'Alocasia Portora',
    description: 'Hojas imponentes, ambiente cálido y suelo húmedo.',
    icon: 'leaf-outline',
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
    description: 'Fácil de cuidar y feliz con luz indirecta.',
    icon: 'git-branch-outline',
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
    description: 'Luz suave, espacio para crecer y buena humedad.',
    icon: 'leaf-outline',
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
    description: 'Una palmera compacta que prefiere la sombra luminosa.',
    icon: 'flower-outline',
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
    description: 'Arbusto resistente que disfruta la luz abundante.',
    icon: 'sunny-outline',
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
  navigation: StackNavigationProp<RootStackParamList, 'PlantSelection'>;
  };

const PlantSelectionScreen = ({ navigation }: Props) => {
    const signOut = async () => {
      try {
        await clearSession();
        navigation.replace('Auth');
      } catch {
        Alert.alert('No se pudo cerrar sesión', 'Inténtalo de nuevo.');
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.heading}>
            <Text style={styles.eyebrow}>TU ESPACIO VERDE</Text>
            <Text style={styles.title}>¿A quién cuidamos hoy?</Text>
            <Text style={styles.subtitle}>Elige una planta para ver cómo se siente.</Text>
          </View>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={signOut}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
          >
            <Ionicons name="log-out-outline" size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={styles.plantsContainer}>
          {plants.map((plant) => (
            <TouchableOpacity
              key={plant.id}
              style={styles.plantCard}
              onPress={() => navigation.navigate('Monitor', { plant })}
              activeOpacity={0.82}
              accessibilityRole="button"
              accessibilityLabel={`Monitorear ${plant.name}`}
            >
              <View style={styles.plantIcon}>
                <Ionicons name={plant.icon} size={23} color={colors.primary} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.plantName}>{plant.name}</Text>
                <Text style={styles.plantDescription}>{plant.description}</Text>
              </View>
              <View style={styles.cardArrow}>
                <Ionicons name="arrow-forward" size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>
          ))}
          <View style={styles.tip}>
            <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.tipText}>Los datos se actualizan desde el sensor de tu cultivo.</Text>
          </View>
        </ScrollView>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 21,
    paddingTop: 22,
  },
  topBar: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heading: {
    flex: 1,
    paddingRight: 8,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '700',
    letterSpacing: -0.7,
    lineHeight: 32,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },
  signOutButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 13,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  plantsContainer: {
    paddingBottom: 28,
  },
  plantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 19,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 15,
    marginBottom: 11,
    minHeight: 91,
  },
  plantIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 15,
    height: 48,
    justifyContent: 'center',
    marginRight: 13,
    width: 48,
  },
  cardArrow: {
    alignItems: 'center',
    backgroundColor: '#F4F7F2',
    borderRadius: 12,
    height: 32,
    justifyContent: 'center',
    marginLeft: 8,
    width: 32,
  },
  textContainer: {
    flex: 1,
  },
  plantName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  plantDescription: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },
  tip: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 9,
    marginTop: 7,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  tipText: {
    color: colors.primaryDark,
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});

export default PlantSelectionScreen;