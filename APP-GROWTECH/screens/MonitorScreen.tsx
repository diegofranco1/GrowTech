import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RouteProp } from '@react-navigation/native';



type Plant = {
  id: string;
  name: string;
  idealConditions?: {
    temperature: { min: number; max: number };
    soilHumidity: { min: number; max: number };
    uvIndex: { max: number };
    color: { light:number,red: number, green: number, blue: number };  // Nueva propiedad para color
  };
};

type RootStackParamList = {
  Monitor: { plant: Plant };
};

type MonitorScreenProps = {
  route: RouteProp<RootStackParamList, 'Monitor'>;
  navigation: any; // Tipa esto adecuadamente si usas navegación
};

const API_URL = 'http://192.168.0.8:3000';
const API_KEY = 'diego1118';

const { width } = Dimensions.get('window');

const MonitorScreen = ({ route }: MonitorScreenProps) => {
  const { plant } = route.params;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  
  const fetchData = async () => {
    try {
      setRefreshing(true);
      setError(null);
  
      const response = await fetch(`${API_URL}/api/sensors/current`, {
        headers: {
          'x-api-key': API_KEY,
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const text = await response.text();
      let json;
      
      try {
        json = JSON.parse(text);
      } catch (e) {
        throw new Error('Invalid JSON response');
      }
  
      if (!json.success) {
        throw new Error(json.message || 'API request failed');
      }
  
      setData(json.data);
      checkConditions(json.data);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const checkConditions = (sensorData: any) => {
    if (!plant.idealConditions) return;
    
    const newAlerts: string[] = [];
    
    // Verificar temperatura
    if (sensorData.temperature < plant.idealConditions.temperature.min) {
      newAlerts.push(`Temperatura baja (Mín: ${plant.idealConditions.temperature.min}°C)`);
    } else if (sensorData.temperature > plant.idealConditions.temperature.max) {
      newAlerts.push(`Temperatura alta (Máx: ${plant.idealConditions.temperature.max}°C)`);
    }

    // Verificar humedad
    if (sensorData.soilHumidity < plant.idealConditions.soilHumidity.min) {
      newAlerts.push(`Humedad bajo el ${plant.idealConditions.soilHumidity.min}%. Tu planta está sedienta 🌿💧 ¡Riégala pronto!`);
    }

    // Verificar UV
    if (sensorData.uvIndex > plant.idealConditions.uvIndex.max) {
      newAlerts.push(`Índice UV alto (Máx: ${plant.idealConditions.uvIndex.max})`);
    }

    // Verificar color (RGB)
    if (
      sensorData.color.red !== plant.idealConditions.color.red ||
      sensorData.color.green !== plant.idealConditions.color.green ||
      sensorData.color.blue !== plant.idealConditions.color.blue
    ) {
     
    }

    setAlerts(newAlerts);
  };

  useEffect(() => {
    fetchData();
  }, [plant]); // Se ejecuta cuando cambia la planta

  if (loading) {
    return (
      <LinearGradient colors={['#f5f7fa', '#e0e6f5']} style={styles.gradientContainer}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#8e9dbd" />
          <Text style={styles.loaderText}>Cargando datos de {plant.name}...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#f5f7fa', '#e0e6f5']} style={styles.gradientContainer}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={40} color="#a3a8b8" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
    colors={['#f8f9fa', '#e8f5e9']}
    style={styles.gradientContainer}
  >
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchData}
          colors={['#4A90E2']}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>🌱 Monitoreo: {plant.name}</Text>
        <TouchableOpacity onPress={fetchData}>
          <Ionicons name="refresh" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {/* Alertas */}
      {alerts.length > 0 && (
        <View style={styles.alertContainer}>
          <Ionicons name="warning" size={20} color="#FF6B6B" style={styles.alertIcon} />
          <View>
            {alerts.map((alert, index) => (
              <Text key={index} style={styles.alertText}>{alert}</Text>
            ))}
          </View>
        </View>
      )}

      {/* Tarjetas de datos */}
      <View style={[styles.card, { borderLeftColor: '#FF6B6B' }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="thermometer" size={20} color="#FF6B6B" />
          <Text style={styles.cardTitle}>Temperatura</Text>
        </View>
        <Text style={styles.cardValue}>
          {data?.temperature} °C
          {plant.idealConditions?.temperature && (
            <Text style={styles.idealRange}>
              (Ideal: {plant.idealConditions.temperature.min}°C - {plant.idealConditions.temperature.max}°C)
            </Text>
          )}
        </Text>
      </View>

      {/* Humedad del suelo */}
<View style={[styles.card, { borderLeftColor: '#4A90E2' }]}>
<View style={styles.cardHeader}>
  <Ionicons name="water" size={20} color="#4A90E2" />
  <Text style={styles.cardTitle}>Humedad del suelo</Text>
</View>
<Text style={styles.cardValue}>
  {data?.soilHumidity} %
  {plant.idealConditions?.soilHumidity && (
    <Text style={styles.idealRange}>
      (Mín:{plant.idealConditions.soilHumidity.min}%)
    </Text>
  )}
</Text>
</View>

{/* Índice UV */}
<View style={[styles.card, { borderLeftColor: '#FFD700' }]}>
<View style={styles.cardHeader}>
  <Ionicons name="sunny" size={20} color="#FFD700" />
  <Text style={styles.cardTitle}>Índice UV</Text>
</View>
<Text style={styles.cardValue}>
  {data?.uvIndex}
  {plant.idealConditions?.uvIndex && (
    <Text style={styles.idealRange}>
      (Máx: {plant.idealConditions.uvIndex.max})
    </Text>
  )}
</Text>
</View>
{/* Nueva tarjeta de índice de luz */}
<View style={[styles.card, { borderLeftColor: '#FFD700' }]}>
  <View style={styles.cardHeader}>
    <Ionicons name="flashlight" size={20} color="#FFD700" />
    <Text style={styles.cardTitle}>Índice de Luz</Text>
  </View>
  <Text style={styles.cardValue}>
    {data?.color?.light} 
  </Text>
  {plant.idealConditions?.color.light && (
    <Text style={styles.idealRange}>
      Ideal: {plant.idealConditions.color.light} lux
    </Text>
  )}
</View>

<View style={styles.rgbContainer}>

  {/* Rojo */}
  <View style={[styles.colorBox, { backgroundColor: `rgba(${data.color?.red}, 0, 0, 0.7)` }]}>
    <Text style={styles.colorLabel}>Rojo</Text>
    <Text style={styles.colorValue}>{data.color?.red}</Text>
  </View>

  {/* Verde */}
  <View style={[styles.colorBox, { backgroundColor: `rgba(0, ${data.color?.green}, 0, 0.7)` }]}>
    <Text style={styles.colorLabel}>Verde</Text>
    <Text style={styles.colorValue}>{data.color?.green}</Text>
  </View>

  {/* Azul */}
  <View style={[styles.colorBox, { backgroundColor: `rgba(0, 0, ${data.color?.blue}, 0.7)` }]}>
    <Text style={styles.colorLabel}>Azul</Text>
    <Text style={styles.colorValue}>{data.color?.blue}</Text>
  </View>
</View>




    </ScrollView>
  </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#f5f7fa', // Fondo suave, similar a la imagen
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#34495E', // Un tono suave y elegante
    letterSpacing: 1, // Espaciado de letras para mayor claridad
  },
  refreshButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: '#e0e6f5', // Fondo azul suave para el botón
  },
  alertContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE', // Color de fondo suave para las alertas
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF6B6B', // Borde de alerta en rojo
    marginHorizontal: 16,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  alertIcon: {
    marginRight: 8,
  },
  alertText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
    color: '#34495E',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
  },
  idealRange: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 8,
    fontStyle: 'italic',
  },
  rgbContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  colorBox: {
    width: '32%',
    borderRadius: 8,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  colorValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionTitleContainer: {
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#34495E',
  },
  timestamp: {
    marginTop: 20,
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loaderText: {
    marginTop: 10,
    color: '#8e9dbd',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#D32F2F', // Color rojo para el error
    fontWeight: '500',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#4A90E2',  // Botón de "reintentar"
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});



export default MonitorScreen;
