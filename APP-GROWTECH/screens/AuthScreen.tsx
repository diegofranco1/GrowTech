import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation';
import { authenticate } from '../services/api';
import { colors, typography } from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Auth'>;
};

export default function AuthScreen({ navigation }: Props) {
  const [registering, setRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await authenticate(registering ? 'register' : 'login', email.trim(), password);
      navigation.replace('PlantSelection');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo conectar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.brandMark}>
          <Ionicons name="leaf" size={25} color={colors.primary} />
        </View>
        <Text style={styles.eyebrow}>GROWTECH · CUIDADO INTELIGENTE</Text>
        <Text style={styles.title}>{registering ? 'Empieza a cuidar mejor.' : 'Qué bueno verte.'}</Text>
        <Text style={styles.subtitle}>
          {registering
            ? 'Crea tu cuenta y acompaña de cerca la salud de tus plantas.'
            : 'Inicia sesión para volver al estado de tus plantas.'}
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="nombre@correo.com"
            placeholderTextColor="#98A49B"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            maxLength={254}
            accessibilityLabel="Correo electrónico"
          />
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder={registering ? 'Al menos 8 caracteres' : 'Tu contraseña'}
            placeholderTextColor="#98A49B"
            secureTextEntry
            autoComplete={registering ? 'new-password' : 'current-password'}
            textContentType={registering ? 'newPassword' : 'password'}
            maxLength={72}
            accessibilityLabel="Contraseña"
          />

          {registering && (
            <Text style={styles.passwordHint}>Usa una contraseña de al menos 8 caracteres.</Text>
          )}

          {error && (
            <View style={styles.errorBox} accessibilityRole="alert">
              <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
              <Text style={styles.error}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, submitting && styles.disabledButton]}
            onPress={submit}
            disabled={submitting}
            accessibilityRole="button"
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>{registering ? 'Crear cuenta' : 'Iniciar sesión'}</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.surface} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => {
            setRegistering(!registering);
            setError(null);
          }}
          disabled={submitting}
          accessibilityRole="button"
        >
          <Text style={styles.switchText}>
            {registering ? '¿Ya tienes cuenta? Inicia sesión' : '¿Eres nuevo por aquí? Crea tu cuenta'}
          </Text>
        </TouchableOpacity>
        <View style={styles.privacyNote}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.muted} />
          <Text style={styles.privacyText}>Tu información se mantiene protegida.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 32,
    backgroundColor: colors.background,
  },
  brandMark: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 22,
    height: 64,
    justifyContent: 'center',
    marginBottom: 18,
    width: 64,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.7,
    marginBottom: 12,
    textAlign: 'center',
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '700',
    letterSpacing: -0.6,
    lineHeight: 32,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 27,
    marginTop: 11,
    textAlign: 'center',
  },
  form: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FAFCF9',
    borderColor: colors.border,
    borderRadius: 13,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    marginBottom: 18,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  passwordHint: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
    marginTop: -8,
  },
  errorBox: {
    alignItems: 'center',
    backgroundColor: colors.dangerSoft,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 9,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  error: {
    color: colors.danger,
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 3,
    minHeight: 54,
  },
  disabledButton: { opacity: 0.7 },
  buttonText: { color: colors.surface, fontSize: 15, fontWeight: '700' },
  switchButton: { alignSelf: 'center', paddingHorizontal: 8, paddingVertical: 19 },
  switchText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  privacyNote: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  privacyText: { color: colors.muted, fontSize: 12 },
});
