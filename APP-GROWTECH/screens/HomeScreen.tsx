import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation';
import { colors, typography } from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.topLine}>
        <View style={styles.brandMark}>
          <Ionicons name="leaf" size={17} color={colors.primary} />
        </View>
        <Text style={styles.brandName}>GROWTECH</Text>
      </View>

      <View style={styles.hero}>
        <View style={styles.logoFrame}>
          <Image
            source={require('../assets/LogoGrowtech.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Logo de GrowTech"
          />
        </View>
        <Text style={styles.eyebrow}>CUIDAR EMPIEZA POR OBSERVAR</Text>
        <Text style={styles.title}>Tu cultivo,{'\n'}en su mejor momento.</Text>
        <Text style={styles.subtitle}>
          Conoce lo que necesita cada planta con información clara y en tiempo real.
        </Text>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Auth')}
          accessibilityRole="button"
          accessibilityLabel="Comenzar a cuidar mis plantas"
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Comenzar</Text>
          <Ionicons name="arrow-forward" size={19} color={colors.surface} />
        </TouchableOpacity>
        <View style={styles.promise}>
          <Ionicons name="shield-checkmark-outline" size={15} color={colors.muted} />
          <Text style={styles.footerText}>Tus plantas, cuidadas con datos</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    paddingTop: 24,
    paddingBottom: 28,
  },
  topLine: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  brandName: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.2,
  },
  hero: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  logoFrame: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 38,
    borderWidth: 1,
    height: 216,
    justifyContent: 'center',
    marginBottom: 34,
    width: 216,
  },
  logo: {
    height: 188,
    width: 188,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 13,
    textAlign: 'center',
  },
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: '700',
    letterSpacing: -1.4,
    lineHeight: 40,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 25,
    marginTop: 15,
    maxWidth: 320,
    textAlign: 'center',
  },
  bottom: {
    gap: 17,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 58,
    gap: 12,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '700',
  },
  promise: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
  },
  footerText: {
    color: colors.muted,
    fontSize: typography.caption,
  },
});
