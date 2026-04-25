import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const workers = [
  { id: 1, initials: 'EA', name: 'Elif Aydın',   checkin: '08:02', checkout: null },
  { id: 2, initials: 'BŞ', name: 'Burak Şen',    checkin: '08:10', checkout: '17:05' },
  { id: 3, initials: 'ZK', name: 'Zeynep Kılıç', checkin: '08:15', checkout: null },
];

export default function QRScannerScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Pressable style={styles.backCircle} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color={COLORS.text} />
          </Pressable>
          <Text style={styles.headerTitle}>QR Tarayıcı</Text>
        </View>

        <View style={styles.cameraArea}>
          <View style={styles.cameraInner}>
            <View style={styles.scanLine} />

            <View style={styles.qrTarget}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.cornerV, styles.cornerVTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.cornerV, styles.cornerVTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.cornerV, styles.cornerVBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              <View style={[styles.cornerV, styles.cornerVBR]} />
            </View>

            <Text style={styles.cameraHint}>İşçinin QR kodunu çerçeveye hizala</Text>
          </View>
        </View>

        <Pressable style={styles.scanBtn}>
          <Text style={styles.scanBtnText}>Taramayı Başlat</Text>
        </Pressable>

        <View style={styles.attendanceCard}>
          <View style={styles.attendanceHeader}>
            <Text style={styles.attendanceTitle}>Bugünkü Yoklama</Text>
            <Text style={styles.attendanceCount}>3 kişi</Text>
          </View>

          {workers.map((worker, index) => (
            <View
              key={worker.id}
              style={[
                styles.workerRow,
                index < workers.length - 1 && styles.workerRowBorder,
              ]}
            >
              <View style={styles.workerAvatar}>
                <Text style={styles.workerInitials}>{worker.initials}</Text>
              </View>

              <View style={styles.workerInfo}>
                <Text style={styles.workerName}>{worker.name}</Text>
                <View style={styles.workerTimes}>
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                  <Text style={styles.workerTime}>{worker.checkin}</Text>
                  {worker.checkout && (
                    <>
                      <Ionicons name="log-out-outline" size={14} color={COLORS.textMuted} />
                      <Text style={styles.workerTime}>{worker.checkout}</Text>
                    </>
                  )}
                </View>
              </View>

              {!worker.checkout && (
                <Pressable style={styles.checkoutPill}>
                  <Text style={styles.checkoutPillText}>Çıkış</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: FS.title,
    fontWeight: FW.bold,
    color: COLORS.text,
  },

  cameraArea: {
    backgroundColor: '#0F2A14',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  cameraInner: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.lime,
    borderRadius: 14,
    minHeight: 280,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLine: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.lime,
    opacity: 0.8,
  },
  qrTarget: {
    width: 64,
    height: 64,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 16,
    height: 3,
    backgroundColor: COLORS.textMuted,
  },
  cornerV: {
    position: 'absolute',
    width: 3,
    height: 16,
    backgroundColor: COLORS.textMuted,
  },
  cornerTL: { top: 0, left: 0 },
  cornerVTL: { top: 0, left: 0 },
  cornerTR: { top: 0, right: 0 },
  cornerVTR: { top: 0, right: 0 },
  cornerBL: { bottom: 0, left: 0 },
  cornerVBL: { bottom: 0, left: 0 },
  cornerBR: { bottom: 0, right: 0 },
  cornerVBR: { bottom: 0, right: 0 },
  cameraHint: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    fontSize: FS.sm,
    color: COLORS.lime + '99',
    textAlign: 'center',
  },

  scanBtn: {
    backgroundColor: COLORS.lime,
    borderRadius: RADIUS.pill,
    paddingVertical: 16,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  scanBtnText: {
    fontSize: FS.lg,
    fontWeight: FW.bold,
    color: COLORS.dark,
    textAlign: 'center',
  },

  attendanceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  attendanceHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  attendanceTitle: {
    fontWeight: FW.bold,
    fontSize: FS.md,
    color: COLORS.text,
  },
  attendanceCount: {
    fontSize: FS.sm,
    color: COLORS.textSub,
  },

  workerRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  workerRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  workerAvatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workerInitials: {
    fontWeight: FW.bold,
    fontSize: FS.sm,
    color: COLORS.textSub,
  },
  workerInfo: { flex: 1 },
  workerName: {
    fontWeight: FW.semibold,
    fontSize: FS.md,
    color: COLORS.text,
  },
  workerTimes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  workerTime: {
    fontSize: FS.xs,
    color: COLORS.textSub,
  },

  checkoutPill: {
    backgroundColor: '#FFF0E0',
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  checkoutPillText: {
    fontSize: FS.sm,
    fontWeight: FW.semibold,
    color: COLORS.warning,
  },
});
