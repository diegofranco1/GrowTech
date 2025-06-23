import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import PlantSelection from './screens/PlantSelection';
import MonitorScreen from './screens/MonitorScreen';
export type Plant = {
  id: string;
  name: string;
  description: string;
  image?: any;
  idealConditions?: {
    temperature: { min: number; max: number };
    soilHumidity: { min: number; max: number };
    uvIndex: { max: number };
  };
};

export type RootStackParamList = {
  Home: undefined;
  PlantSelection: undefined;
  Monitor: { plant: Plant }; 
};

// Tema personalizado
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
  },
};

// Configuración del header
const headerOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: '#2E86C1',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: 'white',
  headerTitleStyle: {
    fontWeight: '600',
    fontSize: 18,
  },
  headerBackTitleStyle: false,
  headerBackTitle: ' ',
};

const Stack = createStackNavigator<RootStackParamList>();

// Componente para el icono del header
const HeaderRightIcon = () => (
  <View style={{ marginRight: 15 }}>
    <Ionicons name="stats-chart" size={22} color="white" />
  </View>
);

export default function Navigation() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={headerOptions}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PlantSelection"
          component={PlantSelection}
          options={{ 
            title: '🌿 Elige tu planta',
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
          }}
        />

<Stack.Screen 
  name="Monitor" 
  component={MonitorScreen as React.FC} // Solución clave
  options={({ route }) => ({
    title: `🌱 ${route.params.plant.name}`,
    headerRight: () => <HeaderRightIcon />,
  })}
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}