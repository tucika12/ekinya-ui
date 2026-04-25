import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

export default function JobDetailScreen({ navigation, route }) {
  const job = route?.params?.job || {
    title: 'Zeytin Toplama · Hasat',
    farm: 'Kaya Çiftliği',
    wage: '₺600',
    total: '₺6.000',
    days: '10 gün',
    distance: '2.3 km',
    workers: '7',
    rating: '4.8',
    dates: '15-25 Mayıs',
    desc: 'Aydın Nazilli bölgesinde zeytinlik bahçesinde hasat çalışması. Konaklama ve yemek dahildir. Deneyimsizler de başvurabilir. Günlük çalışma süresi 8 saattir.',
    skills: ['Fiziksel dayanıklılık', 'Takım çalışması', 'Sorumluluk'],
  };

  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── HERO ── */}
        <View style={styles.hero}>
          <Pressable style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
            <Ionicons name="chevron-back" size={22} color={COLORS.textOnDark} />
          </Pressable>
          <View style={styles.activePill}>
            <Text style={styles.activePillText}>AKTİF</Text>
          </View>
        </View>

        {/* ── İÇERİK SHEET ── */}
        <View style={styles.sheet}>

          {/* Başlık */}
          <View style={styles.titleRow}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Pressable onPress={() => setLiked(l => !l)}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? COLORS.error : COLORS.textMuted} />
            </Pressable>
          </View>
          <View style={styles.farmRow}>
            <Text style={styles.farmName}>{job.farm}</Text>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.success} style={{ marginLeft: 4 }} />
          </View>

          {/* Bilgi çipleri */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {[`📍 ${job.distance}`, `📅 ${job.days}`, `👥 ${job.workers} ihtiyaç`, `⭐ ${job.rating}`].map(c => (
              <View key={c} style={styles.chip}><Text style={styles.chipText}>{c}</Text></View>
            ))}
          </ScrollView>

          {/* Ücret kartı */}
          <View style={styles.wageCard}>
            <View style={styles.wageCardTop}>
              <Text style={styles.wageLabel}>GÜNLÜK ÜCRET</Text>
              <View style={styles.escrowPill}><Text style={styles.escrowText}>🔒 Escrow</Text></View>
            </View>
            <Text style={styles.wageAmount}>{job.wage}</Text>
            <Text style={styles.wageTotal}>Toplam ~{job.total} · {job.days}</Text>
          </View>

          {/* Açıklama */}
          <Text style={styles.sectionTitle}>İş hakkında</Text>
          <Text style={styles.desc}>{job.desc}</Text>

          {/* Beceriler */}
          <Text style={styles.sectionTitle}>Aranan beceriler</Text>
          <View style={styles.skillsRow}>
            {job.skills.map(s => (
              <View key={s} style={styles.skillChip}><Text style={styles.skillText}>{s}</Text></View>
            ))}
          </View>

          {/* Çiftçi kartı */}
          <Pressable style={styles.farmerCard}>
            <View style={styles.farmerAvatar}>
              <Text style={styles.farmerInitials}>MK</Text>
            </View>
            <View style={styles.farmerInfo}>
              <Text style={styles.farmerName}>{job.farm.split(' ')[0]} Kaya</Text>
              <Text style={styles.farmerMeta}>⭐ 4.8 · 24 iş tamamladı</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </Pressable>

          {/* Harita placeholder */}
          <View style={styles.mapPlaceholder}>
            <Ionicons name="location" size={28} color={COLORS.textSub} />
            <Text style={styles.mapText}>Aydın, Nazilli</Text>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* ── ALT BAR ── */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.msgBtn}>
          <Text style={styles.msgBtnText}>Mesaj</Text>
        </Pressable>
        <Pressable style={styles.applyBtn}>
          <Text style={styles.applyBtnText}>Başvur</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: 0 },
  hero: { height: 200, backgroundColor: COLORS.limeSoft, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-start', padding: SPACING.md, paddingTop: 56 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0F1F0FAA', alignItems: 'center', justifyContent: 'center' },
  activePill: { backgroundColor: COLORS.lime, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.sm, paddingVertical: 5 },
  activePillText: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.dark },
  sheet: { backgroundColor: COLORS.bg, borderRadius: 24, marginTop: -20, paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: SPACING.xs },
  jobTitle: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.text, flex: 1, lineHeight: 34 },
  farmRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  farmName: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.textSub },
  chipsRow: { gap: SPACING.sm, marginBottom: SPACING.md },
  chip: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.sm },
  chipText: { fontSize: FS.xs, color: COLORS.text },
  wageCard: { backgroundColor: COLORS.dark, borderRadius: RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.lg },
  wageCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wageLabel: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.lime, letterSpacing: 1.5 },
  escrowPill: { backgroundColor: '#1a3a1a', borderRadius: RADIUS.pill, paddingHorizontal: SPACING.sm, paddingVertical: 4 },
  escrowText: { fontSize: FS.xs, color: COLORS.lime },
  wageAmount: { fontSize: FS.display, fontWeight: FW.bold, color: COLORS.textOnDark, marginTop: SPACING.xs },
  wageTotal: { fontSize: FS.sm, color: COLORS.textMuted, marginTop: 4 },
  sectionTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text, marginBottom: SPACING.sm, marginTop: SPACING.md },
  desc: { fontSize: FS.md, color: COLORS.textSub, lineHeight: 22 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  skillChip: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  skillText: { fontSize: FS.xs, color: COLORS.text },
  farmerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, marginTop: SPACING.md, gap: SPACING.sm },
  farmerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E8E8E8', alignItems: 'center', justifyContent: 'center' },
  farmerInitials: { fontWeight: FW.bold, fontSize: FS.md, color: COLORS.textSub },
  farmerInfo: { flex: 1 },
  farmerName: { fontWeight: FW.semibold, fontSize: FS.md, color: COLORS.text },
  farmerMeta: { fontSize: FS.xs, color: COLORS.textSub },
  mapPlaceholder: { height: 160, backgroundColor: '#E8E8E8', borderRadius: RADIUS.xl, alignItems: 'center', justifyContent: 'center', marginTop: SPACING.md, gap: SPACING.xs },
  mapText: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.textSub },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: SPACING.sm, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, padding: SPACING.md, paddingBottom: 32 },
  msgBtn: { flex: 1, borderWidth: 1.5, borderColor: COLORS.dark, borderRadius: RADIUS.pill, paddingVertical: SPACING.md, alignItems: 'center' },
  msgBtnText: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.dark },
  applyBtn: { flex: 2, backgroundColor: COLORS.lime, borderRadius: RADIUS.pill, paddingVertical: SPACING.md, alignItems: 'center' },
  applyBtnText: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.dark },
});
