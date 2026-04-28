import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';
import { getStudents } from '../services/studentService';

const FILTERS = ['Tümü', 'Müsait', 'Yakın', 'Deneyimli', 'Yüksek Puan'];

const SKILL_COLORS = {
  'Hasat': '#D8F0D8',
  'Fidan Dikimi': '#D8E8FF',
  'Sulama': '#D8F8FF',
  'Budama': '#FFE8D8',
  'İlaçlama': '#FFD8D8',
  'Paketleme': '#F0D8FF',
  'Tarım': '#E8E8E8'
};

export default function FarmerDiscoverScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'Ö';
    const p = name.trim().split(' ');
    if (p.length > 1) return (p[0][0] + p[1][0]).toUpperCase();
    return p[0][0].toUpperCase();
  };

  const loadStudents = async () => {
    try {
      const data = await getStudents();
      const mapped = data.map(s => ({
        id: s.id,
        initials: getInitials(s.name),
        name: s.name || 'Öğrenci',
        uni: s.universityName || 'Üniversite Belirtilmemiş',
        skills: ['Tarım'], // Şimdilik backend'den beceriler gelmiyor
        rating: s.reliabilityScore != null ? s.reliabilityScore.toFixed(1) : '0.0',
        jobs: 0,
        dist: 'Yakın',
        available: true
      }));
      setStudents(mapped);
    } catch (e) {
      console.log('Error fetching students:', e);
      Alert.alert('Hata', 'Öğrenciler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(w => {
    const matchSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.uni.toLowerCase().includes(search.toLowerCase()) ||
      w.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));

    if (activeFilter === 'Müsait') return matchSearch && w.available;
    if (activeFilter === 'Yakın') return matchSearch && w.dist === 'Yakın';
    if (activeFilter === 'Deneyimli') return matchSearch && w.jobs >= 10;
    if (activeFilter === 'Yüksek Puan') return matchSearch && parseFloat(w.rating) >= 4.7;
    return matchSearch;
  });

  return (
    <View style={styles.screen}>

      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <View style={styles.titleBlock}>
          <Text style={styles.pageTitle}>İşçi Keşfet</Text>
          <Text style={styles.pageSubtitle}>{filtered.length} öğrenci bulundu</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* ── ARAMA ── */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="İsim, üniversite veya beceri ara..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </Pressable>
        )}
      </View>

      {/* ── FİLTRE ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
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

      {/* ── İŞÇİ LİSTESİ ── */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.lime} />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={44} color={COLORS.border} />
              <Text style={styles.emptyTitle}>Sonuç bulunamadı</Text>
              <Text style={styles.emptyDesc}>Farklı bir arama veya filtre deneyin</Text>
            </View>
          ) : (
            filtered.map(w => (
              <Pressable key={w.id} style={styles.card}>
                {/* Üst satır */}
                <View style={styles.cardTop}>
                  <View style={styles.avatarWrap}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{w.initials}</Text>
                    </View>
                    {w.available && <View style={styles.availableDot} />}
                  </View>

                  <View style={styles.info}>
                    <Text style={styles.name}>{w.name}</Text>
                    <Text style={styles.uni}>{w.uni}</Text>

                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <Ionicons name="star" size={11} color="#F5A623" />
                        <Text style={styles.metaText}>{w.rating}</Text>
                      </View>
                      <Text style={styles.metaDot}>·</Text>
                      <Text style={styles.metaText}>{w.jobs} iş tamamlandı</Text>
                      <Text style={styles.metaDot}>·</Text>
                      <Ionicons name="location-outline" size={11} color={COLORS.textMuted} />
                      <Text style={styles.metaText}>{w.dist}</Text>
                    </View>
                  </View>

                  <View style={[styles.statusPill, { backgroundColor: w.available ? COLORS.limeSoft : '#F0F0F0' }]}>
                    <Text style={[styles.statusText, { color: w.available ? COLORS.success : COLORS.textMuted }]}>
                      {w.available ? 'Müsait' : 'Meşgul'}
                    </Text>
                  </View>
                </View>

                {/* Beceriler */}
                <View style={styles.skillsRow}>
                  {w.skills.map(s => (
                    <View key={s} style={[styles.skillChip, { backgroundColor: SKILL_COLORS[s] ?? '#E8E8E8' }]}>
                      <Text style={styles.skillText}>{s}</Text>
                    </View>
                  ))}
                </View>

                {/* Aksiyon */}
                <View style={styles.cardActions}>
                  <Pressable
                    style={styles.msgBtn}
                    onPress={() => navigation?.navigate?.('ChatDetail', { thread: { name: w.name, initials: w.initials } })}
                  >
                    <Ionicons name="chatbubble-outline" size={15} color={COLORS.text} />
                    <Text style={styles.msgBtnText}>Mesaj gönder</Text>
                  </Pressable>
                  <Pressable style={styles.inviteBtn}>
                    <Ionicons name="add" size={15} color={COLORS.dark} />
                    <Text style={styles.inviteBtnText}>İlana davet et</Text>
                  </Pressable>
                </View>
              </Pressable>
            ))
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  titleBlock: { flex: 1, alignItems: 'center' },
  pageTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  pageSubtitle: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 1 },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    marginHorizontal: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    marginBottom: SPACING.sm,
  },
  searchIcon: { marginRight: SPACING.sm },
  searchInput: { flex: 1, fontSize: FS.md, color: COLORS.text },

  filterRow: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  chip: {
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  chipText: { fontSize: FS.sm, color: COLORS.text },
  chipTextActive: { fontWeight: FW.semibold, color: COLORS.dark },

  list: { paddingHorizontal: SPACING.md, paddingTop: SPACING.sm, gap: SPACING.sm },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, marginBottom: SPACING.sm },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.limeSoft,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.lime,
  },
  avatarText: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.dark },
  availableDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: COLORS.success,
    borderWidth: 2, borderColor: COLORS.surface,
  },
  info: { flex: 1 },
  name: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.text },
  uni: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  metaText: { fontSize: FS.xs, color: COLORS.textMuted },
  metaDot: { fontSize: FS.xs, color: COLORS.textMuted },

  statusPill: {
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  statusText: { fontSize: FS.xs, fontWeight: FW.semibold },

  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  skillChip: {
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  skillText: { fontSize: FS.xs, color: COLORS.dark, fontWeight: FW.medium },

  cardActions: { flexDirection: 'row', gap: SPACING.sm },
  msgBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    paddingVertical: 10,
  },
  msgBtnText: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.text },
  inviteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.lime,
    borderRadius: RADIUS.pill,
    paddingVertical: 10,
  },
  inviteBtnText: { fontSize: FS.sm, fontWeight: FW.bold, color: COLORS.dark },

  emptyState: { alignItems: 'center', paddingVertical: 80, gap: SPACING.sm },
  emptyTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.textSub },
  emptyDesc: { fontSize: FS.sm, color: COLORS.textMuted },
});
