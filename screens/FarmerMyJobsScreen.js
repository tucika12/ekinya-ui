import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const ALL_JOBS = [
  { id: 1, title: 'Zeytin Toplama', dates: '15-25 May', wage: '₺600/gün', applications: 5, status: 'active', workers: 8 },
  { id: 2, title: 'Domates Hasadı', dates: '10-18 May', wage: '₺550/gün', applications: 7, status: 'full', workers: 7 },
  { id: 3, title: 'Fidan Dikimi', dates: '20-28 May', wage: '₺500/gün', applications: 3, status: 'active', workers: 4 },
  { id: 4, title: 'Çilek Hasadı', dates: '1-10 Nis', wage: '₺580/gün', applications: 12, status: 'completed', workers: 10 },
  { id: 5, title: 'Üzüm Bağbozumu', dates: '5-15 Eyl', wage: '₺650/gün', applications: 0, status: 'draft', workers: 6 },
];

const FILTERS = ['Tümü', 'Aktif', 'Dolu', 'Tamamlanan', 'Taslak'];

const STATUS_META = {
  active:    { label: 'Aktif',      bg: COLORS.limeSoft,  color: COLORS.success },
  full:      { label: 'Dolu',       bg: '#FFF3E0',        color: COLORS.warning },
  completed: { label: 'Tamamlandı', bg: '#ECF0FF',        color: '#3D5AFE' },
  draft:     { label: 'Taslak',     bg: COLORS.surface,   color: COLORS.textSub },
};

export default function FarmerMyJobsScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('Tümü');

  const filtered = ALL_JOBS.filter(j => {
    if (activeFilter === 'Tümü') return true;
    if (activeFilter === 'Aktif') return j.status === 'active';
    if (activeFilter === 'Dolu') return j.status === 'full';
    if (activeFilter === 'Tamamlanan') return j.status === 'completed';
    if (activeFilter === 'Taslak') return j.status === 'draft';
    return true;
  });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* ── ÜST BAR ── */}
      <View style={styles.topBar}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>İlanlarım</Text>
        <Pressable
          style={styles.addBtn}
          onPress={() => navigation?.navigate?.('CreateJob')}
        >
          <Ionicons name="add" size={22} color={COLORS.dark} />
        </Pressable>
      </View>

      {/* ── ÖZET ── */}
      <View style={styles.summaryRow}>
        {[
          { value: ALL_JOBS.filter(j => j.status === 'active').length.toString(), label: 'Aktif' },
          { value: ALL_JOBS.reduce((s, j) => s + j.applications, 0).toString(), label: 'Başvuru' },
          { value: ALL_JOBS.filter(j => j.status === 'completed').length.toString(), label: 'Tamamlanan' },
        ].map(s => (
          <View key={s.label} style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{s.value}</Text>
            <Text style={styles.summaryLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* ── FİLTRE ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map(f => (
          <Pressable
            key={f}
            style={[styles.chip, activeFilter === f && styles.chipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* ── İLAN LİSTESİ ── */}
      <View style={styles.list}>
        {filtered.map(job => {
          const meta = STATUS_META[job.status];
          return (
            <Pressable
              key={job.id}
              style={styles.jobCard}
              onPress={() => navigation?.navigate?.('FarmerApplicants', { job })}
            >
              {/* Emoji kutu */}
              <View style={styles.emojiBox}>
                <Text style={styles.emojiText}>🌾</Text>
              </View>

              <View style={styles.jobInfo}>
                <View style={styles.jobTitleRow}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
                    <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
                  </View>
                </View>
                <Text style={styles.jobDates}>📅 {job.dates} · {job.wage}</Text>
                <View style={styles.jobFooterRow}>
                  <View style={styles.appBadge}>
                    <Ionicons name="people-outline" size={13} color={COLORS.textSub} />
                    <Text style={styles.appText}>{job.applications} başvuru</Text>
                  </View>
                  <Text style={styles.workerText}>{job.workers} işçi aranıyor</Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </Pressable>
          );
        })}
      </View>

      {/* ── YENİ İLAN CTA ── */}
      <Pressable style={styles.createBtn} onPress={() => navigation?.navigate?.('CreateJob')}>
        <Ionicons name="add-circle-outline" size={20} color={COLORS.dark} />
        <Text style={styles.createText}>Yeni ilan oluştur</Text>
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: 40 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, paddingTop: SPACING.lg },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  pageTitle: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.text },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lime, alignItems: 'center', justifyContent: 'center' },
  summaryRow: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  summaryCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, alignItems: 'center' },
  summaryValue: { fontSize: FS.xl, fontWeight: FW.bold, color: COLORS.text },
  summaryLabel: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 2 },
  filterRow: { paddingHorizontal: SPACING.md, gap: SPACING.sm, paddingBottom: SPACING.md },
  chip: { borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  chipText: { fontSize: FS.sm, color: COLORS.text },
  chipTextActive: { fontWeight: FW.semibold, color: COLORS.dark },
  list: { paddingHorizontal: SPACING.md, gap: SPACING.sm },
  jobCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md },
  emojiBox: { width: 48, height: 48, borderRadius: RADIUS.lg, backgroundColor: COLORS.dark, alignItems: 'center', justifyContent: 'center' },
  emojiText: { fontSize: 22 },
  jobInfo: { flex: 1 },
  jobTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  jobTitle: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.text, flex: 1, marginRight: SPACING.sm },
  statusPill: { borderRadius: RADIUS.pill, paddingHorizontal: SPACING.sm, paddingVertical: 3 },
  statusText: { fontSize: FS.xs, fontWeight: FW.semibold },
  jobDates: { fontSize: FS.xs, color: COLORS.textMuted, marginBottom: 6 },
  jobFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  appBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  appText: { fontSize: FS.xs, color: COLORS.textSub },
  workerText: { fontSize: FS.xs, color: COLORS.textSub },
  createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, margin: SPACING.md, marginTop: SPACING.lg, padding: SPACING.md, borderRadius: RADIUS.pill, borderWidth: 1.5, borderColor: COLORS.dark, borderStyle: 'dashed' },
  createText: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.dark },
});
