import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Pressable, ScrollView
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const FILTER_TABS = ['Tümü', '5★', '4★', '3★ ve altı'];

const MOCK_REVIEWS = [
  { id: '1', name: 'Mehmet K.', rating: 5, comment: 'Çok çalışkan ve güvenilir bir işçi. Zamanında geldi, işini eksiksiz yaptı.', tags: ['Profesyonel', 'Vaktinde geldi'], date: '22 Nisan 2025' },
  { id: '2', name: 'Ayşe T.', rating: 5, comment: 'Mükemmel bir deneyimdi. Ekip çalışmasına çok uyumlu.', tags: ['Saygılı', 'Açık iletişim'], date: '18 Nisan 2025' },
  { id: '3', name: 'Hasan D.', rating: 4, comment: 'Genel olarak iyi bir iş çıkardı. Biraz daha hızlı olabilirdi.', tags: ['Güvenilir'], date: '10 Nisan 2025' },
  { id: '4', name: 'Fatma Y.', rating: 5, comment: 'Harika bir çalışan! Kesinlikle tekrar çalışırım.', tags: ['Profesyonel', 'Güvenli ortam'], date: '5 Nisan 2025' },
  { id: '5', name: 'Ali R.', rating: 4, comment: 'İyi bir deneyimdi, işini biliyor.', tags: ['Saygılı'], date: '28 Mart 2025' },
  { id: '6', name: 'Zeynep S.', rating: 3, comment: 'Ortalamanın biraz üzerinde. Geliştirilecek yönleri var.', tags: [], date: '20 Mart 2025' },
  { id: '7', name: 'İbrahim Ç.', rating: 5, comment: 'Çok memnun kaldım. Titiz ve dikkatli çalışır.', tags: ['Vaktinde ödedi', 'Açık iletişim'], date: '15 Mart 2025' },
  { id: '8', name: 'Elif B.', rating: 4, comment: 'Gayet iyi bir işçi. Tavsiye ederim.', tags: ['Profesyonel'], date: '8 Mart 2025' },
];

const DISTRIBUTION = [
  { star: 5, count: 5, pct: 0.63 },
  { star: 4, count: 2, pct: 0.25 },
  { star: 3, count: 1, pct: 0.12 },
  { star: 2, count: 0, pct: 0 },
  { star: 1, count: 0, pct: 0 },
];

function StarDisplay({ rating, size = 14 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={size}
          color={i <= rating ? '#F59E0B' : '#CCC'}
        />
      ))}
    </View>
  );
}

export default function ReviewsListScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('Tümü');

  const filtered = activeFilter === 'Tümü'
    ? MOCK_REVIEWS
    : activeFilter === '5★'
      ? MOCK_REVIEWS.filter(r => r.rating === 5)
      : activeFilter === '4★'
        ? MOCK_REVIEWS.filter(r => r.rating === 4)
        : MOCK_REVIEWS.filter(r => r.rating <= 3);

  const renderItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewAvatar}>
          <Text style={styles.avatarText}>{item.name.slice(0, 2).toUpperCase()}</Text>
        </View>
        <View style={styles.reviewMeta}>
          <Text style={styles.reviewerName}>{item.name}</Text>
          <Text style={styles.reviewDate}>{item.date}</Text>
        </View>
        <StarDisplay rating={item.rating} />
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
      {item.tags.length > 0 && (
        <View style={styles.reviewTags}>
          {item.tags.map(t => (
            <View key={t} style={styles.tagChip}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>Değerlendirmeler</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* ── ÖZET KARTI ── */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryLeft}>
                <Text style={styles.bigRating}>4.8</Text>
                <StarDisplay rating={5} size={18} />
                <Text style={styles.reviewCount}>237 değerlendirme</Text>
              </View>
              <View style={styles.summaryRight}>
                {DISTRIBUTION.map(d => (
                  <View key={d.star} style={styles.distRow}>
                    <Text style={styles.distStar}>{d.star}</Text>
                    <View style={styles.distBarBg}>
                      <View style={[styles.distBarFill, { flex: d.pct }]} />
                      <View style={{ flex: 1 - d.pct }} />
                    </View>
                    <Text style={styles.distCount}>{d.count}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* ── FİLTRE ── */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersWrap}
            >
              {FILTER_TABS.map(tab => (
                <Pressable
                  key={tab}
                  style={[styles.filterChip, activeFilter === tab && styles.filterChipActive]}
                  onPress={() => setActiveFilter(tab)}
                >
                  <Text style={[styles.filterText, activeFilter === tab && styles.filterTextActive]}>
                    {tab}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="star-outline" size={36} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Henüz değerlendirme yok</Text>
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

  listContent: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl, gap: SPACING.sm },

  // ── ÖZET ──
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.md
  },
  summaryLeft: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6
  },
  bigRating: { fontSize: 42, fontWeight: FW.bold, color: COLORS.text },
  reviewCount: { fontSize: FS.xs, color: COLORS.textSub },
  summaryRight: {
    flex: 1, gap: 6, justifyContent: 'center'
  },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  distStar: { fontSize: FS.xs, color: COLORS.textSub, width: 10, textAlign: 'right' },
  distBarBg: {
    flex: 1, height: 6, backgroundColor: COLORS.border,
    borderRadius: RADIUS.pill, flexDirection: 'row', overflow: 'hidden'
  },
  distBarFill: { backgroundColor: COLORS.lime },
  distCount: { fontSize: FS.xs, color: COLORS.textMuted, width: 14, textAlign: 'right' },

  // ── FİLTRE ──
  filtersWrap: { gap: SPACING.sm, paddingBottom: SPACING.md },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border
  },
  filterChipActive: { backgroundColor: COLORS.dark, borderColor: COLORS.dark },
  filterText: { fontSize: FS.sm, fontWeight: FW.medium, color: COLORS.textSub },
  filterTextActive: { color: COLORS.textOnDark, fontWeight: FW.bold },

  // ── KART ──
  reviewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.sm
  },
  reviewHeader: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm
  },
  reviewAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.limeSoft,
    alignItems: 'center', justifyContent: 'center'
  },
  avatarText: { fontSize: FS.sm, fontWeight: FW.bold, color: COLORS.dark },
  reviewMeta: { flex: 1 },
  reviewerName: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.text },
  reviewDate: { fontSize: FS.xs, color: COLORS.textMuted },
  reviewComment: { fontSize: FS.sm, color: COLORS.textSub, lineHeight: 20 },
  reviewTags: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  tagChip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.limeSoft
  },
  tagText: { fontSize: FS.xs, color: COLORS.dark, fontWeight: FW.medium },

  // ── EMPTY ──
  empty: { alignItems: 'center', marginTop: 60, gap: SPACING.md },
  emptyText: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.textSub }
});
