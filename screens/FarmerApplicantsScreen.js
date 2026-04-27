import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const APPLICANTS = [
  { id: 1, initials: 'AY', name: 'Ayşe Yılmaz', uni: 'Yıldırım Beyazıt Üni', rating: 4.8, jobs: 12, status: 'pending' },
  { id: 2, initials: 'MK', name: 'Mehmet Koç', uni: 'Ankara Üni', rating: 4.6, jobs: 7, status: 'pending' },
  { id: 3, initials: 'ZD', name: 'Zeynep Doğan', uni: 'Hacettepe Üni', rating: 4.9, jobs: 20, status: 'accepted' },
  { id: 4, initials: 'EŞ', name: 'Emre Şahin', uni: 'Gazi Üni', rating: 4.3, jobs: 3, status: 'rejected' },
  { id: 5, initials: 'FA', name: 'Fatma Arslan', uni: 'ODTÜ', rating: 4.7, jobs: 9, status: 'pending' },
];

const FILTERS = ['Tümü', 'Beklemede', 'Kabul', 'Reddedilen'];

const STATUS_META = {
  pending:  { label: 'Beklemede',  bg: '#FFF3E0',       color: COLORS.warning },
  accepted: { label: 'Kabul',      bg: COLORS.limeSoft, color: COLORS.success },
  rejected: { label: 'Reddedildi', bg: '#FFEBEE',       color: COLORS.error },
};

export default function FarmerApplicantsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const job = route?.params?.job ?? { title: 'İş İlanı', workers: 5 };
  const [applicants, setApplicants] = useState(APPLICANTS);
  const [activeFilter, setActiveFilter] = useState('Tümü');

  const accept = (id) => setApplicants(a => a.map(x => x.id === id ? { ...x, status: 'accepted' } : x));
  const reject = (id) => setApplicants(a => a.map(x => x.id === id ? { ...x, status: 'rejected' } : x));

  const filtered = applicants.filter(a => {
    if (activeFilter === 'Tümü') return true;
    if (activeFilter === 'Beklemede') return a.status === 'pending';
    if (activeFilter === 'Kabul') return a.status === 'accepted';
    if (activeFilter === 'Reddedilen') return a.status === 'rejected';
    return true;
  });

  const acceptedCount = applicants.filter(a => a.status === 'accepted').length;

  return (
    <View style={styles.screen}>

      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <View style={styles.titleBlock}>
          <Text style={styles.pageTitle}>{job.title}</Text>
          <Text style={styles.pageSubtitle}>{applicants.length} başvuru · {job.workers} kişi aranıyor</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* ── PROGRESS BAR ── */}
      <View style={styles.progressWrap}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${Math.min(100, (acceptedCount / (job.workers || 1)) * 100)}%` }]} />
        </View>
        <Text style={styles.progressText}>{acceptedCount}/{job.workers} kabul edildi</Text>
      </View>

      {/* ── FİLTRE (sabit, yatay View) ── */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <Pressable
            key={f}
            style={[styles.chip, activeFilter === f && styles.chipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      {/* ── BAŞVURU LİSTESİ (ScrollView → items always at top) ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={40} color={COLORS.border} />
            <Text style={styles.emptyText}>Bu filtrede başvuru yok</Text>
          </View>
        ) : (
          filtered.map(item => {
            const meta = STATUS_META[item.status];
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.initials}</Text>
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.uni}>{item.uni}</Text>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaText}>⭐ {item.rating}</Text>
                      <Text style={styles.metaDot}>·</Text>
                      <Text style={styles.metaText}>{item.jobs} iş tamamlandı</Text>
                    </View>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
                    <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
                  </View>
                </View>

                {item.status === 'pending' && (
                  <View style={styles.actions}>
                    <Pressable style={styles.rejectBtn} onPress={() => reject(item.id)}>
                      <Text style={styles.rejectText}>Reddet</Text>
                    </Pressable>
                    <Pressable style={styles.acceptBtn} onPress={() => accept(item.id)}>
                      <Text style={styles.acceptText}>Kabul et</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  titleBlock: { flex: 1, alignItems: 'center' },
  pageTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  pageSubtitle: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 2 },
  progressWrap: { paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
  progressBg: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', backgroundColor: COLORS.lime, borderRadius: 3 },
  progressText: { fontSize: FS.xs, color: COLORS.textSub },
  filterRow: { flexDirection: 'row', paddingHorizontal: SPACING.md, gap: SPACING.sm, paddingBottom: SPACING.sm },
  chip: { borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: 8, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  chipText: { fontSize: FS.sm, color: COLORS.text },
  chipTextActive: { fontWeight: FW.semibold, color: COLORS.dark },
  list: { paddingHorizontal: SPACING.md, paddingTop: SPACING.sm, gap: SPACING.sm },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.limeSoft, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.lime },
  avatarText: { fontSize: FS.sm, fontWeight: FW.bold, color: COLORS.dark },
  info: { flex: 1 },
  name: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.text },
  uni: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaText: { fontSize: FS.xs, color: COLORS.textMuted },
  metaDot: { fontSize: FS.xs, color: COLORS.textMuted },
  statusPill: { borderRadius: RADIUS.pill, paddingHorizontal: SPACING.sm, paddingVertical: 4 },
  statusText: { fontSize: FS.xs, fontWeight: FW.semibold },
  actions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  rejectBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.error, borderRadius: RADIUS.pill, paddingVertical: 10, alignItems: 'center' },
  rejectText: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.error },
  acceptBtn: { flex: 1, backgroundColor: COLORS.lime, borderRadius: RADIUS.pill, paddingVertical: 10, alignItems: 'center' },
  acceptText: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.dark },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: SPACING.sm },
  emptyText: { fontSize: FS.md, color: COLORS.textMuted },
});
