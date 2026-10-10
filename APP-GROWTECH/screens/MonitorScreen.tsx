import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation';
import { clearSession, getLatestSensorData, SensorData } from '../services/api';
import { colors, typography } from '../theme';

type Props = StackScreenProps<RootStackParamList, 'Monitor'>;

const MonitorScreen = ({ route, navigation }: Props) => {
  const { plant } = route.params;
  const [data, setData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  const checkConditions = useCallback((sensorData: SensorData) => {
    const ideal = plant.idealConditions;
    if (!ideal) {
      setAlerts([]);
      return;
    }

    const newAlerts: string[] = [];
    if (sensorData.temperature < ideal.temperature.min) {
      newAlerts.push(`Hace frío para tu planta. Lo ideal es al menos ${ideal.temperature.min} °C.`);
    } else if (sensorData.temperature > ideal.temperature.max) {
      newAlerts.push(`La temperatura está alta. Lo ideal es hasta ${ideal.temperature.max} °C.`);
    }

    if (sensorData.soilHumidity < ideal.soilHumidity.min) {
      newAlerts.push(`El sustrato está seco. Para esta planta, lo ideal es desde ${ideal.soilHumidity.min} %.`);
    } else if (sensorData.soilHumidity > ideal.soilHumidity.max) {
      newAlerts.push(`El sustrato tiene mucha humedad. Lo ideal es hasta ${ideal.soilHumidity.max} %.`);
    }

    if (sensorData.uvIndex > ideal.uvIndex.max) {
      newAlerts.push(`La exposición UV es alta. El máximo recomendado es ${ideal.uvIndex.max}.`);
    }

    setAlerts(newAlerts);
  }, [plant.idealConditions]);

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      const sensorData = await getLatestSensorData();
      setData(sensorData);
      checkConditions(sensorData);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No pudimos cargar las lecturas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [checkConditions]);

  const signInAgain = async () => {
    try {
      await clearSession();
      navigation.replace('Auth');
    } catch {
      setError('No se pudo cerrar la sesión. Inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <LinearGradient colors={[colors.background, '#E8F1E5']} style={styles.fullScreen}>
        <View style={styles.stateContainer}>
          <View style={styles.stateIcon}>
            <Ionicons name="leaf-outline" size={26} color={colors.primary} />
          </View>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.stateTitle}>Conectando con tu cultivo</Text>
          <Text style={styles.stateDescription}>Estamos buscando las últimas lecturas del sensor.</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={[colors.background, '#E8F1E5']} style={styles.fullScreen}>
        <View style={styles.stateContainer}>
          <View style={[styles.stateIcon, styles.errorIcon]}>
            <Ionicons name="cloud-offline-outline" size={26} color={colors.danger} />
          </View>
          <Text style={styles.stateTitle}>No pudimos cargar los datos</Text>
          <Text style={styles.stateDescription}>{error}</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={fetchData} accessibilityRole="button">
            <Text style={styles.primaryButtonText}>Intentar de nuevo</Text>
            <Ionicons name="refresh-outline" size={18} color={colors.surface} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.textButton} onPress={signInAgain} accessibilityRole="button">
            <Text style={styles.textButtonLabel}>Volver a iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const updatedAt = data?.timestamp
    ? new Date(data.timestamp).toLocaleString('es', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <LinearGradient colors={[colors.background, '#EDF3E9']} style={styles.fullScreen}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchData}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>RESUMEN DE TU PLANTA</Text>
          <Text style={styles.title}>¿Cómo está hoy?</Text>
          <Text style={styles.subtitle}>{plant.name}</Text>
        </View>

        <View style={[styles.statusCard, alerts.length > 0 && styles.statusWarning]}>
          <View style={[styles.statusIcon, alerts.length > 0 && styles.statusIconWarning]}>
            <Ionicons
              name={alerts.length > 0 ? 'alert-outline' : 'checkmark'}
              size={21}
              color={alerts.length > 0 ? colors.warning : colors.primary}
            />
          </View>
          <View style={styles.statusCopy}>
            <Text style={[styles.statusTitle, alerts.length > 0 && styles.statusTitleWarning]}>
              {alerts.length > 0 ? 'Hay algo para revisar' : 'Todo se ve bien'}
            </Text>
            <Text style={styles.statusDescription}>
              {alerts.length > 0
                ? `${alerts.length} ${alerts.length === 1 ? 'recomendación' : 'recomendaciones'} para cuidar mejor tu planta.`
                : 'Las condiciones están dentro del rango ideal.'}
            </Text>
          </View>
          <Ionicons
            name={alerts.length > 0 ? 'chevron-forward' : 'sparkles-outline'}
            size={19}
            color={alerts.length > 0 ? colors.warning : colors.primary}
          />
        </View>

        {alerts.length > 0 && (
          <View style={styles.alertList}>
            {alerts.map((alert) => (
              <View key={alert} style={styles.alertRow}>
                <View style={styles.alertDot} />
                <Text style={styles.alertText}>{alert}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Condiciones actuales</Text>
            <Text style={styles.sectionSubtitle}>Lecturas de tu sensor</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchData}
            disabled={refreshing}
            accessibilityRole="button"
            accessibilityLabel="Actualizar lecturas"
          >
            <Ionicons name="refresh-outline" size={19} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard
            icon="thermometer-outline"
            label="Temperatura"
            value={data?.temperature}
            unit="°C"
            accent={colors.danger}
            tint={colors.dangerSoft}
            hint={
              plant.idealConditions?.temperature
                ? `Ideal: ${plant.idealConditions.temperature.min}–${plant.idealConditions.temperature.max} °C`
                : undefined
            }
          />
          <MetricCard
            icon="water-outline"
            label="Humedad del suelo"
            value={data?.soilHumidity}
            unit="%"
            accent={colors.blue}
            tint={colors.blueSoft}
            hint={
              plant.idealConditions?.soilHumidity
                ? `Ideal: ${plant.idealConditions.soilHumidity.min}–${plant.idealConditions.soilHumidity.max} %`
                : undefined
            }
          />
          <MetricCard
            icon="sunny-outline"
            label="Índice UV"
            value={data?.uvIndex}
            accent={colors.gold}
            tint={colors.goldSoft}
            hint={plant.idealConditions?.uvIndex ? `Máximo: ${plant.idealConditions.uvIndex.max}` : undefined}
          />
          <MetricCard
            icon="sunny"
            label="Intensidad de luz"
            value={data?.color?.light}
            unit={data?.color?.light == null ? '' : 'lux'}
            accent={colors.primary}
            tint={colors.primarySoft}
            hint={
              plant.idealConditions?.light
                ? `Ideal: ${plant.idealConditions.light.min.toLocaleString('es')}–${plant.idealConditions.light.max.toLocaleString('es')} lux`
                : 'Lectura ambiental'
            }
          />
        </View>

        <View style={styles.colorPanel}>
          <View style={styles.colorPanelHeading}>
            <View style={styles.colorIcon}>
              <Ionicons name="color-palette-outline" size={19} color={colors.primary} />
            </View>
            <View style={styles.colorHeadingCopy}>
              <Text style={styles.colorTitle}>Luz y color</Text>
              <Text style={styles.colorSubtitle}>Lectura RGB del ambiente</Text>
            </View>
          </View>
          <View style={styles.rgbList}>
            <ColorReading label="Rojo" value={data?.color?.red} color="#D86A5D" />
            <ColorReading label="Verde" value={data?.color?.green} color="#4B9863" />
            <ColorReading label="Azul" value={data?.color?.blue} color="#5E87B5" />
          </View>
        </View>

        <View style={styles.updatedRow}>
          <Ionicons name="time-outline" size={15} color={colors.muted} />
          <Text style={styles.updatedText}>
            {updatedAt ? `Última lectura · ${updatedAt}` : 'Mostrando la última lectura recibida'}
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

type MetricCardProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: number;
  unit?: string;
  accent: string;
  tint: string;
  hint?: string;
};

function MetricCard({ icon, label, value, unit, accent, tint, hint }: MetricCardProps) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: tint }]}>
        <Ionicons name={icon} size={19} color={accent} />
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricValueRow}>
        <Text style={styles.metricValue}>{value ?? '—'}</Text>
        {unit ? <Text style={styles.metricUnit}>{unit}</Text> : null}
      </View>
      {hint ? <Text style={styles.metricHint}>{hint}</Text> : null}
    </View>
  );
}

