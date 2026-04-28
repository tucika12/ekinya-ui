import { SafeAreaView } from 'react-native-safe-area-context';
// Ekran: Öğrenci Kayıt — Adım 2/3 · E-posta Doğrulama
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,

} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

export default function StudentRegisterEmailScreen({ navigation, route }) {
  const email = route?.params?.email || 'e-posta adresinize';
  const formData = route?.params?.formData || {};
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* ── BAŞLIK ── */}
        <View style={styles.titleBlock}>
          <Text style={styles.pageTitle}>Öğrenci Kayıt</Text>
          <Text style={styles.pageSubtitle}>Adım 2 / 3 · E-posta doğrulama</Text>
        </View>

        {/* ── PROGRESS BAR ── */}
        <View style={styles.progressBar}>
          <View style={[styles.progressSeg, styles.progressDone]} />
          <View style={[styles.progressSeg, styles.progressDone]} />
          <View style={[styles.progressSeg, styles.progressEmpty]} />
        </View>

        {/* ── ANA KART ── */}
        <View style={styles.card}>

          {/* Zarf ikonu */}
          <View style={styles.iconCircle}>
            <Ionicons name="mail-outline" size={32} color={COLORS.dark} />
          </View>

          {/* Başlık */}
          <Text style={styles.cardTitle}>E-postanı kontrol et</Text>

          {/* Açıklama */}
          <Text style={styles.cardDesc}>
            <Text style={styles.emailHighlight}>{email} </Text>
            adresine doğrulama linki gönderdik. Linke tıkladıktan sonra aşağıdaki butonla devam edebilirsin.
          </Text>

          {/* Doğruladım butonu */}
          <Pressable
            style={styles.confirmBtn}
            onPress={() => navigation.navigate('StudentRegisterDocument', { formData })}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.textOnDark} />
            <Text style={styles.confirmBtnText}>Doğruladım, devam et</Text>
          </Pressable>

          {/* Tekrar gönder */}
          <Pressable style={styles.resendBtn} onPress={handleResend}>
            <Ionicons
              name="refresh-outline"
              size={16}
              color={resent ? COLORS.success : COLORS.textSub}
            />
            <Text style={[styles.resendText, resent && { color: COLORS.success }]}>
              {resent ? 'Gönderildi!' : 'E-postayı tekrar gönder'}
            </Text>
          </Pressable>

        </View>

        {/* ── ALT LİNK ── */}
        <Text style={styles.bottomHint}>
          Yanlış e-posta mı?{' '}
          <Text
            style={styles.bottomLink}
            onPress={() => navigation.navigate('Welcome')}
          >
            Baştan başla
          </Text>
        </Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl
  },

  // Başlık
  titleBlock: { marginBottom: SPACING.md },
  pageTitle: {
    fontSize: FS.title,
    fontWeight: FW.bold,
    color: COLORS.text
  },
  pageSubtitle: {
    fontSize: FS.sm,
    color: COLORS.textSub,
    marginTop: 2
  },

  // Progress
  progressBar: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl
  },
  progressSeg: {
    flex: 1,
    height: 5,
    borderRadius: RADIUS.pill
  },
  progressDone: { backgroundColor: COLORS.dark },
  progressEmpty: { backgroundColor: COLORS.border },

  // Kart
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3
  },

  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.limeSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg
  },

  cardTitle: {
    fontSize: FS.xl,
    fontWeight: FW.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center'
  },
  cardDesc: {
    fontSize: FS.sm,
    color: COLORS.textSub,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: SPACING.lg
  },
  emailHighlight: {
    fontWeight: FW.semibold,
    color: COLORS.text
  },

  // Doğruladım butonu
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    width: '100%',
    marginBottom: SPACING.md
  },
  confirmBtnText: {
    fontSize: FS.md,
    fontWeight: FW.semibold,
    color: COLORS.textOnDark
  },

  // Tekrar gönder
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm
  },
  resendText: {
    fontSize: FS.sm,
    color: COLORS.textSub
  },

  // Alt link
  bottomHint: {
    textAlign: 'center',
    fontSize: FS.sm,
    color: COLORS.textSub,
    marginTop: SPACING.xl
  },
  bottomLink: {
    fontWeight: FW.bold,
    color: COLORS.text,
    textDecorationLine: 'underline'
  }
});
