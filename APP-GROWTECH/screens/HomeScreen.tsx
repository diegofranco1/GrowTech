import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
export default function HomeScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('../assets/LogoGrowtech.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Todos los textos deben estar envueltos en <Text> */}
      <Text style={styles.subtitle}>Monitoreo inteligente para tu cultivo</Text>

      {/* Botón personalizado */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('PlantSelection')}
      >
        <Text style={styles.buttonText}>Comenzar</Text>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Desarrollado con ♥ para agricultores</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5fff5',  // Verde claro muy suave
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    logo: {
      width: 250,
      height: 250,
      marginBottom: 30,
      shadowColor: '#2e7d32',      // Sombra verde
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },
    subtitle: {
      fontSize: 18,
      color: '#2e7d32',            // Verde oscuro
      marginBottom: 40,
      textAlign: 'center',
      fontFamily: 'sans-serif-medium',
      lineHeight: 24,
      paddingHorizontal: 20,
    },
    button: {
      flexDirection: 'row',
      backgroundColor: '#2e7d32',   // Verde oscuro
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
      shadowColor: '#1b5e20',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
      marginRight: 10,
      letterSpacing: 0.5,
    },
    footer: {
      position: 'absolute',
      bottom: 30,
    },
    footerText: {
      color: '#689f38',            // Verde intermedio
      fontSize: 14,
      fontStyle: 'italic',
      textAlign: 'center',
    },
  });

