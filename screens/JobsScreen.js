import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const filters = ['Yakın', 'Bugün', 'Yüksek ücret', 'Hasat', 'Bakım'];
const mockJobs = [
  { id: 1, title: 'Zeytin Toplama', farm: 'Kaya Çiftliği', location: 'Aydın · Nazilli', distance: '2.3 km', rating: '4.8', wage: '₺600/gün', dates: '15-25 Mayıs', workers: 7 },
  { id: 2, title: 'Domates Hasadı', farm: 'Demir Tarım', location: 'Antalya · Serik', distance: '5.1 km', rating: '4.6', wage: '₺550/gün', dates: '10-20 Mayıs', workers: 5 },
  { id: 3, title: 'Fidan Dikimi', farm: 'Yeşil Tarla', location: 'İzmir · Torbalı', distance: '3.8 km', rating: '4.9', wage: '₺500/gün', dates: '20-28 Mayıs', workers: 4 },
  { id: 4, title: 'Çilek Hasadı', farm: 'Akdeniz Tarım', location: 'Mersin · Tarsus', distance: '8.2 km', rating: '4.5', wage: '₺580/gün', dates: '1-10 Mayıs', workers: 10 },
  { id: 5, title: 'Üzüm Bağbozumu', farm: 'Ege Bağları', location: 'Manisa · Alaşehir', distance: '12 km', rating: '4.7', wage: '₺650/gün', dates: '5-15 Eylül', workers: 6 },
];

export default function JobsScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  const toggleBookmark = (id) =>
    setBookmarks(b => b.includes(id) ? b.filter(x => x !== id) : [...b, id]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* ── ÜST BAR ── */}
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>İlanlar</Text>
        <Pressable onPress={() => navigation?.navigate('Filter')}>
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
        {filters.map(f => (
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
        <Text style={styles.countText}>127 ilan bulundu</Text>
        <Pressable><Text style={styles.sortText}>Yakınlık ↓</Text></Pressable>
      </View>

      {/* ── JOB LİSTESİ ── */}
      <View style={styles.list}>
        {mockJobs.map(job => (
          <Pressable
            key={job.id}
            style={styles.jobCard}
            onPress={() => navigation?.navigate?.('JobDetail', { job })}
          >
            {/* Resim alanı */}
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

            {/* İçerik */}
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

            {/* Alt bar */}
            <View style={styles.jobFooter}>
              <Text style={styles.jobWageFooter}>{job.wage}</Text>
              <Text style={styles.jobWorkers}>İhtiyaç: {job.workers} işçi</Text>
            </View>
          </Pressable>
        ))}
      </View>

    </ScrollView>
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
  jobWorkers: { fontSize: FS.xs, color: COLORS.textSub }
});
