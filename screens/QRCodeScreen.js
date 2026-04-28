import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';
import { getStoredUser } from '../services/authService';
import { getSessionsByApplication } from '../services/workSessionService';

export default function QRCodeScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  // ApplicationDetailScreen'den applicationId gelebilir
  const applicationId = route?.params?.applicationId ?? null;

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const storedUser = await getStoredUser();
        setUser(storedUser);

        if (applicationId) {
          const sessions = await getSessionsByApplication(applicationId);
          // En güncel checked_in oturumu bul
          const active = sessions.find(s => s.sessionStatus === 'checked_in');
          setSession(active ?? sessions[0] ?? null);
        }
      } catch (e) {
        console.error('QRCodeScreen load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [applicationId]);

  const insets_ = useSafeAreaInsets();
  const name = user?.name || user?.Name || 'Öğrenci';
  const getInitials = (n) => {
    if (!n) return '?';
    const p = n.trim().split(' ');
    return p.length > 1 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : p[0][0].toUpperCase();
  };

  return (
    <View style={styles.screen}>

      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>QR Kodum</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── QR KARTI ── */}
      <View style={styles.qrCard}>
        <Text style={styles.qrHint}>Çiftçinin okutması için ekranı göster</Text>

        <View style={styles.qrBox}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.lime} />
          ) : session?.checkInQr ? (
            <QRCode
              value={session.checkInQr}
              size={200}
              color={COLORS.dark}
              backgroundColor="white"
              logo={require('../assets/icon.png')}
              logoSize={36}
              logoBackgroundColor="white"
              logoBorderRadius={8}
            />
          ) : (
            // Aktif session yoksa — sadece kimlik QR'ı göster
            <QRCode
              value={`EKN-USER-${user?.id ?? '0'}`}
              size={200}
              color={COLORS.dark}
              backgroundColor="white"
            />
          )}
        </View>

        {/* İsim & ID */}
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userId}>ID: EKN-{String(user?.id ?? '0').padStart(8, '0')}</Text>
        <View style={styles.verifiedRow}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
          <Text style={styles.verifiedText}>Doğrulanmış öğrenci</Text>
        </View>
      </View>

      {/* ── AKTİF OTURUM BİLGİSİ ── */}
      {session ? (
        <View style={styles.jobCard}>
          <Text style={styles.jobCardTitle}>AKTİF OTURUM</Text>
          <View style={styles.jobRow}>
            <View style={styles.jobEmoji}>
              <Ionicons name="time-outline" size={22} color={COLORS.lime} />
            </View>
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>
                Giriş: {new Date(session.checkInTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={styles.jobFarm}>
                Oturum #{session.id} · {session.sessionStatus === 'checked_in' ? 'Devam ediyor' : 'Tamamlandı'}
              </Text>
            </View>
            <View style={[styles.jobPill, session.sessionStatus !== 'checked_in' && styles.jobPillDone]}>
              <Text style={[styles.jobPillText, session.sessionStatus !== 'checked_in' && styles.jobPillTextDone]}>
                {session.sessionStatus === 'checked_in' ? 'Aktif' : 'Bitti'}
              </Text>
            </View>
          </View>
        </View>
      ) : !loading && (
        <View style={styles.jobCard}>
          <Text style={styles.jobCardTitle}>OTURUM</Text>
          <Text style={styles.noSessionText}>Henüz aktif bir iş oturumu yok.</Text>
        </View>
      )}

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
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  pageTitle: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.text },
  qrCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, margin: SPACING.md, padding: SPACING.lg, alignItems: 'center' },
  qrHint: { fontSize: FS.sm, color: COLORS.textSub, marginBottom: SPACING.lg },
  qrBox: { width: 220, height: 220, marginBottom: SPACING.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: RADIUS.lg, padding: 10 },
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
  jobPillDone: { backgroundColor: '#ECF0FF' },
  jobPillTextDone: { color: '#3D5AFE' },
  noSessionText: { fontSize: FS.sm, color: COLORS.textMuted },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, marginHorizontal: SPACING.md, marginTop: SPACING.sm, padding: SPACING.md, borderRadius: RADIUS.pill, backgroundColor: COLORS.lime },
  shareText: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.dark },
});
