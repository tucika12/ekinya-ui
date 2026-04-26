import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

export default function QRCodeScreen({ navigation }) {
  return (
    <View style={styles.screen}>

      {/* ── ÜST BAR ── */}
      <View style={styles.topBar}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>QR Kodum</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── QR KARTI ── */}
      <View style={styles.qrCard}>
        <Text style={styles.qrHint}>Çiftçinin okutması için ekranı göster</Text>

        {/* QR Kod görseli (placeholder grid) */}
        <View style={styles.qrBox}>
          <View style={styles.qrInner}>
            {/* Köşe kareleri */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* Orta ikon */}
            <View style={styles.qrCenter}>
              <View style={styles.qrCenterCircle}>
                <Ionicons name="leaf" size={24} color={COLORS.dark} />
              </View>
            </View>

            {/* QR nokta grid (dekoratif) */}
            {Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => (
                <View
                  key={`${row}-${col}`}
                  style={[
                    styles.dot,
                    {
                      top: 28 + row * 26,
                      left: 28 + col * 26,
                      opacity: Math.random() > 0.4 ? 1 : 0,
                    },
                  ]}
                />
              ))
            )}
          </View>
        </View>

        {/* İsim & ID */}
        <Text style={styles.userName}>Ayşe Yılmaz</Text>
        <Text style={styles.userId}>ID: EKN-2026-00142</Text>
        <View style={styles.verifiedRow}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
          <Text style={styles.verifiedText}>Doğrulanmış öğrenci</Text>
        </View>
      </View>

      {/* ── AKTİF İŞ BİLGİSİ ── */}
      <View style={styles.jobCard}>
        <Text style={styles.jobCardTitle}>Aktif iş</Text>
        <View style={styles.jobRow}>
          <View style={styles.jobEmoji}>
            <Text style={{ fontSize: 20 }}>🫒</Text>
          </View>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>Zeytin Toplama</Text>
            <Text style={styles.jobFarm}>Kaya Çiftliği · 15-25 Mayıs</Text>
          </View>
          <View style={styles.jobPill}>
            <Text style={styles.jobPillText}>Aktif</Text>
          </View>
        </View>
      </View>

      {/* ── PAYLAŞ ── */}
      <Pressable style={styles.shareBtn}>
        <Ionicons name="share-outline" size={18} color={COLORS.dark} />
        <Text style={styles.shareText}>QR'ı paylaş</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, paddingTop: SPACING.lg },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  pageTitle: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.text },
  qrCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, margin: SPACING.md, padding: SPACING.lg, alignItems: 'center' },
  qrHint: { fontSize: FS.sm, color: COLORS.textSub, marginBottom: SPACING.lg },
  qrBox: { width: 220, height: 220, marginBottom: SPACING.lg },
  qrInner: { width: 220, height: 220, backgroundColor: COLORS.bg, borderRadius: RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  corner: { position: 'absolute', width: 36, height: 36, borderColor: COLORS.dark, borderRadius: 6 },
  cornerTL: { top: 12, left: 12, borderTopWidth: 4, borderLeftWidth: 4 },
  cornerTR: { top: 12, right: 12, borderTopWidth: 4, borderRightWidth: 4 },
  cornerBL: { bottom: 12, left: 12, borderBottomWidth: 4, borderLeftWidth: 4 },
  cornerBR: { bottom: 12, right: 12, borderBottomWidth: 4, borderRightWidth: 4 },
  qrCenter: { zIndex: 10 },
  qrCenterCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.lime, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', width: 8, height: 8, borderRadius: 2, backgroundColor: COLORS.dark },
  userName: { fontSize: FS.xl, fontWeight: FW.bold, color: COLORS.text },
  userId: { fontSize: FS.sm, color: COLORS.textSub, marginTop: 4, fontFamily: 'monospace' },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.sm },
  verifiedText: { fontSize: FS.sm, color: COLORS.success, fontWeight: FW.semibold },
  jobCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, marginHorizontal: SPACING.md, padding: SPACING.md, marginBottom: SPACING.sm },
  jobCardTitle: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.textMuted, letterSpacing: 1.2, marginBottom: SPACING.sm },
  jobRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  jobEmoji: { width: 44, height: 44, borderRadius: RADIUS.lg, backgroundColor: COLORS.dark, alignItems: 'center', justifyContent: 'center' },
  jobInfo: { flex: 1 },
  jobTitle: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.text },
  jobFarm: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 2 },
  jobPill: { backgroundColor: COLORS.limeSoft, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.sm, paddingVertical: 4 },
  jobPillText: { fontSize: FS.xs, fontWeight: FW.semibold, color: COLORS.success },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, marginHorizontal: SPACING.md, marginTop: SPACING.sm, padding: SPACING.md, borderRadius: RADIUS.pill, backgroundColor: COLORS.lime },
  shareText: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.dark },
});
