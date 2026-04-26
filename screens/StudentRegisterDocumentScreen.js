import { SafeAreaView } from 'react-native-safe-area-context';
// Ekran: Öğrenci Kayıt — Adım 3/3 · Belge Doğrulama
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

export default function StudentRegisterDocumentScreen({ navigation }) {
  const [docSelected, setDocSelected] = useState(null);

  const handlePickDoc = () => {
    // Gerçek uygulamada expo-document-picker veya expo-image-picker kullanılır
    // Mock: dosya seçildi gibi davran
    setDocSelected({ name: 'ogrenci_belgesi.pdf', size: '1.2 MB' });
  };

  const handleRemoveDoc = () => setDocSelected(null);

  const handleSubmit = () => {
    if (!docSelected) return;
    navigation.navigate('SignupSuccess');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── BAŞLIK ── */}
        <View style={styles.titleBlock}>
          <Text style={styles.pageTitle}>Öğrenci Kayıt</Text>
          <Text style={styles.pageSubtitle}>Adım 3 / 3 · Belge doğrulama</Text>
        </View>

        {/* ── PROGRESS BAR (hepsi dolu) ── */}
        <View style={styles.progressBar}>
          <View style={[styles.progressSeg, styles.progressDone]} />
          <View style={[styles.progressSeg, styles.progressDone]} />
          <View style={[styles.progressSeg, styles.progressDone]} />
        </View>

        {/* ── NEDEN BELGE İSTİYORUZ — bilgi kutusu ── */}
        <View style={styles.whyCard}>
          <View style={styles.whyIconWrap}>
            <Ionicons name="time-outline" size={20} color={COLORS.warning} />
          </View>
          <View style={styles.whyContent}>
            <Text style={styles.whyTitle}>Neden belge istiyoruz?</Text>
            <Text style={styles.whyDesc}>
              Aktif öğrenci olduğunu doğrulayarak çiftçilere güven veriyoruz. Belgen güvenli şekilde saklanır.
            </Text>
          </View>
        </View>

        {/* ── KABUL EDİLEN BELGELER ── */}
        <View style={styles.docTypesCard}>
          <View style={styles.docTypesHeader}>
            <Ionicons name="document-outline" size={20} color={COLORS.text} />
            <Text style={styles.docTypesTitle}>Kabul edilen belgeler</Text>
          </View>
          <View style={styles.bulletList}>
            <BulletItem text="Öğrenci kimliği (ön/arka)" />
            <BulletItem text="e-Devlet öğrenci belgesi (PDF)" />
            <BulletItem text="Üniversite öğrenci belgesi" />
          </View>
        </View>

        {/* ── YÜKLEME ALANI ── */}
        {docSelected ? (
          /* Dosya seçildi */
          <View style={styles.docSelectedBox}>
            <View style={styles.docSelectedIconWrap}>
              <Ionicons name="document-text-outline" size={24} color={COLORS.dark} />
            </View>
            <View style={styles.docSelectedInfo}>
              <Text style={styles.docSelectedName} numberOfLines={1}>
                {docSelected.name}
              </Text>
              <Text style={styles.docSelectedSize}>{docSelected.size}</Text>
            </View>
            <Pressable onPress={handleRemoveDoc} hitSlop={8}>
              <Ionicons name="close-circle" size={22} color={COLORS.textMuted} />
            </Pressable>
          </View>
        ) : (
          /* Dosya seçilmedi */
          <Pressable style={styles.uploadBox} onPress={handlePickDoc}>
            <Ionicons name="share-outline" size={32} color={COLORS.textSub} style={{ transform: [{ rotate: '0deg' }] }} />
            <Text style={styles.uploadTitle}>Belgeyi seç veya sürükle</Text>
            <Text style={styles.uploadSub}>PDF, JPG, PNG · Maks 5MB</Text>
          </Pressable>
        )}

        {/* ── GÖNDER BUTONU ── */}
        <Pressable
          style={[styles.submitBtn, !docSelected && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!docSelected}
        >
          <Text style={styles.submitBtnText}>Belgeyi Gönder</Text>
        </Pressable>

        {/* ── SONRA YÜKLEYEYİM ── */}
        <Pressable
          style={styles.skipBtn}
          onPress={() => navigation.navigate('SignupSuccess')}
        >
          <Text style={styles.skipText}>Şimdi atla, sonra yükle</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

function BulletItem({ text }) {
  return (
    <View style={styles.bulletItem}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl
  },

  // Başlık
  titleBlock: { marginBottom: SPACING.md },
  pageTitle: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.text },
  pageSubtitle: { fontSize: FS.sm, color: COLORS.textSub, marginTop: 2 },

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

  // Neden kutusu
  whyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    backgroundColor: '#FFF8F0',
    borderWidth: 1,
    borderColor: '#FFE5C0',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md
  },
  whyIconWrap: {
    marginTop: 2
  },
  whyContent: { flex: 1 },
  whyTitle: {
    fontSize: FS.md,
    fontWeight: FW.bold,
    color: COLORS.text,
    marginBottom: 4
  },
  whyDesc: {
    fontSize: FS.sm,
    color: COLORS.textSub,
    lineHeight: 20
  },

  // Kabul edilen belgeler
  docTypesCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  docTypesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm
  },
  docTypesTitle: {
    fontSize: FS.md,
    fontWeight: FW.bold,
    color: COLORS.text
  },
  bulletList: { gap: SPACING.xs },
  bulletItem: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start' },
  bullet: { fontSize: FS.md, color: COLORS.textSub, lineHeight: 20 },
  bulletText: { flex: 1, fontSize: FS.sm, color: COLORS.textSub, lineHeight: 20 },

  // Yükleme alanı (dashed)
  uploadBox: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface
  },
  uploadTitle: {
    fontSize: FS.md,
    fontWeight: FW.bold,
    color: COLORS.text
  },
  uploadSub: {
    fontSize: FS.xs,
    color: COLORS.textMuted
  },

  // Dosya seçildi
  docSelectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.limeSoft,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg
  },
  docSelectedIconWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  docSelectedInfo: { flex: 1 },
  docSelectedName: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.text },
  docSelectedSize: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 2 },

  // Gönder butonu
  submitBtn: {
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  submitBtnDisabled: {
    backgroundColor: '#8a9a8a'
  },
  submitBtnText: {
    fontSize: FS.md,
    fontWeight: FW.semibold,
    color: COLORS.textOnDark
  },

  // Atla butonu
  skipBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.sm
  },
  skipText: {
    fontSize: FS.sm,
    color: COLORS.textMuted
  }
});
