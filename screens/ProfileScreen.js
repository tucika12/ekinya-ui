import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const menuItems = [
  { label: 'Kişisel bilgiler', icon: 'person-outline', screen: 'EditProfile' },
  { label: 'Belgelerim', icon: 'cloud-upload-outline', screen: null },
  { label: 'Becerilerim', icon: 'star-outline', screen: null },
  { label: 'Çalışma geçmişim', icon: 'calendar-outline', screen: null },
  { label: 'Cüzdan', icon: 'wallet-outline', screen: 'Wallet' },
  { label: 'Bildirimler', icon: 'notifications-outline', screen: 'Notifications' },
  { label: 'Yardım & Destek', icon: 'help-circle-outline', screen: null },
  { label: 'Ayarlar', icon: 'settings-outline', screen: 'Settings' },
];

const stats = [
  { value: '12', label: 'Tamamlanan' },
  { value: '₺18.000', label: 'Kazanç' },
  { value: '4.7 ⭐', label: 'Puan' },
  { value: '%98', label: 'Doğrulama' },
];

const badges = [
  { label: '✓ E-posta', color: COLORS.success },
  { label: '✓ Telefon', color: COLORS.success },
  { label: '⏳ Belge inceleniyor', color: COLORS.warning },
];

export default function ProfileScreen({ navigation }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* ── ÜST İKONLAR ── */}
      <View style={styles.topBar}>
        <Pressable><Ionicons name="settings-outline" size={24} color={COLORS.text} /></Pressable>
        <Pressable><Ionicons name="share-outline" size={24} color={COLORS.text} /></Pressable>
      </View>

      {/* ── PROFIL HERO ── */}
      <View style={styles.hero}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AY</Text>
          </View>
          <View style={styles.cameraBtn}>
            <Ionicons name="camera-outline" size={14} color={COLORS.dark} />
          </View>
        </View>
        <Text style={styles.heroName}>Ayşe Yılmaz</Text>
        <Text style={styles.heroMeta}>Yıldırım Beyazıt Üni · YBS</Text>
        <Text style={styles.heroStats}>⭐ 4.7 · 12 iş · Üye: Ocak 2026</Text>
      </View>

      {/* ── ROZETLER ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesRow}>
        {badges.map(b => (
          <View key={b.label} style={styles.badge}>
            <Text style={[styles.badgeText, { color: b.color }]}>{b.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* ── STATS GRID ── */}
      <View style={styles.statsGrid}>
        {stats.map(s => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* ── MENU ── */}
      <View style={styles.menuCard}>
        {menuItems.map((item, i) => (
          <Pressable
            key={item.label}
            style={[styles.menuRow, i < menuItems.length - 1 && styles.menuBorder]}
            onPress={() => item.screen && navigation?.navigate?.(item.screen)}
          >
            <View style={styles.menuIconWrap}>
              <Ionicons name={item.icon} size={18} color={COLORS.dark} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </Pressable>
        ))}
      </View>

      {/* ── ÇIKIŞ ── */}
      <Pressable style={styles.logoutBtn} onPress={() => navigation?.navigate?.('Welcome')}>
        <Text style={styles.logoutText}>Çıkış yap</Text>
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: SPACING.xxl },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', gap: SPACING.md, padding: SPACING.md, paddingTop: SPACING.lg },
  hero: { alignItems: 'center', paddingVertical: SPACING.md, paddingBottom: SPACING.lg },
  avatarWrap: { position: 'relative' },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#E8E8E8', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: COLORS.lime },
  avatarText: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.dark },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.lime, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.surface },
  heroName: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.text, marginTop: SPACING.sm },
  heroMeta: { fontSize: FS.sm, color: COLORS.textSub, marginTop: 4 },
  heroStats: { fontSize: FS.xs, color: COLORS.textMuted, marginTop: 4 },
  badgesRow: { paddingHorizontal: SPACING.md, gap: SPACING.sm, paddingBottom: SPACING.md },
  badge: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  badgeText: { fontSize: FS.xs, fontWeight: FW.semibold },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  statCard: { width: '47%', backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, alignItems: 'center' },
  statValue: { fontSize: FS.xl, fontWeight: FW.bold, color: COLORS.text },
  statLabel: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 4 },
  menuCard: { marginHorizontal: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.md },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.sm },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.limeSoft, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: FS.md, fontWeight: FW.medium, color: COLORS.text },
  logoutBtn: { alignItems: 'center', padding: SPACING.lg },
  logoutText: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.error }
});
