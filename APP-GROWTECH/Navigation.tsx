import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import PlantSelection from './screens/PlantSelection';
import MonitorScreen from './screens/MonitorScreen';
import AuthScreen from './screens/AuthScreen';
import { colors } from './theme';
export type Plant = {
  id: string;
  name: string;
  description: string;
  idealConditions?: {
    temperature: { min: number; max: number };
    soilHumidity: { min: number; max: number };
    uvIndex: { max: number };
    light?: { min: number; max: number };
    color?: { red: number; green: number; blue: number };
    airHumidity?: { min: number };
    waterQuality?: { maxChlorine: number };
  };
};

export type RootStackParamList = {
  Home: undefined;
  Auth: undefined;
  PlantSelection: undefined;
  Monitor: { plant: Plant }; 
};

// Tema personalizado
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

// Configuración del header
const headerOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
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
          name="Auth"
          component={AuthScreen}
          options={{ title: 'Tu cuenta' }}
        />

        <Stack.Screen
          name="PlantSelection"
          component={PlantSelection}
          options={{ 
            title: 'Tus plantas',
          }}
        />

        <Stack.Screen 
          name="Monitor" 
          component={MonitorScreen}
          options={({ route }) => ({
            title: route.params.plant.name,
            headerRight: () => <HeaderRightIcon />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}