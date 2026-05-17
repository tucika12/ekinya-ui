import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  TextInput, ActivityIndicator, Modal, Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';
import { getOpenJobs } from '../services/jobService';

const QUICK_FILTERS = ['Yakın', 'Bugün', 'Yüksek ücret', 'Hasat', 'Bakım'];
const JOB_TYPES     = ['Hasat', 'Paketleme', 'Bakım', 'Sulama', 'Fidan dikimi', 'Diğer'];
const DISTANCES     = ['5 km', '10 km', '25 km', 'Tümü'];

export default function JobsScreen({ navigation }) {
  const [activeFilter, setActiveFilter]   = useState(null);
  const [bookmarks, setBookmarks]         = useState([]);
  const [jobs, setJobs]                   = useState([]);
  const [loading, setLoading]             = useState(true);

  // ── Filter modal state ──
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [minWage, setMinWage]             = useState('');
  const [maxWage, setMaxWage]             = useState('');
  const [distance, setDistance]           = useState('Tümü');
  const [onlyVerified, setOnlyVerified]   = useState(false);
  const [onlyEscrow, setOnlyEscrow]       = useState(false);

  const resetFilters = () => {
    setSelectedTypes([]);
    setMinWage('');
    setMaxWage('');
    setDistance('Tümü');
    setOnlyVerified(false);
    setOnlyEscrow(false);
  };

  const toggleType = (t) =>
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await getOpenJobs();
        const mapped = data.map(j => ({
          id: j.id,
          title: j.title,
          farm: j.farmerName || 'Çiftlik',
          location: j.location ?? '',
          distance: '',
          rating: '—',
          wage: `₺${j.hourlyRate}/saat`,
          dates: `${new Date(j.startDate).toLocaleDateString('tr-TR')} - ${new Date(j.endDate).toLocaleDateString('tr-TR')}`,
          workers: j.requiredWorkers,
        }));
        setJobs(mapped);
      } catch (e) {
        console.error('JobsScreen load error:', e);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const toggleBookmark = (id) =>
    setBookmarks(b => b.includes(id) ? b.filter(x => x !== id) : [...b, id]);

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.lime} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── ÜST BAR ── */}
        <View style={styles.topBar}>
          <Text style={styles.pageTitle}>İlanlar</Text>
          <Pressable onPress={() => setFilterVisible(true)} hitSlop={8}>
            <Ionicons name="options-outline" size={24} color={COLORS.text} />
          </Pressable>
        </View>

        {/* ── ARAMA ── */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput style={styles.searchInput} placeholder="İş ara..." placeholderTextColor={COLORS.textMuted} />
        </View>

        {/* ── FİLTRE ÇİPLERİ ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {QUICK_FILTERS.map(f => (
            <Pressable
              key={f}
              style={[styles.chip, activeFilter === f && styles.chipActive]}
              onPress={() => setActiveFilter(activeFilter === f ? null : f)}
            >
              <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── SAYAÇ SATIRI ── */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>{jobs.length} ilan bulundu</Text>
          <Pressable><Text style={styles.sortText}>Yakınlık ↓</Text></Pressable>
        </View>

        {/* ── JOB LİSTESİ ── */}
        <View style={styles.list}>
          {jobs.map(job => (
            <Pressable
              key={job.id}
              style={styles.jobCard}
              onPress={() => navigation?.navigate?.('JobDetail', { job })}
            >
              <View style={styles.jobImage}>
                <View style={styles.wagePill}><Text style={styles.wageText}>{job.wage}</Text></View>
                <Pressable style={styles.bookmarkBtn} onPress={() => toggleBookmark(job.id)}>
                  <Ionicons
                    name={bookmarks.includes(job.id) ? 'bookmark' : 'bookmark-outline'}
                    size={16}
                    color={bookmarks.includes(job.id) ? COLORS.lime : COLORS.text}
                  />
                </Pressable>
              </View>
              <View style={styles.jobContent}>
                <View style={styles.jobTitleRow}>
                  <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
                  <Text style={styles.jobRating}>⭐ {job.rating}</Text>
                </View>
                <View style={styles.farmRow}>
                  <Text style={styles.farmName}>{job.farm}</Text>
                  <Ionicons name="checkmark-circle" size={12} color={COLORS.success} style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.jobMeta}>📍 {job.location} · {job.distance}</Text>
                <Text style={styles.jobMeta}>📅 {job.dates}</Text>
              </View>
              <View style={styles.jobFooter}>
                <Text style={styles.jobWageFooter}>{job.wage}</Text>
                <Text style={styles.jobWorkers}>İhtiyaç: {job.workers} işçi</Text>
              </View>
            </Pressable>
          ))}
        </View>

      </ScrollView>

      {/* ── FİLTRE MODAL (bottom sheet) — bottom tab görünür kalır ── */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setFilterVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>

            {/* Handle */}
            <View style={styles.sheetHandle} />

            {/* Başlık */}
            <View style={styles.sheetHeader}>
              <Pressable onPress={() => { resetFilters(); }} hitSlop={8}>
                <Text style={styles.resetLink}>Sıfırla</Text>
              </Pressable>
              <Text style={styles.sheetTitle}>Filtrele</Text>
              <Pressable onPress={() => setFilterVisible(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>

              {/* İş türü */}
              <Text style={styles.sectionLabel}>İş türü</Text>
              <View style={styles.chipRow}>
                {JOB_TYPES.map(t => (
                  <Pressable
                    key={t}
                    style={[styles.chip, selectedTypes.includes(t) && styles.chipActive]}
                    onPress={() => toggleType(t)}
                  >
                    <Text style={[styles.chipText, selectedTypes.includes(t) && styles.chipTextActive]}>{t}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Ücret aralığı */}
              <Text style={styles.sectionLabel}>Ücret aralığı</Text>
              <View style={styles.wageRow}>
                <TextInput
                  style={[styles.wageInput, { flex: 1 }]}
                  value={minWage}
                  onChangeText={setMinWage}
                  placeholder="Min ₺"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                />
                <View style={styles.wageSep} />
                <TextInput
                  style={[styles.wageInput, { flex: 1 }]}
                  value={maxWage}
                  onChangeText={setMaxWage}
                  placeholder="Max ₺"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                />
              </View>

              {/* Mesafe */}
              <Text style={styles.sectionLabel}>Mesafe</Text>
              <View style={styles.distanceRow}>
                {DISTANCES.map(d => (
                  <Pressable
                    key={d}
                    style={[styles.distChip, distance === d && styles.chipActive]}
                    onPress={() => setDistance(d)}
                  >
                    <Text style={[styles.chipText, distance === d && styles.chipTextActive]}>{d}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Doğrulama */}
              <Text style={styles.sectionLabel}>Doğrulama</Text>
              <View style={styles.switchGroup}>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Sadece doğrulanmış çiftçiler</Text>
                  <Switch
                    value={onlyVerified}
                    onValueChange={setOnlyVerified}
                    trackColor={{ false: COLORS.border, true: COLORS.lime }}
                    thumbColor={onlyVerified ? COLORS.dark : COLORS.surface}
                  />
                </View>
                <View style={[styles.switchRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.switchLabel}>Sadece escrow ile ödeme</Text>
                  <Switch
                    value={onlyEscrow}
                    onValueChange={setOnlyEscrow}
                    trackColor={{ false: COLORS.border, true: COLORS.lime }}
                    thumbColor={onlyEscrow ? COLORS.dark : COLORS.surface}
                  />
                </View>
              </View>

              <View style={{ height: 16 }} />
            </ScrollView>

            {/* Uygula butonu */}
            <Pressable style={styles.applyBtn} onPress={() => setFilterVisible(false)}>
              <Text style={styles.applyText}>Filtrele</Text>
            </Pressable>

          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: SPACING.xxl },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, paddingTop: SPACING.lg },
  pageTitle: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.text },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: '#ECF0FF', borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: 12, marginHorizontal: SPACING.md, marginBottom: SPACING.sm },
  searchInput: { flex: 1, fontSize: FS.md, color: COLORS.text },
  filtersRow: { paddingHorizontal: SPACING.md, gap: SPACING.sm, paddingBottom: SPACING.sm },
  chip: { borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  chipText: { fontSize: FS.sm, color: COLORS.text },
  chipTextActive: { fontWeight: FW.semibold, color: COLORS.dark },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  countText: { fontSize: FS.sm, color: COLORS.textSub },
  sortText: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.text },
  list: { paddingHorizontal: SPACING.md, gap: SPACING.md },
  jobCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  jobImage: { height: 160, backgroundColor: '#D8EDD8', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-start', padding: SPACING.sm },
  wagePill: { backgroundColor: COLORS.lime, borderRadius: RADIUS.pill, paddingHorizontal: 10, paddingVertical: 5 },
  wageText: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.dark },
  bookmarkBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  jobContent: { padding: SPACING.md },
  jobTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  jobTitle: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.text, flex: 1 },
  jobRating: { fontSize: FS.sm, color: COLORS.textSub },
  farmRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  farmName: { fontSize: FS.xs, color: COLORS.textSub },
  jobMeta: { fontSize: FS.xs, color: COLORS.textMuted, marginTop: 2 },
  jobFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.border, padding: SPACING.sm + 4, paddingHorizontal: SPACING.md },
  jobWageFooter: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.lime },
  jobWorkers: { fontSize: FS.xs, color: COLORS.textSub },

  // ── Modal ──
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 32,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  sheetTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  resetLink: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.lime },
  sheetContent: { paddingHorizontal: SPACING.md },
  sectionLabel: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  wageRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  wageInput: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: 14, fontSize: FS.md, color: COLORS.text },
  wageSep: { width: 16, height: 2, backgroundColor: COLORS.border },
  distanceRow: { flexDirection: 'row', gap: SPACING.sm },
  distChip: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  switchGroup: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  switchLabel: { fontSize: FS.md, fontWeight: FW.medium, color: COLORS.text, flex: 1 },
  applyBtn: { backgroundColor: COLORS.dark, borderRadius: RADIUS.pill, paddingVertical: SPACING.md + 2, alignItems: 'center', marginHorizontal: SPACING.md, marginTop: SPACING.sm },
  applyText: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.textOnDark },
});
