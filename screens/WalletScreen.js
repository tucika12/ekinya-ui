import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';
import api from '../api';
import { getSessionsByApplication } from '../services/workSessionService';

// Ödeme/cüzdan sistemi henüz backend'de uygulanmadı.
// Gerçek bakiye ve işlem geçmişi için endpoint mevcut değil.
// Ekran; tamamlanan iş sayısı ve toplam çalışma saatini
// WorkSession verilerinden hesaplayarak gösteriyor.
// Bakiye ve işlem listesi boş state olarak gösteriliyor.

export default function WalletScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        // Kabul edilmiş başvuruları çek
        const res = await api.get('/JobApplications/my');
        const accepted = (res.data || []).filter(a => a.applicationStatus === 'accepted');

        // Her başvurunun tamamlanmış session'larını çek
        const sessionPromises = accepted.map(a =>
          getSessionsByApplication(a.id).catch(() => [])
        );
        const allSessions = await Promise.all(sessionPromises);
        const flat = allSessions.flat();

        const completedSessions = flat.filter(s => s.sessionStatus === 'checked_out');
        const hours = completedSessions.reduce((sum, s) => sum + (Number(s.hoursWorked) || 0), 0);

        setTotalJobs(accepted.length);
        setTotalHours(Math.round(hours * 10) / 10);
      } catch (e) {
        console.error('WalletScreen load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>Cüzdan</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── BAKİYE KARTI ── */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>TOPLAM BAKİYE</Text>
        <Text style={styles.balanceAmount}>—</Text>
        <Text style={styles.balanceNote}>Ödeme sistemi yakında aktif olacak</Text>
        <View style={styles.cardBtns}>
          <Pressable style={[styles.withdrawBtn, styles.btnDisabled]} disabled>
            <Text style={styles.withdrawText}>Para çek</Text>
          </Pressable>
        </View>
      </View>

      {/* ── İSTATİSTİK KARTLARI ── */}
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.lime} style={{ marginVertical: SPACING.lg }} />
      ) : (
        <View style={styles.miniCards}>
          <View style={styles.miniCard}>
            <Text style={styles.miniValue}>{totalJobs}</Text>
            <Text style={styles.miniLabel}>Kabul edilen iş</Text>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.miniValue}>{totalHours}</Text>
            <Text style={styles.miniLabel}>Toplam saat</Text>
          </View>
        </View>
      )}

      {/* ── SON İŞLEMLER ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Son işlemler</Text>
      </View>
      <View style={styles.emptyTxWrap}>
        <Ionicons name="receipt-outline" size={36} color={COLORS.textMuted} />
        <Text style={styles.emptyTxTitle}>İşlem geçmişi yok</Text>
        <Text style={styles.emptyTxDesc}>Ödeme sistemi aktif olduğunda işlemler burada görünecek</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: SPACING.xxl },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border
  },
  pageTitle: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.text },
  balanceCard: {
    backgroundColor: COLORS.dark, borderRadius: RADIUS.xl, padding: SPACING.lg,
    marginHorizontal: SPACING.md, marginBottom: SPACING.sm
  },
  balanceLabel: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.lime, letterSpacing: 1.5 },
  balanceAmount: { fontSize: FS.display, fontWeight: FW.bold, color: COLORS.textOnDark, marginTop: SPACING.sm },
  balanceNote: { fontSize: FS.sm, color: COLORS.textMuted, marginTop: SPACING.xs },
  cardBtns: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  withdrawBtn: {
    backgroundColor: COLORS.lime, borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm
  },
  btnDisabled: { opacity: 0.4 },
  withdrawText: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.dark },
  miniCards: {
    flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.md, marginBottom: SPACING.sm
  },
  miniCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, alignItems: 'center'
  },
  miniValue: { fontSize: FS.xl, fontWeight: FW.bold, color: COLORS.text },
  miniLabel: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 4, textAlign: 'center' },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.sm
  },
  sectionTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  emptyTxWrap: {
    alignItems: 'center', paddingVertical: SPACING.xl, gap: SPACING.sm,
    marginHorizontal: SPACING.md, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border
  },
  emptyTxTitle: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.textSub },
  emptyTxDesc: {
    fontSize: FS.sm, color: COLORS.textMuted, textAlign: 'center',
    paddingHorizontal: SPACING.lg, lineHeight: 20
  },
});
