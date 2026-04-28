import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, ActivityIndicator
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';
import { getJobById } from '../services/jobService';

const HERO_BG = '#001c0e';

const DEFAULT_AMENITIES = [
  { icon: 'wifi',                     label: 'Wi-Fi'   },
  { icon: 'restaurant',               label: 'Yemek'   },
  { icon: 'bus-outline',              label: 'Ulaşım'  },
  { icon: 'shield-checkmark-outline', label: 'Ekipman' },
];

export default function JobDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  // HomeStudentScreen → { jobId: 5 }
  // Diğer ekranlar   → { job: { id, title, ... } }
  const routeJob  = route?.params?.job ?? {};
  const routeJobId = route?.params?.jobId ?? routeJob.id;

  const [job, setJob] = useState(routeJob);
  const [loading, setLoading] = useState(!!routeJobId);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!routeJobId) return;
    const load = async () => {
      try {
        const data = await getJobById(routeJobId);
        setJob({
          id:          data.id,
          title:       data.title,
          description: data.description,
          location:    data.location,
          wage:        `₺${data.hourlyRate}/saat`,
          dates:       `${new Date(data.startDate).toLocaleDateString('tr-TR')} — ${new Date(data.endDate).toLocaleDateString('tr-TR')}`,
          workers:     data.requiredWorkers,
          category:    routeJob.category ?? 'İlan',
          emoji:       routeJob.emoji    ?? '🌾',
          farm:        routeJob.farm     ?? 'Çiftlik',
          rating:      routeJob.rating   ?? '—',
          reviewCount: routeJob.reviewCount ?? 0,
          amenities:   DEFAULT_AMENITIES,
        });
      } catch (e) {
        console.error('JobDetailScreen load error:', e);
        // Hata durumunda route'dan gelen veriyle devam et
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [routeJobId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.lime} />
        </View>
      </SafeAreaView>
    );
  }

  const amenities = job.amenities ?? DEFAULT_AMENITIES;

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>İlan Detayı</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── HERO ── */}
        <View style={styles.heroCard}>
          {/* Kategori pill */}
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{job.category}</Text>
          </View>

          {/* Emoji / görsel */}
          <Text style={styles.heroEmoji}>{job.emoji}</Text>

          {/* Favori butonu */}
          <Pressable
            style={styles.heartBtn}
            onPress={() => setLiked(l => !l)}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={20}
              color={liked ? COLORS.error : COLORS.text}
            />
          </Pressable>
        </View>

        {/* ── BAŞLIK ── */}
        <View style={styles.titleRow}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <View style={styles.ratingWrap}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.ratingText}>
              {job.rating} ({job.reviewCount})
            </Text>
          </View>
        </View>
        <Text style={styles.farmName}>{job.farm}</Text>

        {/* ── 3 BİLGİ KARTI ── */}
        <View style={styles.infoRow}>
          <InfoCard
            icon={<Ionicons name="location-outline" size={20} color={COLORS.dark} />}
            value={job.location}
            label="Konum"
            highlight={false}
          />
          <InfoCard
            icon={null}
            value={job.wage}
            label="Ücret"
            highlight
          />
          <InfoCard
            icon={<Ionicons name="calendar-outline" size={20} color={COLORS.dark} />}
            value={job.dates}
            label="Tarih"
            highlight={false}
          />
        </View>

        {/* ── İMKÂNLAR ── */}
        <Text style={styles.sectionTitle}>İmkânlar</Text>
        <View style={styles.amenitiesRow}>
          {amenities.map(a => (
            <View key={a.label} style={styles.amenityCard}>
              <Ionicons name={a.icon} size={22} color={COLORS.dark} />
              <Text style={styles.amenityLabel}>{a.label}</Text>
            </View>
          ))}
        </View>

        {/* ── AÇIKLAMA ── */}
        <Text style={styles.sectionTitle}>Açıklama</Text>
        <Text style={styles.description}>{job.description}</Text>

        {/* Alttaki buton için boşluk */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── ALT BAR ── */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.chatBtn}>
          <Ionicons name="chatbubble-outline" size={22} color={COLORS.dark} />
        </Pressable>
        <Pressable
          style={styles.applyBtn}
          onPress={() => navigation?.navigate('ApplyJob', { job })}
        >
          <Text style={styles.applyText}>Başvur</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function InfoCard({ icon, value, label, highlight }) {
  return (
    <View style={[styles.infoCard, highlight && styles.infoCardHighlight]}>
      {icon}
      <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]}>
        {value}
      </Text>
      <Text style={[styles.infoLabel, highlight && styles.infoLabelHighlight]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  // ── ÜST BAR ──
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
  pageTitle: {
    fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text
  },

  // ── İÇERİK ──
  content: { paddingHorizontal: SPACING.md },

  // ── HERO ──
  heroCard: {
    backgroundColor: HERO_BG,
    borderRadius: RADIUS.xl,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    overflow: 'hidden',
    position: 'relative'
  },
  categoryPill: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: COLORS.lime,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2
  },
  categoryText: {
    fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.dark
  },
  heroEmoji: {
    fontSize: 96
  },
  heartBtn: {
    position: 'absolute',
    bottom: SPACING.md,
    right: SPACING.md,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3
  },

  // ── BAŞLIK ──
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs
  },
  jobTitle: {
    fontSize: FS.xxl, fontWeight: FW.bold,
    color: COLORS.text, flex: 1, lineHeight: 30
  },
  ratingWrap: {
    flexDirection: 'row', alignItems: 'center',
    gap: 4, marginLeft: SPACING.sm, marginTop: 4
  },
  ratingText: {
    fontSize: FS.sm, fontWeight: FW.medium, color: COLORS.textSub
  },
  farmName: {
    fontSize: FS.md, color: COLORS.textSub,
    marginBottom: SPACING.md
  },

  // ── 3 BİLGİ KARTI ──
  infoRow: {
    flexDirection: 'row', gap: SPACING.sm,
    marginBottom: SPACING.lg
  },
  infoCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 80
  },
  infoCardHighlight: {
    backgroundColor: COLORS.limeSoft,
    borderColor: COLORS.lime
  },
  infoValue: {
    fontSize: FS.md, fontWeight: FW.bold,
    color: COLORS.text, textAlign: 'center'
  },
  infoValueHighlight: {
    fontSize: FS.lg, color: COLORS.dark
  },
  infoLabel: {
    fontSize: FS.xs, color: COLORS.textMuted, textAlign: 'center'
  },
  infoLabelHighlight: {
    color: COLORS.dark
  },

  // ── İMKÂNLAR ──
  sectionTitle: {
    fontSize: FS.lg, fontWeight: FW.bold,
    color: COLORS.text, marginBottom: SPACING.sm
  },
  amenitiesRow: {
    flexDirection: 'row', gap: SPACING.sm,
    marginBottom: SPACING.lg
  },
  amenityCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  amenityLabel: {
    fontSize: FS.xs, fontWeight: FW.medium,
    color: COLORS.textSub, textAlign: 'center'
  },

  // ── AÇIKLAMA ──
  description: {
    fontSize: FS.md, color: COLORS.textSub,
    lineHeight: 24
  },

  // ── ALT BAR ──
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.lg
  },
  chatBtn: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center'
  },
  applyBtn: {
    flex: 1, backgroundColor: COLORS.dark,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center'
  },
  applyText: {
    fontSize: FS.md, fontWeight: FW.bold, color: COLORS.textOnDark
  }
});
