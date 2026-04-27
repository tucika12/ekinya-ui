import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Pressable
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const TABS = ['Tümü', 'Beklemede', 'Kabul', 'Reddedilen'];

const STATUS_STYLE = {
  pending:  { bg: '#FFF4E5', text: '#B45309', label: 'Beklemede' },
  accepted: { bg: COLORS.limeSoft, text: COLORS.dark, label: 'Kabul edildi' },
  rejected: { bg: '#FFEBEE', text: COLORS.error, label: 'Reddedildi' }
};

const MOCK_APPLICATIONS = [
  { id: '1', jobTitle: 'Şeftali Hasadı İşçisi', farm: 'Bursa Şeftali Bahçesi', emoji: '🍑', status: 'accepted', date: '2 gün önce' },
  { id: '2', jobTitle: 'Zeytin Toplama İşçisi', farm: 'Ayvalık Zeytinlik', emoji: '🫒', status: 'pending', date: '3 gün önce' },
  { id: '3', jobTitle: 'Kiraz Hasadı', farm: 'Tekirdağ Tarım İşletmesi', emoji: '🍒', status: 'rejected', date: '5 gün önce' },
  { id: '4', jobTitle: 'Domates Paketleme', farm: 'Antalya Sera', emoji: '🍅', status: 'pending', date: '1 hafta önce' },
  { id: '5', jobTitle: 'Fidan Dikimi', farm: 'Kastamonu Orman Fidanlığı', emoji: '🌱', status: 'accepted', date: '2 hafta önce' },
];

export default function MyApplicationsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Tümü');

  const tabFilter = {
    'Tümü': null,
    'Beklemede': 'pending',
    'Kabul': 'accepted',
    'Reddedilen': 'rejected'
  };

  const filtered = tabFilter[activeTab]
    ? MOCK_APPLICATIONS.filter(a => a.status === tabFilter[activeTab])
    : MOCK_APPLICATIONS;

  const renderItem = ({ item }) => {
    const s = STATUS_STYLE[item.status];
    return (
      <Pressable
        style={styles.card}
        onPress={() => navigation?.navigate('ApplicationDetail', { application: item })}
      >
        <View style={styles.emojiBox}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.jobTitle} numberOfLines={1}>{item.jobTitle}</Text>
          <Text style={styles.farmName}>{item.farm}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusPill, { backgroundColor: s.bg }]}>
              <Text style={[styles.statusText, { color: s.text }]}>{s.label}</Text>
            </View>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>Başvurularım</Text>
        <Pressable style={styles.searchBtn}>
          <Ionicons name="search-outline" size={20} color={COLORS.text} />
        </Pressable>
      </View>

      {/* ── SEKMELER ── */}
      <View style={styles.segmentWrap}>
        {TABS.map(tab => (
          <Pressable
            key={tab}
            style={[styles.segment, activeTab === tab && styles.segmentActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.segmentText, activeTab === tab && styles.segmentTextActive]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ── LİSTE ── */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          filtered.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="file-tray-outline" size={36} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Henüz başvuru yok</Text>
            <Text style={styles.emptyDesc}>İş bulup ilk başvurunu yap</Text>
            <Pressable
              style={styles.findJobBtn}
              onPress={() => navigation?.goBack()}
            >
              <Text style={styles.findJobText}>İş bul</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center'
  },
  pageTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  searchBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center'
  },

  // ── SEKMELER ──
  segmentWrap: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
    gap: 4
  },
  segment: {
    flex: 1, alignItems: 'center',
    paddingVertical: 8,
    borderRadius: RADIUS.pill
  },
  segmentActive: { backgroundColor: COLORS.dark },
  segmentText: { fontSize: FS.sm, fontWeight: FW.medium, color: COLORS.textSub },
  segmentTextActive: { color: COLORS.textOnDark, fontWeight: FW.bold },

  // ── KART ──
  listContent: { paddingHorizontal: SPACING.md, gap: SPACING.sm, paddingBottom: SPACING.xl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.md
  },
  emojiBox: {
    width: 56, height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: '#001c0e',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  emoji: { fontSize: 28 },
  cardContent: { flex: 1, gap: 3 },
  jobTitle: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text },
  farmName: { fontSize: FS.xs, color: COLORS.textSub },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: 4 },
  statusPill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm
  },
  statusText: { fontSize: FS.xs, fontWeight: FW.semibold },
  dateText: { fontSize: FS.xs, color: COLORS.textMuted },

  // ── EMPTY ──
  emptyContainer: { flex: 1 },
  empty: { alignItems: 'center', marginTop: 80, paddingHorizontal: SPACING.xl },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.limeSoft,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.md
  },
  emptyTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text, marginBottom: 6 },
  emptyDesc: { fontSize: FS.sm, color: COLORS.textSub, marginBottom: SPACING.lg },
  findJobBtn: {
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md
  },
  findJobText: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.textOnDark }
});
