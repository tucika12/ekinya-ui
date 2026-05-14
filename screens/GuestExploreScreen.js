import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';
import { getOpenJobs } from '../services/jobService';

const filters = ['Yakın', 'Bugün', 'Yüksek ücret', 'Hasat', 'Bakım'];

export default function GuestExploreScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await getOpenJobs();
        const mapped = (data || []).map((j) => ({
          id: j.id,
          title: j.title,
          farm: 'Çiftlik',
          location: j.location ?? '',
          distance: '',
          rating: '—',
          wage: `₺${j.hourlyRate}/saat`,
          dates: `${new Date(j.startDate).toLocaleDateString('tr-TR')} - ${new Date(j.endDate).toLocaleDateString('tr-TR')}`,
          workers: j.requiredWorkers,
        }));
        setJobs(mapped);
      } catch (e) {
        console.error('GuestExploreScreen load error:', e);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const toggleBookmark = (id) =>
    setBookmarks((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id]));

  const q = search.trim().toLowerCase();
  const visibleJobs = q
    ? jobs.filter(
        (j) =>
          (j.title && j.title.toLowerCase().includes(q)) ||
          (j.location && j.location.toLowerCase().includes(q))
      )
    : jobs;

  if (loading) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]} edges={['top']}>
        <ActivityIndicator size="large" color={COLORS.lime} />
        <Text style={styles.loadingText}>İlanlar yükleniyor…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroEyebrow}>KEŞFET</Text>
              <Text style={styles.heroTitle}>Açık ilanlar</Text>
              <Text style={styles.heroSub}>Giriş yapmadan göz at; hesabın onaylanınca başvurabilirsin.</Text>
            </View>
            <Pressable style={styles.loginPill} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginPillText}>Giriş yap</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.topBar}>
          <Text style={styles.pageTitle}>İlanlar</Text>
          <Pressable onPress={() => navigation.navigate('Filter')} hitSlop={8}>
            <Ionicons name="options-outline" size={24} color={COLORS.text} />
          </Pressable>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="İş ara…"
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {filters.map((f) => (
            <Pressable
              key={f}
              style={[styles.chip, activeFilter === f && styles.chipActive]}
              onPress={() => setActiveFilter(activeFilter === f ? null : f)}
            >
              <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.countRow}>
          <Text style={styles.countText}>{visibleJobs.length} ilan bulundu</Text>
        </View>

        <View style={styles.list}>
          {visibleJobs.map((job) => (
            <Pressable
              key={job.id}
              style={styles.jobCard}
              onPress={() => navigation.navigate('JobDetail', { job, guest: true })}
            >
              <View style={styles.jobImage}>
                <View style={styles.wagePill}>
                  <Text style={styles.wageText}>{job.wage}</Text>
                </View>
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
                  <Text style={styles.jobTitle} numberOfLines={1}>
                    {job.title}
                  </Text>
                  <Text style={styles.jobRating}>{job.rating}</Text>
                </View>
                <View style={styles.farmRow}>
                  <Text style={styles.farmName}>{job.farm}</Text>
                  <Ionicons name="checkmark-circle" size={12} color={COLORS.success} style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.jobMeta}>
                  {job.location} · {job.distance}
                </Text>
                <Text style={styles.jobMeta}>{job.dates}</Text>
              </View>

              <View style={styles.jobFooter}>
                <Text style={styles.jobWageFooter}>{job.wage}</Text>
                <Text style={styles.jobWorkers}>İhtiyaç: {job.workers} işçi</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.bottomCta} onPress={() => navigation.navigate('Welcome')}>
          <Text style={styles.bottomCtaText}>Ana sayfaya dön</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: SPACING.md, fontSize: FS.sm, color: COLORS.textSub },
  content: { paddingBottom: SPACING.xxl },
  hero: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: SPACING.md },
  heroEyebrow: {
    fontSize: FS.xs,
    fontWeight: FW.bold,
    color: COLORS.lime,
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroTitle: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.textOnDark, marginBottom: 6 },
  heroSub: { fontSize: FS.sm, color: 'rgba(255,255,255,0.78)', lineHeight: 20, flexShrink: 1 },
  loginPill: {
    backgroundColor: COLORS.lime,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
  },
  loginPillText: { fontSize: FS.sm, fontWeight: FW.bold, color: COLORS.dark },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    paddingTop: SPACING.sm,
  },
  pageTitle: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.text },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: '#ECF0FF',
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  searchInput: { flex: 1, fontSize: FS.md, color: COLORS.text },
  filtersRow: { paddingHorizontal: SPACING.md, gap: SPACING.sm, paddingBottom: SPACING.sm },
  chip: {
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  chipText: { fontSize: FS.sm, color: COLORS.text },
  chipTextActive: { fontWeight: FW.semibold, color: COLORS.dark },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  countText: { fontSize: FS.sm, color: COLORS.textSub },
  list: { paddingHorizontal: SPACING.md, gap: SPACING.md },
  jobCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  jobImage: {
    height: 160,
    backgroundColor: '#D8EDD8',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.sm,
  },
  wagePill: {
    backgroundColor: COLORS.lime,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  wageText: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.dark },
  bookmarkBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobContent: { padding: SPACING.md },
  jobTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  jobTitle: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.text, flex: 1 },
  jobRating: { fontSize: FS.sm, color: COLORS.textSub },
  farmRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  farmName: { fontSize: FS.xs, color: COLORS.textSub },
  jobMeta: { fontSize: FS.xs, color: COLORS.textMuted, marginTop: 2 },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SPACING.sm + 4,
    paddingHorizontal: SPACING.md,
  },
  jobWageFooter: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.lime },
  jobWorkers: { fontSize: FS.xs, color: COLORS.textSub },
  bottomCta: { alignItems: 'center', marginTop: SPACING.lg, paddingVertical: SPACING.md },
  bottomCtaText: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.textMuted },
});
