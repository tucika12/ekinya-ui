import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const transactions = [
  { id: 1, type: 'in', desc: 'Zeytin Hasadı · Kaya Çiftliği', date: '23 Nis', amount: '+₺1.746' },
  { id: 2, type: 'in', desc: 'Paketleme · Demir Tarım', date: '15 Nis', amount: '+₺890' },
  { id: 3, type: 'out', desc: 'Platform ücreti', date: '23 Nis', amount: '-₺54' },
  { id: 4, type: 'in', desc: 'Fidan Dikimi · Yeşil Tarla', date: '8 Nis', amount: '+₺600' },
  { id: 5, type: 'out', desc: 'Para çekme', date: '1 Nis', amount: '-₺2.000' },
];

const escrows = [
  { id: 1, title: 'Domates Hasadı', amount: '₺2.200', status: 'Korunuyor' },
  { id: 2, title: 'Çilek Hasadı', amount: '₺1.600', status: 'Aktarılıyor' },
];

export default function WalletScreen({ navigation }) {
  const insets = useSafeAreaInsets();
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
        <Text style={styles.balanceAmount}>₺3.450,50</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceSub}>Bekleyen: ₺1.200</Text>
          <Text style={styles.balanceAvail}>Çekilebilir: ₺2.250,50</Text>
        </View>
        <View style={styles.cardBtns}>
          <Pressable style={styles.withdrawBtn}><Text style={styles.withdrawText}>Para çek</Text></Pressable>
          <Pressable style={styles.historyBtn}><Text style={styles.historyText}>Geçmiş</Text></Pressable>
        </View>
      </View>

      {/* ── MİNİ KARTLAR ── */}
      <View style={styles.miniCards}>
        {[
          { value: '₺2.100', label: 'Bu ay' },
          { value: '12', label: 'İş' },
          { value: '₺550', label: 'Ort/gün' },
        ].map(c => (
          <View key={c.label} style={styles.miniCard}>
            <Text style={styles.miniValue}>{c.value}</Text>
            <Text style={styles.miniLabel}>{c.label}</Text>
          </View>
        ))}
      </View>

      {/* ── SON İŞLEMLER ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Son işlemler</Text>
        <Text style={styles.sectionAll}>Tümü →</Text>
      </View>
      <View style={styles.txList}>
        {transactions.map(tx => (
          <Pressable key={tx.id} style={styles.txRow} onPress={() => navigation?.navigate('PaymentDetail', { payment: tx })}>
            <View style={[styles.txIconWrap, { backgroundColor: tx.type === 'in' ? COLORS.limeSoft : '#FFEBEE' }]}>
              <Ionicons
                name={tx.type === 'in' ? 'arrow-down' : 'arrow-up'}
                size={18}
                color={tx.type === 'in' ? COLORS.success : COLORS.error}
              />
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txDesc}>{tx.desc}</Text>
              <Text style={styles.txDate}>{tx.date}</Text>
            </View>
            <Text style={[styles.txAmount, { color: tx.type === 'in' ? COLORS.success : COLORS.error }]}>
              {tx.amount}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ── ESCROW BÖLÜMÜ ── */}
      <View style={styles.escrowSection}>
        <Text style={styles.escrowTitle}>Aktif Escrow'lar ({escrows.length})</Text>
        {escrows.map(e => (
          <View key={e.id} style={styles.escrowRow}>
            <Text style={styles.escrowJob}>{e.title}</Text>
            <Text style={styles.escrowAmount}>{e.amount}</Text>
            <View style={[styles.escrowPill, e.status === 'Aktarılıyor' && styles.escrowPillWarn]}>
              <Text style={styles.escrowStatus}>{e.status}</Text>
            </View>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: SPACING.xxl },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  pageTitle: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.text },
  balanceCard: { backgroundColor: COLORS.dark, borderRadius: RADIUS.xl, padding: SPACING.lg, marginHorizontal: SPACING.md, marginBottom: SPACING.sm },
  balanceLabel: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.lime, letterSpacing: 1.5 },
  balanceAmount: { fontSize: FS.display, fontWeight: FW.bold, color: COLORS.textOnDark, marginTop: SPACING.sm },
  balanceRow: { flexDirection: 'row', gap: SPACING.lg, marginTop: SPACING.sm },
  balanceSub: { fontSize: FS.sm, color: COLORS.textMuted },
  balanceAvail: { fontSize: FS.sm, color: COLORS.lime },
  cardBtns: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  withdrawBtn: { backgroundColor: COLORS.lime, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  withdrawText: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.dark },
  historyBtn: { borderWidth: 1, borderColor: '#ffffff44', borderRadius: RADIUS.pill, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  historyText: { fontSize: FS.sm, color: COLORS.textOnDark },
  miniCards: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
  miniCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, alignItems: 'center' },
  miniValue: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  miniLabel: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  sectionTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  sectionAll: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.lime },
  txList: { paddingHorizontal: SPACING.md, gap: SPACING.sm, marginBottom: SPACING.md },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md },
  txIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txDesc: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.text },
  txDate: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 2 },
  txAmount: { fontSize: FS.md, fontWeight: FW.bold },
  escrowSection: { marginHorizontal: SPACING.md, backgroundColor: COLORS.limeSoft, borderRadius: RADIUS.xl, padding: SPACING.md },
  escrowTitle: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.text, marginBottom: SPACING.sm },
  escrowRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, borderTopWidth: 1, borderTopColor: '#d0e8c0', gap: SPACING.sm },
  escrowJob: { flex: 1, fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.text },
  escrowAmount: { fontSize: FS.sm, fontWeight: FW.bold, color: COLORS.dark },
  escrowPill: { backgroundColor: COLORS.lime, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.sm, paddingVertical: 4 },
  escrowPillWarn: { backgroundColor: '#FFE5C0' },
  escrowStatus: { fontSize: FS.xs, fontWeight: FW.semibold, color: COLORS.dark }
});
