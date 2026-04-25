import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

export default function SignupRoleScreen({ navigation }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (!selectedRole) return;
    if (selectedRole === 'student') {
      navigation.navigate('StudentRegisterForm');
    } else {
      navigation.navigate('FarmerRegisterForm');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backCircle} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color={COLORS.text} />
          </Pressable>
          <Text style={styles.stepText}>1 / 4</Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>Hangi rolde başlayacaksın?</Text>
          <Text style={styles.subtitle}>Her rol için ayrı hesap gerekir</Text>
        </View>

        <View style={styles.cards}>
          <Pressable
            style={[
              styles.card,
              selectedRole === 'student' && styles.cardSelected,
            ]}
            onPress={() => setSelectedRole('student')}
          >
            <View style={styles.cardIconCircle}>
              <Ionicons name="school-outline" size={32} color={COLORS.dark} />
            </View>
            <Text style={styles.cardTitle}>Öğrenciyim</Text>
            <Text style={styles.cardDesc}>
              Mevsimlik tarım işlerine başvur, deneyim ve ek gelir kazan.
            </Text>
            <View style={styles.cardPill}>
              <Text style={styles.cardPillText}>Çalış · Kazan</Text>
            </View>
          </Pressable>

          <Pressable
            style={[
              styles.card,
              selectedRole === 'farmer' && styles.cardSelected,
            ]}
            onPress={() => setSelectedRole('farmer')}
          >
            <View style={styles.cardIconCircle}>
              <MaterialCommunityIcons name="tractor" size={32} color={COLORS.dark} />
            </View>
            <Text style={styles.cardTitle}>Çiftçiyim</Text>
            <Text style={styles.cardDesc}>
              Doğrulanmış öğrenci iş gücü bul, ilanını dakikalar içinde ver.
            </Text>
            <View style={styles.cardPill}>
              <Text style={styles.cardPillText}>İlan ver · Çalıştır</Text>
            </View>
          </Pressable>
        </View>

        <Pressable
          style={[styles.continueBtn, !selectedRole && styles.continueBtnDisabled]}
          disabled={!selectedRole}
          onPress={handleContinue}
        >
          <Text style={styles.continueBtnText}>Devam et</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: FS.sm,
    color: COLORS.textMuted,
  },

  titleBlock: {
    marginTop: 32,
  },
  title: {
    fontSize: FS.title,
    fontWeight: FW.bold,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FS.md,
    color: COLORS.textSub,
    marginTop: 4,
  },

  cards: {
    marginTop: 32,
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xl,
    padding: 24,
  },
  cardSelected: {
    borderColor: COLORS.lime,
  },
  cardIconCircle: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: FS.xl,
    fontWeight: FW.bold,
    color: COLORS.text,
    marginTop: 12,
  },
  cardDesc: {
    fontSize: FS.sm,
    color: COLORS.textSub,
    marginTop: 6,
    lineHeight: 20,
  },
  cardPill: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.limeSoft,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cardPillText: {
    fontSize: FS.xs,
    fontWeight: FW.semibold,
    color: COLORS.dark,
  },

  continueBtn: {
    marginTop: 32,
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.pill,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  continueBtnDisabled: { opacity: 0.4 },
  continueBtnText: {
    fontSize: FS.md,
    fontWeight: FW.semibold,
    color: COLORS.textOnDark,
  },
});
