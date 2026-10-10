import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export type SensorData = {
  temperature: number;
  soilHumidity: number;
  uvIndex: number;
  color?: {
    light?: number;
    red?: number;
    green?: number;
    blue?: number;
  };
  timestamp?: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');
const SESSION_KEY = 'growtech-session-token';
let webSessionToken: string | null = null;

const apiUrl = () => {
  if (!API_URL) {
    throw new Error('Configura EXPO_PUBLIC_API_URL con la dirección de tu backend.');
  }
  return API_URL;
};

const readResponse = async (response: Response) => {
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof body === 'object' &&
      body !== null &&
      'error' in body &&
      typeof body.error === 'string'
        ? body.error
        : `Error del servidor (${response.status}).`;
    throw new Error(message);
  }
  if (typeof body !== 'object' || body === null) {
    throw new Error('El servidor devolvió una respuesta inválida.');
  }
  return body as Record<string, unknown>;
};

export const authenticate = async (
  mode: 'login' | 'register',
  email: string,
  password: string
) => {
  const response = await fetch(`${apiUrl()}/api/auth/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await readResponse(response);
  if (typeof body.token !== 'string') {
    throw new Error('El servidor no devolvió una sesión válida.');
  }
  if (Platform.OS === 'web') {
    webSessionToken = body.token;
  } else {
    await SecureStore.setItemAsync(SESSION_KEY, body.token);
  }
};

export const clearSession = async () => {
  if (Platform.OS === 'web') {
    webSessionToken = null;
    return;
  }
  await SecureStore.deleteItemAsync(SESSION_KEY);
};

export const getLatestSensorData = async (): Promise<SensorData> => {
  const token = Platform.OS === 'web'
    ? webSessionToken
    : await SecureStore.getItemAsync(SESSION_KEY);
  if (!token) {
    throw new Error('Inicia sesión para consultar los datos del sensor.');
  }

  const response = await fetch(`${apiUrl()}/api/sensors/current`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  const body = await readResponse(response);
  if (body.success !== true || typeof body.data !== 'object' || body.data === null) {
    throw new Error('El servidor no devolvió lecturas válidas.');
  }
  return body.data as SensorData;
};
