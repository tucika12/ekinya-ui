import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';
import { getMyJobs, getApplicantsForJob } from '../services/jobService';

const FILTERS = ['Tümü', 'Aktif', 'Dolu', 'Tamamlanan', 'Taslak'];

const STATUS_META = {
  active:    { label: 'Aktif',      bg: COLORS.limeSoft,  color: COLORS.success },
  full:      { label: 'Dolu',       bg: '#FFF3E0',        color: COLORS.warning },
  completed: { label: 'Tamamlandı', bg: '#ECF0FF',        color: '#3D5AFE' },
  draft:     { label: 'Taslak',     bg: COLORS.surface,   color: COLORS.textSub },
};

export default function FarmerMyJobsScreen({ navigation, tabNavigation }) {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Tümü');

  useEffect(() => {
    if (isFocused) {
      loadJobs();
    }
  }, [isFocused]);

  const loadJobs = async () => {
    try {
      const data = await getMyJobs();

      // Her ilanın başvuru sayısını paralel çek
      const countPromises = data.map(j =>
        getApplicantsForJob(j.id)
          .then(list => ({ id: j.id, count: list.length }))
          .catch(() => ({ id: j.id, count: 0 }))
      );
      const counts = await Promise.all(countPromises);
      const countMap = Object.fromEntries(counts.map(x => [x.id, x.count]));

      const mapped = data.map(j => ({
        id: j.id,
        title: j.title,
        dates: `${new Date(j.startDate).toLocaleDateString()} - ${new Date(j.endDate).toLocaleDateString()}`,
        wage: `₺${j.hourlyRate}/saat`,
        applications: countMap[j.id] ?? 0,
        status: j.jobStatus === 'open' ? 'active' : j.jobStatus,
        workers: j.requiredWorkers,
        raw: j
      }));
      setJobs(mapped);
    } catch (e) {
      console.log('Error loading farmer jobs:', e);
      Alert.alert('Hata', 'İlanlar yüklenemedi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadJobs();
  }, []);

  const filtered = jobs.filter(j => {
    if (activeFilter === 'Tümü') return true;
    if (activeFilter === 'Aktif') return j.status === 'active';
    if (activeFilter === 'Dolu') return j.status === 'full';
    if (activeFilter === 'Tamamlanan') return j.status === 'completed';
    if (activeFilter === 'Taslak') return j.status === 'draft';
    return true;
  });

  return (
    <View style={styles.screen}>
      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => {
          // Tab içinde açıldıysa home'a dön, Stack'ten açıldıysa goBack
          if (tabNavigation?.setActiveTab) {
            tabNavigation.setActiveTab('home');
          } else {
            navigation?.goBack?.();
          }
        }}>
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

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.lime]} />
        }
      >
        {loading && !refreshing ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.lime} />
          </View>
        ) : (
          <>
            {/* ── ÖZET ── */}
            <View style={styles.summaryRow}>
              {[
                { value: jobs.filter(j => j.status === 'active').length.toString(), label: 'Aktif' },
                { value: jobs.reduce((s, j) => s + j.applications, 0).toString(), label: 'Başvuru' },
                { value: jobs.filter(j => j.status === 'completed').length.toString(), label: 'Tamamlanan' },
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
              {filtered.length === 0 ? (
                <Text style={{ textAlign: 'center', color: COLORS.textMuted, marginTop: 20 }}>
                  Bu kriterlere uygun ilanınız yok.
                </Text>
              ) : (
                filtered.map(job => {
                  const meta = STATUS_META[job.status] || STATUS_META.draft;
                  return (
                    <Pressable
                      key={job.id}
                      style={styles.jobCard}
                      onPress={() => navigation?.navigate?.('FarmerApplicants', { job })}
                    >
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
                })
              )}
            </View>

            {/* ── YENİ İLAN CTA ── */}
            <Pressable style={styles.createBtn} onPress={() => navigation?.navigate?.('CreateJob')}>
              <Ionicons name="add-circle-outline" size={20} color={COLORS.dark} />
              <Text style={styles.createText}>Yeni ilan oluştur</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: 40 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, },
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
