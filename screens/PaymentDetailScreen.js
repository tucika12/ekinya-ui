import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Pressable
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const TIMELINE = [
  { label: 'İş başladı', date: '15 May 2025', done: true },
  { label: 'İş tamamlandı', date: '22 May 2025', done: true },
  { label: "Escrow'da bekledi", date: '22 May 2025', done: true },
  { label: 'Hesaba aktarıldı', date: '23 May 2025', done: true },
];

export default function PaymentDetailScreen({ navigation, route }) {
  const payment = route?.params?.payment ?? {
    type: 'received',
    employer: 'Mehmet Kaya',
    job: 'Zeytin Toplama',
    dateRange: '15-22 Mayıs',
    hours: '48 sa',
    hourlyRate: '₺37,50',
    total: '₺1.800,00',
    platformFee: '-₺54,00',
    net: '₺1.746,00'
  };

  const rows = [
    { label: 'İşveren', value: payment.employer },
    { label: 'İlan', value: payment.job, highlight: true },
    { label: 'Tarih aralığı', value: payment.dateRange },
    { label: 'Çalışılan saat', value: payment.hours },
    { label: 'Saatlik ücret', value: payment.hourlyRate },
    { label: 'Toplam', value: payment.total, bold: true, lime: true },
    { label: 'Platform ücreti', value: payment.platformFee, muted: true },
    { label: 'Net alınan', value: payment.net, bold: true },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── ÜST BAR ── */}
      <View style={styles.topBar}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>İşlem detayı</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── STATUS HERO ── */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCircle}>
            <Ionicons name="checkmark-circle" size={44} color={COLORS.dark} />
          </View>
          <Text style={styles.heroTitle}>Ödeme alındı</Text>
          <Text style={styles.heroAmount}>{payment.net}</Text>
        </View>

        {/* ── DETAY KARTI ── */}
        <Text style={styles.sectionTitle}>İşlem detayları</Text>
        <View style={styles.detailCard}>
          {rows.map((row, idx) => (
            <View
              key={idx}
              style={[styles.detailRow, idx === rows.length - 1 && styles.lastRow]}
            >
              <Text style={styles.detailLabel}>{row.label}</Text>
              <Text style={[
                styles.detailValue,
                row.bold && styles.detailValueBold,
                row.lime && styles.detailValueLime,
                row.muted && styles.detailValueMuted,
                row.highlight && styles.detailValueHighlight,
              ]}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        {/* ── ZAMANÇİZELGESİ ── */}
        <Text style={styles.sectionTitle}>Süreç</Text>
        <View style={styles.timelineWrap}>
          {TIMELINE.map((step, idx) => (
            <View key={idx} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineDot, step.done && styles.timelineDotDone]} />
                {idx < TIMELINE.length - 1 && (
                  <View style={[styles.timelineLine, step.done && styles.timelineLineDone]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>{step.label}</Text>
                <Text style={styles.timelineDate}>{step.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── CTA ── */}
        <Pressable style={styles.downloadBtn}>
          <Ionicons name="download-outline" size={20} color={COLORS.dark} style={{ marginRight: 8 }} />
          <Text style={styles.downloadText}>Makbuzu indir</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
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

  content: { paddingHorizontal: SPACING.md },

  // ── HERO ──
  heroWrap: {
    alignItems: 'center',
    paddingVertical: SPACING.xl
  },
  heroCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.limeSoft,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.md
  },
  heroTitle: { fontSize: FS.xl, fontWeight: FW.bold, color: COLORS.text, marginBottom: 6 },
  heroAmount: { fontSize: 38, fontWeight: FW.bold, color: COLORS.lime },

  sectionTitle: {
    fontSize: FS.lg, fontWeight: FW.bold,
    color: COLORS.text, marginBottom: SPACING.md
  },

  // ── DETAY KARTI ──
  detailCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.xl
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  lastRow: { borderBottomWidth: 0 },
  detailLabel: { fontSize: FS.md, color: COLORS.textSub },
  detailValue: { fontSize: FS.md, color: COLORS.text },
  detailValueBold: { fontWeight: FW.bold },
  detailValueLime: { color: COLORS.lime, fontWeight: FW.bold },
  detailValueMuted: { color: COLORS.textMuted },
  detailValueHighlight: { color: COLORS.lime, fontWeight: FW.semibold },

  // ── ZAMANÇİZELGESİ ──
  timelineWrap: { marginBottom: SPACING.xl },
  timelineItem: { flexDirection: 'row', gap: SPACING.md },
  timelineLeft: { alignItems: 'center', width: 12 },
  timelineDot: {
    width: 12, height: 12, borderRadius: 6,
    borderWidth: 2, borderColor: COLORS.border,
    backgroundColor: COLORS.surface
  },
  timelineDotDone: {
    backgroundColor: COLORS.lime, borderColor: COLORS.lime
  },
  timelineLine: {
    flex: 1, width: 2,
    backgroundColor: COLORS.border,
    marginVertical: 2, minHeight: 28
  },
  timelineLineDone: { backgroundColor: COLORS.lime },
  timelineContent: { flex: 1, paddingBottom: SPACING.lg },
  timelineLabel: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text },
  timelineDate: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 2 },

  // ── DOWNLOAD ──
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.limeSoft,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md + 2,
    borderWidth: 1, borderColor: COLORS.lime
  },
  downloadText: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.dark }
});
