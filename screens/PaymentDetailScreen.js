import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

// Ödeme sistemi henüz backend'de uygulanmadı.
// Bu ekran WorkSession verisinden gelen gerçek tarihlerle timeline oluşturur.
// Bakiye/tutar bilgisi ödeme sistemi aktif olduğunda doldurulacak.

const formatDate = (iso) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function PaymentDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();

  // WalletScreen veya ApplicationDetailScreen'den gelen gerçek session verisi
  const session = route?.params?.session ?? null;
  const jobTitle = route?.params?.jobTitle ?? 'İş';
  const farmerName = route?.params?.farmerName ?? '';

  // Session varsa gerçek timeline, yoksa boş
  const timeline = session ? [
    session.checkInTime
      ? { label: 'Çalışma başladı', date: formatDate(session.checkInTime), done: true }
      : null,
    session.checkOutTime
      ? { label: 'Çalışma tamamlandı', date: formatDate(session.checkOutTime), done: true }
      : null,
  ].filter(Boolean) : [];

  const rows = session ? [
    farmerName ? { label: 'İşveren', value: farmerName } : null,
    { label: 'İlan', value: jobTitle, highlight: true },
    session.checkInTime
      ? { label: 'Giriş saati', value: new Date(session.checkInTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) }
      : null,
    session.checkOutTime
      ? { label: 'Çıkış saati', value: new Date(session.checkOutTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) }
      : null,
    session.hoursWorked != null
      ? { label: 'Çalışılan saat', value: `${session.hoursWorked} saat`, bold: true }
      : null,
  ].filter(Boolean) : [];

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
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
            <Ionicons
              name={session?.sessionStatus === 'checked_out' ? 'checkmark-circle' : 'time-outline'}
              size={44}
              color={COLORS.dark}
            />
          </View>
          <Text style={styles.heroTitle}>
            {session?.sessionStatus === 'checked_out' ? 'Tamamlandı' : 'Devam ediyor'}
          </Text>
          {session?.hoursWorked != null && (
            <Text style={styles.heroAmount}>{session.hoursWorked} saat</Text>
          )}
        </View>

        {/* ── DETAY KARTI ── */}
        {rows.length > 0 && (
          <>
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
                    row.highlight && styles.detailValueHighlight,
                  ]}>
                    {row.value}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── ZAMANÇİZELGESİ ── */}
        {timeline.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Süreç</Text>
            <View style={styles.timelineWrap}>
              {timeline.map((step, idx) => (
                <View key={idx} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, step.done && styles.timelineDotDone]} />
                    {idx < timeline.length - 1 && (
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
          </>
        )}

        {/* Session yoksa boş durum */}
        {!session && (
          <View style={styles.emptyWrap}>
            <Ionicons name="receipt-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>Detay bulunamadı</Text>
            <Text style={styles.emptyDesc}>Bu işleme ait veri mevcut değil</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  content: { paddingHorizontal: SPACING.md },
  heroWrap: { alignItems: 'center', paddingVertical: SPACING.xl },
  heroCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.limeSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md
  },
  heroTitle: { fontSize: FS.xl, fontWeight: FW.bold, color: COLORS.text, marginBottom: 6 },
  heroAmount: { fontSize: 38, fontWeight: FW.bold, color: COLORS.lime },
  sectionTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text, marginBottom: SPACING.md },
  detailCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.xl
  },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border
  },
  lastRow: { borderBottomWidth: 0 },
  detailLabel: { fontSize: FS.md, color: COLORS.textSub },
  detailValue: { fontSize: FS.md, color: COLORS.text },
  detailValueBold: { fontWeight: FW.bold },
  detailValueHighlight: { color: COLORS.lime, fontWeight: FW.semibold },
  timelineWrap: { marginBottom: SPACING.xl },
  timelineItem: { flexDirection: 'row', gap: SPACING.md },
  timelineLeft: { alignItems: 'center', width: 12 },
  timelineDot: {
    width: 12, height: 12, borderRadius: 6,
    borderWidth: 2, borderColor: COLORS.border, backgroundColor: COLORS.surface
  },
  timelineDotDone: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  timelineLine: {
    flex: 1, width: 2, backgroundColor: COLORS.border,
    marginVertical: 2, minHeight: 28
  },
  timelineLineDone: { backgroundColor: COLORS.lime },
  timelineContent: { flex: 1, paddingBottom: SPACING.lg },
  timelineLabel: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text },
  timelineDate: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 2 },
  emptyWrap: {
    alignItems: 'center', paddingVertical: SPACING.xxl, gap: SPACING.sm,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border, marginTop: SPACING.lg
  },
  emptyTitle: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.textSub },
  emptyDesc: { fontSize: FS.sm, color: COLORS.textMuted },
});
