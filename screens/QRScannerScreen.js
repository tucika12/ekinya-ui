import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';
import { checkIn, checkOut, getSessionsByApplication } from '../services/workSessionService';

export default function QRScannerScreen({ navigation, route }) {
  // Çiftçi hangi başvuru için tarama yapıyor
  const applicationId = route?.params?.applicationId ?? null;

  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const lastScanned = useRef(null);

  // Ekran açılınca mevcut oturumları yükle
  useEffect(() => {
    if (applicationId) loadSessions();
    else setLoadingSessions(false);
  }, [applicationId]);

  const loadSessions = async () => {
    try {
      const data = await getSessionsByApplication(applicationId);
      setSessions(data);
    } catch (e) {
      console.error('Session load error:', e);
    } finally {
      setLoadingSessions(false);
    }
  };

  // Çiftçi "Check-in Başlat" butonuna basar → API çağrısı → QR üretilir
  const handleCheckIn = async () => {
    if (!applicationId) {
      Alert.alert('Hata', 'Başvuru ID bulunamadı.');
      return;
    }
    setProcessing(true);
    try {
      const newSession = await checkIn(applicationId);
      setSessions(prev => [newSession, ...prev]);
      Alert.alert('Check-in Başarılı', 'Öğrenci için QR kodu oluşturuldu. Öğrencinin QR kodunu taramasını bekleyin.');
    } catch (e) {
      const msg = e.response?.data?.message || 'Check-in yapılamadı.';
      Alert.alert('Hata', msg);
    } finally {
      setProcessing(false);
    }
  };

  // Kamera QR okuyunca → check-out API çağrısı
  const handleBarCodeScanned = async ({ data }) => {
    // Aynı kodu tekrar işleme
    if (lastScanned.current === data || processing) return;
    lastScanned.current = data;
    setScanning(false);
    setProcessing(true);

    try {
      // Taranan QR'a sahip açık oturumu bul
      const activeSession = sessions.find(
        s => s.sessionStatus === 'checked_in' && s.checkInQr === data
      );

      if (!activeSession) {
        Alert.alert('Geçersiz QR', 'Bu QR koda ait aktif oturum bulunamadı.', [
          { text: 'Tamam', onPress: () => { lastScanned.current = null; } }
        ]);
        return;
      }

      const updated = await checkOut(activeSession.id, data);
      setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
      Alert.alert(
        'Check-out Başarılı ✓',
        `Çalışma süresi: ${updated.hoursWorked ?? '—'} saat`,
        [{ text: 'Tamam', onPress: () => { lastScanned.current = null; } }]
      );
    } catch (e) {
      const msg = e.response?.data?.message || 'Check-out yapılamadı.';
      Alert.alert('Hata', msg, [
        { text: 'Tamam', onPress: () => { lastScanned.current = null; } }
      ]);
    } finally {
      setProcessing(false);
    }
  };

  const formatTime = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (id) => `#${id}`;

  // Kamera izni henüz sorulmadı
  if (!permission) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.lime} />
        </View>
      </SafeAreaView>
    );
  }

  // İzin reddedildi
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.permissionWrap}>
          <Ionicons name="camera-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.permissionText}>QR taramak için kamera iznine ihtiyaç var.</Text>
          <Pressable style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionBtnText}>İzin Ver</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Pressable style={styles.backCircle} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color={COLORS.text} />
          </Pressable>
          <Text style={styles.headerTitle}>QR Tarayıcı</Text>
        </View>

        {/* ── KAMERA ALANI ── */}
        <View style={styles.cameraArea}>
          {scanning ? (
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={processing ? undefined : handleBarCodeScanned}
            >
              {/* Tarama çerçevesi */}
              <View style={styles.overlay}>
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
              {processing && (
                <View style={styles.processingOverlay}>
                  <ActivityIndicator size="large" color={COLORS.lime} />
                  <Text style={styles.processingText}>İşleniyor...</Text>
                </View>
              )}
            </CameraView>
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="qr-code-outline" size={64} color={COLORS.lime + '80'} />
              <Text style={styles.cameraHint}>Taramayı başlatmak için butona bas</Text>
            </View>
          )}
        </View>

        {/* ── BUTONLAR ── */}
        <View style={styles.btnRow}>
          {/* Check-out için QR tara */}
          <Pressable
            style={[styles.scanBtn, scanning && styles.scanBtnActive]}
            onPress={() => setScanning(s => !s)}
            disabled={processing}
          >
            <Ionicons
              name={scanning ? 'stop-circle-outline' : 'scan-outline'}
              size={18}
              color={scanning ? COLORS.error : COLORS.dark}
            />
            <Text style={[styles.scanBtnText, scanning && { color: COLORS.error }]}>
              {scanning ? 'Taramayı Durdur' : 'QR Tara (Check-out)'}
            </Text>
          </Pressable>

          {/* Check-in başlat */}
          <Pressable
            style={[styles.checkInBtn, processing && { opacity: 0.5 }]}
            onPress={handleCheckIn}
            disabled={processing}
          >
            {processing && !scanning
              ? <ActivityIndicator size="small" color={COLORS.dark} />
              : <Ionicons name="log-in-outline" size={18} color={COLORS.dark} />
            }
            <Text style={styles.checkInBtnText}>Check-in Başlat</Text>
          </Pressable>
        </View>

        {/* ── OTURUM LİSTESİ ── */}
        <View style={styles.attendanceCard}>
          <View style={styles.attendanceHeader}>
            <Text style={styles.attendanceTitle}>Oturumlar</Text>
            {loadingSessions
              ? <ActivityIndicator size="small" color={COLORS.lime} />
              : <Text style={styles.attendanceCount}>{sessions.length} kayıt</Text>
            }
          </View>

          {!loadingSessions && sessions.length === 0 && (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>Henüz oturum yok. Check-in başlatın.</Text>
            </View>
          )}

          {sessions.map((session, index) => (
            <View
              key={session.id}
              style={[styles.workerRow, index < sessions.length - 1 && styles.workerRowBorder]}
            >
              <View style={styles.workerAvatar}>
                <Text style={styles.workerInitials}>{getInitials(session.applicationId)}</Text>
              </View>

              <View style={styles.workerInfo}>
                <Text style={styles.workerName}>Başvuru #{session.applicationId}</Text>
                <View style={styles.workerTimes}>
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                  <Text style={styles.workerTime}>{formatTime(session.checkInTime)}</Text>
                  {session.checkOutTime && (
                    <>
                      <Ionicons name="log-out-outline" size={14} color={COLORS.textMuted} />
                      <Text style={styles.workerTime}>{formatTime(session.checkOutTime)}</Text>
                      {session.hoursWorked != null && (
                        <Text style={styles.hoursText}>{session.hoursWorked}s</Text>
                      )}
                    </>
                  )}
                </View>
              </View>

              <View style={[
                styles.statusPill,
                session.sessionStatus === 'checked_in' ? styles.statusActive : styles.statusDone
              ]}>
                <Text style={[
                  styles.statusText,
                  session.sessionStatus === 'checked_in' ? styles.statusTextActive : styles.statusTextDone
                ]}>
                  {session.sessionStatus === 'checked_in' ? 'Aktif' : 'Bitti'}
                </Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, paddingBottom: 40 },

  permissionWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 },
  permissionText: { fontSize: FS.md, color: COLORS.textSub, textAlign: 'center' },
  permissionBtn: { backgroundColor: COLORS.lime, borderRadius: RADIUS.pill, paddingHorizontal: 24, paddingVertical: 12 },
  permissionBtnText: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.dark },

  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  backCircle: {
    width: 40, height: 40, borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
  },
  headerTitle: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.text },

  cameraArea: {
    backgroundColor: '#001c0e', borderRadius: 20,
    marginBottom: 16, overflow: 'hidden', minHeight: 300,
    alignItems: 'center', justifyContent: 'center'
  },
  camera: { width: '100%', height: 300 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center'
  },
  cameraPlaceholder: { alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40 },
  cameraHint: { fontSize: FS.sm, color: COLORS.lime + '99', textAlign: 'center', marginTop: 12 },

  qrTarget: { width: 200, height: 200, position: 'relative' },
  corner:  { position: 'absolute', width: 24, height: 3, backgroundColor: COLORS.lime },
  cornerV: { position: 'absolute', width: 3, height: 24, backgroundColor: COLORS.lime },
  cornerTL:  { top: 0, left: 0 },   cornerVTL: { top: 0, left: 0 },
  cornerTR:  { top: 0, right: 0 },  cornerVTR: { top: 0, right: 0 },
  cornerBL:  { bottom: 0, left: 0 }, cornerVBL: { bottom: 0, left: 0 },
  cornerBR:  { bottom: 0, right: 0 }, cornerVBR: { bottom: 0, right: 0 },

  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center', gap: 12
  },
  processingText: { color: COLORS.lime, fontSize: FS.md, fontWeight: FW.semibold },

  btnRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  scanBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: COLORS.lime, borderRadius: RADIUS.pill, paddingVertical: 14
  },
  scanBtnActive: { backgroundColor: '#FFEBEE', borderWidth: 1, borderColor: COLORS.error },
  scanBtnText: { fontSize: FS.sm, fontWeight: FW.bold, color: COLORS.dark },
  checkInBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: COLORS.surface, borderRadius: RADIUS.pill,
    paddingVertical: 14, borderWidth: 1.5, borderColor: COLORS.dark
  },
  checkInBtnText: { fontSize: FS.sm, fontWeight: FW.bold, color: COLORS.dark },

  attendanceCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  attendanceHeader: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  attendanceTitle: { fontWeight: FW.bold, fontSize: FS.md, color: COLORS.text },
  attendanceCount: { fontSize: FS.sm, color: COLORS.textSub },
  emptyRow: { padding: 20, alignItems: 'center' },
  emptyText: { fontSize: FS.sm, color: COLORS.textMuted },

  workerRow: { paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  workerRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  workerAvatar: { width: 40, height: 40, borderRadius: RADIUS.pill, backgroundColor: '#E8E8E8', alignItems: 'center', justifyContent: 'center' },
  workerInitials: { fontWeight: FW.bold, fontSize: FS.xs, color: COLORS.textSub },
  workerInfo: { flex: 1 },
  workerName: { fontWeight: FW.semibold, fontSize: FS.md, color: COLORS.text },
  workerTimes: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  workerTime: { fontSize: FS.xs, color: COLORS.textSub },
  hoursText: { fontSize: FS.xs, color: COLORS.lime, fontWeight: FW.semibold },

  statusPill: { borderRadius: RADIUS.pill, paddingHorizontal: 10, paddingVertical: 4 },
  statusActive: { backgroundColor: COLORS.limeSoft },
  statusDone: { backgroundColor: '#ECF0FF' },
  statusText: { fontSize: FS.xs, fontWeight: FW.semibold },
  statusTextActive: { color: COLORS.success },
  statusTextDone: { color: '#3D5AFE' },
});
