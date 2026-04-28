import { SafeAreaView } from 'react-native-safe-area-context';
// Ekran: Öğrenci Kayıt — Adım 1/3 · BİLGİLER
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

export default function StudentRegisterFormScreen({ navigation }) {
  const [form, setForm] = useState({
    adSoyad: '',
    telefon: '',
    eposta: '',
    sifre: '',
    universite: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const isValid =
    form.adSoyad.trim() &&
    form.telefon.trim() &&
    form.eposta.trim() &&
    form.sifre.trim() &&
    form.universite.trim();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── GERİ BUTONU ── */}
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={18} color={COLORS.text} />
            <Text style={styles.backText}>Geri</Text>
          </Pressable>

          {/* ── KOYU HEADER KARTI ── */}
          <View style={styles.headerCard}>
            <View style={styles.headerTop}>
              <View style={styles.headerIconCircle}>
                <Ionicons name="school" size={28} color={COLORS.dark} />
              </View>
              <View style={styles.headerMeta}>
                <Text style={styles.headerLabel}>ÖĞRENCİ · ADIM 1 / 3</Text>
                <Text style={styles.headerTitle}>Hesabını oluştur</Text>
              </View>
            </View>

            {/* Progress çubuğu */}
            <View style={styles.progressBar}>
              <View style={[styles.progressSeg, styles.progressActive]} />
              <View style={[styles.progressSeg, styles.progressInactive]} />
              <View style={[styles.progressSeg, styles.progressInactive]} />
            </View>

            {/* Tab etiketleri */}
            <View style={styles.tabRow}>
              <Text style={[styles.tabLabel, styles.tabActive]}>BİLGİLER</Text>
              <Text style={styles.tabLabel}>E-POSTA</Text>
              <Text style={styles.tabLabel}>BELGE</Text>
            </View>
          </View>

          {/* ── FORM ── */}
          <View style={styles.form}>

            {/* AD SOYAD */}
            <FormField label="AD SOYAD">
              <TextInput
                style={[styles.input, { backgroundColor: inputBg(form.adSoyad) }]}
                placeholder="İrem Toprak"
                placeholderTextColor={COLORS.textMuted}
                value={form.adSoyad}
                onChangeText={set('adSoyad')}
                autoCapitalize="words"
              />
            </FormField>

            {/* TELEFON */}
            <FormField label="TELEFON">
              <TextInput
                style={[styles.input, { backgroundColor: inputBg(form.telefon) }]}
                placeholder="5051129169"
                placeholderTextColor={COLORS.textMuted}
                value={form.telefon}
                onChangeText={set('telefon')}
                keyboardType="phone-pad"
              />
            </FormField>

            {/* E-POSTA */}
            <FormField label="E-POSTA">
              <TextInput
                style={[styles.input, { backgroundColor: inputBg(form.eposta) }]}
                placeholder="eposta@gmail.com"
                placeholderTextColor={COLORS.textMuted}
                value={form.eposta}
                onChangeText={set('eposta')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </FormField>

            {/* ŞİFRE */}
            <FormField label="ŞİFRE">
              <View style={[styles.inputRow, { backgroundColor: inputBg(form.sifre) }]}>
                <TextInput
                  style={[styles.input, { flex: 1, backgroundColor: 'transparent' }]}
                  placeholder="••••••••••"
                  placeholderTextColor={COLORS.textMuted}
                  value={form.sifre}
                  onChangeText={set('sifre')}
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.textMuted}
                  />
                </Pressable>
              </View>
            </FormField>

            {/* BÖLÜM BAŞLIĞI */}
            <Text style={styles.sectionTitle}>ÜNİVERSİTE BİLGİLERİ</Text>

            {/* ÜNİVERSİTE */}
            <FormField label="ÜNİVERSİTE">
              <TextInput
                style={[styles.input, { backgroundColor: inputBg(form.universite) }]}
                placeholder="ankara üniversitesi"
                placeholderTextColor={COLORS.textMuted}
                value={form.universite}
                onChangeText={set('universite')}
                autoCapitalize="none"
              />
            </FormField>

            {/* ── GÜVENLİK BİLGİ KUTUSU ── */}
            <View style={styles.infoBox}>
              <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.success} />
              <Text style={styles.infoText}>
                <Text style={styles.infoBold}>Bilgilerin güvende. </Text>
                KVKK uyumlu olarak şifrelenir, üçüncü taraflarla paylaşılmaz.
              </Text>
            </View>

          </View>

          {/* ── DEVAM BUTONU ── */}
          <Pressable
            style={[styles.continueBtn, !isValid && styles.continueBtnDisabled]}
            disabled={!isValid}
            onPress={() => navigation.navigate('StudentRegisterEmail', { email: form.eposta, formData: form })}
          >
            <Text style={styles.continueBtnText}>Devam et</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.textOnDark} />
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormField({ label, children }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const INPUT_BG = '#ECF0FF';
const inputBg = (val) => (val ? INPUT_BG : '#FFFFFF');

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.xl },

  // Geri
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.lg
  },
  backText: { fontSize: FS.md, color: COLORS.text, fontWeight: FW.medium },

  // Header kart
  headerCard: {
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md
  },
  headerIconCircle: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerMeta: { flex: 1 },
  headerLabel: {
    fontSize: FS.xs,
    fontWeight: FW.bold,
    color: COLORS.lime,
    letterSpacing: 1.2,
    marginBottom: 2
  },
  headerTitle: {
    fontSize: FS.xxl,
    fontWeight: FW.bold,
    color: COLORS.textOnDark
  },
  progressBar: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm
  },
  progressSeg: {
    flex: 1,
    height: 4,
    borderRadius: RADIUS.pill
  },
  progressActive: { backgroundColor: COLORS.lime },
  progressInactive: { backgroundColor: '#2a3a2a' },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tabLabel: {
    fontSize: FS.xs,
    fontWeight: FW.semibold,
    color: '#4a6a4a',
    letterSpacing: 1
  },
  tabActive: { color: COLORS.lime },

  // Form
  form: { gap: SPACING.sm },
  row: { flexDirection: 'row', gap: SPACING.sm },
  fieldWrap: { gap: 4 },
  fieldLabel: {
    fontSize: FS.xs,
    fontWeight: FW.semibold,
    color: COLORS.textSub,
    letterSpacing: 0.8,
    marginBottom: 2
  },
  input: {
    backgroundColor: INPUT_BG,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    fontSize: FS.md,
    color: COLORS.text
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BG,
    borderRadius: RADIUS.xl,
    paddingRight: SPACING.sm
  },
  eyeBtn: { padding: SPACING.sm },

  sectionTitle: {
    fontSize: FS.xs,
    fontWeight: FW.semibold,
    color: COLORS.textSub,
    letterSpacing: 1,
    marginTop: SPACING.sm
  },

  // Info kutusu
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: '#EDF7ED',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.sm
  },
  infoText: { flex: 1, fontSize: FS.sm, color: COLORS.textSub, lineHeight: 20 },
  infoBold: { fontWeight: FW.bold, color: COLORS.text },

  // Devam butonu
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    marginTop: SPACING.lg
  },
  continueBtnDisabled: { opacity: 0.4 },
  continueBtnText: {
    fontSize: FS.md,
    fontWeight: FW.semibold,
    color: COLORS.textOnDark
  }
});