type ColorReadingProps = {
  label: string;
  value?: number;
  color: string;
};

function ColorReading({ label, value, color }: ColorReadingProps) {
  return (
    <View style={styles.colorReading}>
      <View style={[styles.colorSwatch, { backgroundColor: color }]} />
      <Text style={styles.colorLabel}>{label}</Text>
      <Text style={styles.colorValue}>{value ?? '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 36,
  },
  intro: { marginBottom: 20 },
  eyebrow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.7,
    marginBottom: 7,
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
    fontSize: 15,
    marginTop: 4,
  },
  statusCard: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderColor: '#D8E8D3',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  statusWarning: {
    backgroundColor: colors.warningSoft,
    borderColor: '#F1DFC1',
  },
  statusIcon: {
    alignItems: 'center',
    backgroundColor: '#D9EBD5',
    borderRadius: 13,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  statusIconWarning: { backgroundColor: '#F7E6C9' },
  statusCopy: { flex: 1 },
  statusTitle: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
  statusTitleWarning: { color: colors.warning },
  statusDescription: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
  alertList: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 23,
    padding: 14,
  },
  alertRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 10 },
  alertDot: {
    backgroundColor: colors.warning,
    borderRadius: 4,
    height: 7,
    marginTop: 6,
    width: 7,
  },
  alertText: {
    color: colors.text,
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
  },
  refreshButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 11,
    minHeight: 151,
    padding: 14,
    width: '48.3%',
  },
  metricIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 36,
    justifyContent: 'center',
    marginBottom: 12,
    width: 36,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
    minHeight: 18,
  },
  metricValueRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  metricValue: {
    color: colors.text,
    fontSize: 27,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  metricUnit: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  metricHint: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5,
  },
  colorPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 19,
    borderWidth: 1,
    marginTop: 3,
    padding: 16,
  },
  colorPanelHeading: { alignItems: 'center', flexDirection: 'row', gap: 11 },
  colorIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  colorHeadingCopy: { flex: 1 },
  colorTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  colorSubtitle: { color: colors.muted, fontSize: 12, marginTop: 3 },
  rgbList: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
  },
  colorReading: { alignItems: 'center', flex: 1 },
  colorSwatch: { borderRadius: 7, height: 13, marginBottom: 7, width: 13 },
  colorLabel: { color: colors.muted, fontSize: 12 },
  colorValue: { color: colors.text, fontSize: 15, fontWeight: '700', marginTop: 3 },
  updatedRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: 19,
  },
  updatedText: { color: colors.muted, fontSize: 11 },
  stateContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  stateIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 22,
    height: 68,
    justifyContent: 'center',
    marginBottom: 20,
    width: 68,
  },
  errorIcon: { backgroundColor: colors.dangerSoft },
  stateTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  stateDescription: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'center',
    marginTop: 25,
    minHeight: 52,
    paddingHorizontal: 22,
  },
  primaryButtonText: { color: colors.surface, fontSize: 14, fontWeight: '700' },
  textButton: { paddingHorizontal: 12, paddingVertical: 18 },
  textButtonLabel: { color: colors.primary, fontSize: 13, fontWeight: '600' },
});

export default MonitorScreen;
