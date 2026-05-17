import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

export default function SignupSuccessScreen({ navigation }) {
  const goExplore = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'GuestExplore' }],
      })
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Ionicons name="leaf-outline" size={18} color={COLORS.lime} />
          </View>
          <Text style={styles.brandName}>EKİNYA</Text>
        </View>

        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark-circle" size={36} color={COLORS.dark} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerLabel}>KAYIT TAMAMLANDI</Text>
              <Text style={styles.headerTitle}>Harika, kaydın alındı</Text>
            </View>
          </View>
          <Text style={styles.headerDesc}>
            Başvurun yetkili ekip tarafından incelenecek. Hesabın onaylandığında
            giriş yaparak tüm özelliklere erişebileceksin.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIconWrap}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.warning} />
          </View>
          <View style={styles.infoBody}>
            <Text style={styles.infoTitle}>Doğrulama sonrası</Text>
            <Text style={styles.infoText}>
              Onay süreci tamamlandığında hesabın aktif hale gelecek. Ardından
              kayıtlı e-posta ve şifrenle giriş yapabilirsin.
            </Text>
          </View>
        </View>

        <View style={styles.infoCardMuted}>
          <Ionicons name="compass-outline" size={20} color={COLORS.textSub} style={styles.infoMutedIcon} />
          <Text style={styles.infoMutedText}>
            Şimdilik sadece ilanları görüntüleyebilirsin; başvuru ve mesajlaşma için hesabın
            onaylanması gerekir.
          </Text>
        </View>

        <Pressable style={styles.cta} onPress={goExplore} accessibilityRole="button">
          <Text style={styles.ctaText}>Hadi başlayalım</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.dark} />
        </Pressable>

        <Pressable style={styles.secondary} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.secondaryText}>Zaten hesabım var, giriş yap</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    paddingTop: SPACING.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: FS.sm,
    fontWeight: FW.bold,
    letterSpacing: 2,
    color: COLORS.text,
  },
  headerCard: {
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  headerLabel: {
    fontSize: FS.xs,
    fontWeight: FW.bold,
    color: COLORS.lime,
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: FS.xl,
    fontWeight: FW.bold,
    color: COLORS.textOnDark,
    lineHeight: 28,
  },
  headerDesc: {
    fontSize: FS.sm,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 22,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    backgroundColor: COLORS.limeSoft,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.lime,
  },
  infoIconWrap: { marginTop: 2 },
  infoBody: { flex: 1 },
  infoTitle: {
    fontSize: FS.md,
    fontWeight: FW.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: FS.sm,
    color: COLORS.textSub,
    lineHeight: 20,
  },
  infoCardMuted: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoMutedIcon: { marginTop: 2 },
  infoMutedText: {
    flex: 1,
    fontSize: FS.sm,
    color: COLORS.textSub,
    lineHeight: 20,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.lime,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md + 2,
    marginBottom: SPACING.md,
  },
  ctaText: {
    fontSize: FS.md,
    fontWeight: FW.bold,
    color: COLORS.dark,
  },
  secondary: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  secondaryText: {
    fontSize: FS.sm,
    fontWeight: FW.semibold,
    color: COLORS.textMuted,
    textDecorationLine: 'underline',
  },
});
