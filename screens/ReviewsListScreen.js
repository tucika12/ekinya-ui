import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Pressable, ScrollView, ActivityIndicator
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';
import { getReviewsByUser } from '../services/reviewService';
import { getStoredUser } from '../services/authService';

const FILTER_TABS = ['Tümü', '5★', '4★', '3★ ve altı'];

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

function computeDistribution(reviews) {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => { if (counts[r.rating] !== undefined) counts[r.rating]++; });
  const total = reviews.length || 1;
  return [5, 4, 3, 2, 1].map(star => ({
    star,
    count: counts[star],
    pct: counts[star] / total,
  }));
}

function computeAverage(reviews) {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function ReviewsListScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // revieweeId route'dan gelebilir (başka kullanıcının profili) veya kendi profili
  const revieweeId = route?.params?.revieweeId ?? null;

  useEffect(() => {
    const load = async () => {
      try {
        let targetId = revieweeId;
        if (!targetId) {
          const user = await getStoredUser();
          targetId = user?.id;
        }
        if (!targetId) return;
        const data = await getReviewsByUser(targetId);
        setReviews(data);
      } catch (e) {
        console.error('ReviewsListScreen load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [revieweeId]);

  const filtered = activeFilter === 'Tümü'
    ? reviews
    : activeFilter === '5★'
      ? reviews.filter(r => r.rating === 5)
      : activeFilter === '4★'
        ? reviews.filter(r => r.rating === 4)
        : reviews.filter(r => r.rating <= 3);

  const distribution = computeDistribution(reviews);
  const average = computeAverage(reviews);

  const renderItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewAvatar}>
          <Text style={styles.avatarText}>
            {String(item.reviewerId ?? '?').slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <View style={styles.reviewMeta}>
          <Text style={styles.reviewerName}>Kullanıcı #{item.reviewerId}</Text>
          <Text style={styles.reviewDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <StarDisplay rating={item.rating} />
      </View>
      {!!item.comment && (
        <Text style={styles.reviewComment}>{item.comment}</Text>
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

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.lime} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              {/* ── ÖZET KARTI ── */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryLeft}>
                  <Text style={styles.bigRating}>{average.toFixed(1)}</Text>
                  <StarDisplay rating={Math.round(average)} size={18} />
                  <Text style={styles.reviewCount}>{reviews.length} değerlendirme</Text>
                </View>
                <View style={styles.summaryRight}>
                  {distribution.map(d => (
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center'
  },
  pageTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  listContent: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl, gap: SPACING.sm },
  summaryCard: {
    flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg,
    marginBottom: SPACING.md, gap: SPACING.md
  },
  summaryLeft: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  bigRating: { fontSize: 42, fontWeight: FW.bold, color: COLORS.text },
  reviewCount: { fontSize: FS.xs, color: COLORS.textSub },
  summaryRight: { flex: 1, gap: 6, justifyContent: 'center' },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  distStar: { fontSize: FS.xs, color: COLORS.textSub, width: 10, textAlign: 'right' },
  distBarBg: {
    flex: 1, height: 6, backgroundColor: COLORS.border,
    borderRadius: RADIUS.pill, flexDirection: 'row', overflow: 'hidden'
  },
  distBarFill: { backgroundColor: COLORS.lime },
  distCount: { fontSize: FS.xs, color: COLORS.textMuted, width: 14, textAlign: 'right' },
  filtersWrap: { gap: SPACING.sm, paddingBottom: SPACING.md },
  filterChip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill, backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border
  },
  filterChipActive: { backgroundColor: COLORS.dark, borderColor: COLORS.dark },
  filterText: { fontSize: FS.sm, fontWeight: FW.medium, color: COLORS.textSub },
  filterTextActive: { color: COLORS.textOnDark, fontWeight: FW.bold },
  reviewCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, gap: SPACING.sm
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  reviewAvatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.limeSoft,
    alignItems: 'center', justifyContent: 'center'
  },
  avatarText: { fontSize: FS.sm, fontWeight: FW.bold, color: COLORS.dark },
  reviewMeta: { flex: 1 },
  reviewerName: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.text },
  reviewDate: { fontSize: FS.xs, color: COLORS.textMuted },
  reviewComment: { fontSize: FS.sm, color: COLORS.textSub, lineHeight: 20 },
  empty: { alignItems: 'center', marginTop: 60, gap: SPACING.md },
  emptyText: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.textSub }
});
