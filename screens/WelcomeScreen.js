import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── ÜST BAR ── */}
        <View style={styles.topBar}>
          <View style={styles.logoRow}>
            <View style={styles.logoCircle}>
              <Ionicons name="leaf-outline" size={18} color={COLORS.lime} />
            </View>
            <Text style={styles.brandName}>tarımeşleş</Text>
          </View>
        </View>

        {/* ── PILL BADGE ── */}
        <View style={styles.badge}>
          <View style={styles.greenDot} />
          <Text style={styles.badgeText}>Doğrulamalı agri-tech ağ</Text>
        </View>

        {/* ── HERO BAŞLIK ── */}
        <Text style={styles.headline}>
          <Text style={styles.headlineBold}>Tarımda{'\n'}</Text>
          <Text style={[styles.headlineBold, styles.headlineItalic]}>güvenli </Text>
          <Text style={styles.headlineBold}>iş{'\n'}</Text>
          <Text style={styles.headlineBold}>eşleştirme.</Text>
        </Text>

        {/* ── AÇIKLAMA ── */}
        <Text style={styles.desc}>
          Öğrenciler günlük tarım işine başvurur, çiftçiler doğrulanmış iş gücü bulur. Para escrow ile güvende.
        </Text>

        {/* ── KOYU CTA KARTI ── */}
        <View style={styles.ctaCard}>
          {/* Kart üst satır */}
          <View style={styles.ctaTopRow}>
            <Text style={styles.ctaSmallLabel}>HEMEN BAŞLA</Text>
            <View style={styles.ctaIconCircle}>
              <Ionicons name="leaf" size={20} color={COLORS.dark} />
            </View>
          </View>

          <Text style={styles.ctaTitle}>Rolünü seç</Text>

          {/* Öğrenci butonu */}
          <Pressable
            style={styles.roleBtn}
            onPress={() => navigation.navigate('SignupRole', { role: 'student' })}
          >
            <View style={styles.roleIconCircle}>
              <Ionicons name="school-outline" size={22} color={COLORS.lime} />
            </View>
            <View style={styles.roleTextBlock}>
              <Text style={styles.roleBtnTitle}>Öğrenciyim</Text>
              <Text style={styles.roleBtnSub}>Çalış · Kazan</Text>
            </View>
            <Ionicons name="arrow-up" size={18} color={COLORS.dark} style={styles.arrowIcon} />
          </Pressable>

          {/* Çiftçi butonu */}
          <Pressable
            style={styles.roleBtn}
            onPress={() => navigation.navigate('SignupRole', { role: 'farmer' })}
          >
            <View style={styles.roleIconCircle}>
              <MaterialCommunityIcons name="tractor" size={22} color={COLORS.lime} />
            </View>
            <View style={styles.roleTextBlock}>
              <Text style={styles.roleBtnTitle}>Çiftçiyim</Text>
              <Text style={styles.roleBtnSub}>İlan ver · Çalıştır</Text>
            </View>
            <Ionicons name="arrow-up" size={18} color={COLORS.dark} style={styles.arrowIcon} />
          </Pressable>

          {/* Misafir butonu */}
          <Pressable
            style={styles.ghostBtn}
            onPress={() => navigation.navigate('Jobs')}
          >
            <Text style={styles.ghostBtnText}>İlanları misafir olarak keşfet</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.lime} />
          </Pressable>
        </View>

        {/* ── 3 FEATURE KART ── */}
        <View style={styles.featRow}>
          <FeatureCard
            icon="shield-checkmark-outline"
            title="Belge"
            sub="Doğrulanmış"
          />
          <FeatureCard
            icon="qr-code-outline"
            title="QR"
            sub="Takip"
          />
          <FeatureCard
            icon="wallet-outline"
            title="Escrow"
            sub="Güvenli ödeme"
          />
        </View>

        {/* ── ALT GIRIŞ LINKI ── */}
        <Text style={styles.bottomHint}>
          Hesabın var mı?{' '}
          <Text
            style={styles.bottomLink}
            onPress={() => navigation.navigate('Login')}
          >
            Giriş yap
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureCard({ icon, title, sub }) {
  return (
    <View style={styles.featCard}>
      <View style={styles.featIconCircle}>
        <Ionicons name={icon} size={18} color={COLORS.dark} />
      </View>
      <Text style={styles.featTitle}>{title}</Text>
      <Text style={styles.featSub}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg
  },
  scroll: {
    flex: 1
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl
  },

  // ── ÜST BAR ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.dark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandName: {
    fontSize: FS.lg,
    fontWeight: FW.semibold,
    color: COLORS.text
  },
  loginLink: {
    fontSize: FS.md,
    fontWeight: FW.medium,
    color: COLORS.text
  },

  // ── PILL BADGE ──
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.lg,
    gap: SPACING.sm
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success
  },
  badgeText: {
    fontSize: FS.sm,
    color: COLORS.text
  },

  // ── HERO BAŞLIK ──
  headline: {
    marginBottom: SPACING.md
  },
  headlineBold: {
    fontSize: FS.display,
    fontWeight: FW.bold,
    color: COLORS.text,
    lineHeight: 40
  },
  headlineItalic: {
    fontStyle: 'italic'
  },

  // ── AÇIKLAMA ──
  desc: {
    fontSize: FS.md,
    color: COLORS.textSub,
    lineHeight: 22,
    marginBottom: SPACING.lg
  },

  // ── KOYU CTA KARTI ──
  ctaCard: {
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md
  },
  ctaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm
  },
  ctaSmallLabel: {
    fontSize: FS.xs,
    fontWeight: FW.bold,
    color: COLORS.lime,
    letterSpacing: 1.5
  },
  ctaIconCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ctaTitle: {
    fontSize: FS.xxl,
    fontWeight: FW.bold,
    color: COLORS.textOnDark,
    marginBottom: SPACING.md
  },

  // Role butonları
  roleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lime,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.sm
  },
  roleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.dark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  roleTextBlock: {
    flex: 1
  },
  roleBtnTitle: {
    fontSize: FS.md,
    fontWeight: FW.bold,
    color: COLORS.dark
  },
  roleBtnSub: {
    fontSize: FS.xs,
    color: COLORS.darkDeep,
    marginTop: 2
  },
  arrowIcon: {
    transform: [{ rotate: '45deg' }]
  },

  // Ghost buton
  ghostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3a5a3a',
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.xs,
    gap: SPACING.xs
  },
  ghostBtnText: {
    fontSize: FS.sm,
    fontWeight: FW.medium,
    color: COLORS.lime
  },

  // ── 3 FEATURE KART ──
  featRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg
  },
  featCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center'
  },
  featIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.limeSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm
  },
  featTitle: {
    fontSize: FS.sm,
    fontWeight: FW.bold,
    color: COLORS.text
  },
  featSub: {
    fontSize: FS.xs,
    color: COLORS.textSub,
    marginTop: 2,
    textAlign: 'center'
  },

  // ── ALT LİNK ──
  bottomHint: {
    textAlign: 'center',
    fontSize: FS.sm,
    color: COLORS.textSub,
    marginTop: SPACING.sm
  },
  bottomLink: {
    color: COLORS.lime,
    fontWeight: FW.semibold,
    textDecorationLine: 'underline'
  }
});
