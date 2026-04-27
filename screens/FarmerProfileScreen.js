import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const stats = [
  { value: '24', label: 'İlan' },
  { value: '187', label: 'İşçi' },
  { value: '4.8 ⭐', label: 'Puan' },
  { value: '₺98K', label: 'Ödenen' },
];

const badges = [
  { label: '✓ Kimlik', color: COLORS.success },
  { label: '✓ ÇKS Belgesi', color: COLORS.success },
  { label: '⭐ Güvenilir Çiftçi', color: '#F57C00' },
];

const crops = ['🫒 Zeytin', '🍅 Domates', '🌱 Fidan', '🍓 Çilek', '🍇 Üzüm'];

const menuItems = [
  { label: 'Çiftlik bilgileri',   icon: 'home-outline',          screen: null },
  { label: 'İlanlarım',           icon: 'list-outline',           screen: 'FarmerMyJobs' },
  { label: 'Ödeme geçmişi',       icon: 'wallet-outline',         screen: 'Wallet' },
  { label: 'Değerlendirmelerim',  icon: 'star-outline',           screen: null },
  { label: 'Bildirimler',         icon: 'notifications-outline',  screen: 'Notifications' },
  { label: 'Ayarlar',             icon: 'settings-outline',       screen: 'Settings' },
  { label: 'Yardım & Destek',     icon: 'help-circle-outline',    screen: null },
];

export default function FarmerProfileScreen({ navigation }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* ── ÜST BAR ── */}
      <View style={styles.topBar}>
        <Pressable><Ionicons name="settings-outline" size={24} color={COLORS.text} /></Pressable>
        <Pressable><Ionicons name="share-outline" size={24} color={COLORS.text} /></Pressable>
      </View>

      {/* ── HERO ── */}
      <View style={styles.hero}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🚜</Text>
          </View>
          <View style={styles.cameraBtn}>
            <Ionicons name="camera-outline" size={14} color={COLORS.dark} />
          </View>
        </View>
        <Text style={styles.heroName}>Mehmet Kaya</Text>
        <Text style={styles.heroFarm}>Kaya Çiftliği</Text>
        <Text style={styles.heroMeta}>📍 Aydın · Nazilli · Üye: Ocak 2024</Text>
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

      {/* ── ÜRÜNLER ── */}
      <View style={styles.cropsCard}>
        <Text style={styles.cropsTitle}>YETİŞTİRİLEN ÜRÜNLER</Text>
        <View style={styles.cropsRow}>
          {crops.map(c => (
            <View key={c} style={styles.cropPill}>
              <Text style={styles.cropText}>{c}</Text>
            </View>
          ))}
        </View>
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
  hero: { alignItems: 'center', paddingVertical: SPACING.sm, paddingBottom: SPACING.md },
  avatarWrap: { position: 'relative' },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.dark, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: COLORS.lime },
  avatarEmoji: { fontSize: 42 },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.lime, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.surface },
  heroName: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.text, marginTop: SPACING.sm },
  heroFarm: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.lime, marginTop: 2 },
  heroMeta: { fontSize: FS.xs, color: COLORS.textMuted, marginTop: 4 },
  badgesRow: { paddingHorizontal: SPACING.md, gap: SPACING.sm, paddingBottom: SPACING.md },
  badge: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  badgeText: { fontSize: FS.xs, fontWeight: FW.semibold },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  statCard: { width: '47%', backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, alignItems: 'center' },
  statValue: { fontSize: FS.xl, fontWeight: FW.bold, color: COLORS.text },
  statLabel: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 4 },
  cropsCard: { marginHorizontal: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, marginBottom: SPACING.md },
  cropsTitle: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.textMuted, letterSpacing: 1.2, marginBottom: SPACING.sm },
  cropsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  cropPill: { backgroundColor: COLORS.limeSoft, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  cropText: { fontSize: FS.sm, fontWeight: FW.medium, color: COLORS.dark },
  menuCard: { marginHorizontal: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.md },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.sm },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.limeSoft, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: FS.md, fontWeight: FW.medium, color: COLORS.text },
  logoutBtn: { alignItems: 'center', padding: SPACING.lg },
  logoutText: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.error },
});
