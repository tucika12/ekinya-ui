import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const INPUT_BG = '#ECF0FF';
const inputBg = (val) => (val ? INPUT_BG : '#FFFFFF');

export default function EditProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({
    adSoyad:    '',
    eposta:     '',
    telefon:    '',
    universite: '',
    bolum:      '',
    sinif:      '3',
    sehir:      '',
    hakkimda:   ''
  });
  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <View style={styles.screen}>
      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>Profili düzenle</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.saveLink}>Kaydet</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* ── AVATAR ── */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AY</Text>
              </View>
              <View style={styles.cameraBtn}>
                <Ionicons name="camera-outline" size={14} color={COLORS.dark} />
              </View>
            </View>
            <Text style={styles.avatarHint}>Fotoğrafı değiştir</Text>
          </View>

          {/* ── KİŞİSEL ── */}
          <SectionTitle title="KİŞİSEL BİLGİLER" />
          <Field label="AD SOYAD">
            <TextInput style={[styles.input, { backgroundColor: inputBg(form.adSoyad) }]} value={form.adSoyad} onChangeText={set('adSoyad')} autoCapitalize="words" placeholder="Ad Soyad" placeholderTextColor={COLORS.textMuted} />
          </Field>
          <Field label="E-POSTA">
            <TextInput style={[styles.input, { backgroundColor: inputBg(form.eposta) }]} value={form.eposta} onChangeText={set('eposta')} keyboardType="email-address" autoCapitalize="none" placeholder="eposta@gmail.com" placeholderTextColor={COLORS.textMuted} />
          </Field>
          <Field label="TELEFON">
            <TextInput style={[styles.input, { backgroundColor: inputBg(form.telefon) }]} value={form.telefon} onChangeText={set('telefon')} keyboardType="phone-pad" placeholder="5XX XXX XX XX" placeholderTextColor={COLORS.textMuted} />
          </Field>
          <Field label="ŞEHİR">
            <TextInput style={[styles.input, { backgroundColor: inputBg(form.sehir) }]} value={form.sehir} onChangeText={set('sehir')} placeholder="Şehir" placeholderTextColor={COLORS.textMuted} />
          </Field>
          <Field label="HAKKIMDA">
            <TextInput
              style={[styles.input, styles.multiline, { backgroundColor: inputBg(form.hakkimda) }]}
              value={form.hakkimda}
              onChangeText={set('hakkimda')}
              multiline
              numberOfLines={4}
              placeholder="Kendinden kısaca bahset..."
              placeholderTextColor={COLORS.textMuted}
              textAlignVertical="top"
            />
          </Field>

          {/* ── ÜNİVERSİTE ── */}
          <SectionTitle title="ÜNİVERSİTE BİLGİLERİ" />
          <Field label="ÜNİVERSİTE">
            <TextInput style={[styles.input, { backgroundColor: inputBg(form.universite) }]} value={form.universite} onChangeText={set('universite')} autoCapitalize="words" placeholder="Üniversite adı" placeholderTextColor={COLORS.textMuted} />
          </Field>
          <Field label="BÖLÜM">
            <TextInput style={[styles.input, { backgroundColor: inputBg(form.bolum) }]} value={form.bolum} onChangeText={set('bolum')} autoCapitalize="words" placeholder="Bölüm" placeholderTextColor={COLORS.textMuted} />
          </Field>

          {/* ── SINIF SEÇİMİ ── */}
          <Field label="SINIF">
            <View style={styles.segmentRow}>
              {['1', '2', '3', '4', 'Y.L.'].map(s => (
                <Pressable
                  key={s}
                  style={[styles.segment, form.sinif === s && styles.segmentActive]}
                  onPress={() => set('sinif')(s)}
                >
                  <Text style={[styles.segmentText, form.sinif === s && styles.segmentTextActive]}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </Field>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function SectionTitle({ title }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function Field({ label, children }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: COLORS.bg },
  topBar:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, },
  backBtn:   { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  pageTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  saveLink:  { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.lime },
  content:   { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },
  avatarSection: { alignItems: 'center', paddingVertical: SPACING.lg },
  avatarWrap:    { position: 'relative' },
  avatar:        { width: 90, height: 90, borderRadius: 45, backgroundColor: '#E8E8E8', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: COLORS.lime },
  avatarText:    { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.dark },
  cameraBtn:     { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.lime, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.surface },
  avatarHint:    { fontSize: FS.sm, color: COLORS.lime, marginTop: SPACING.sm, fontWeight: FW.medium },
  sectionTitle:  { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.textMuted, letterSpacing: 1.5, marginTop: SPACING.lg, marginBottom: SPACING.sm, paddingLeft: 2 },
  fieldWrap:     { marginBottom: SPACING.sm },
  fieldLabel:    { fontSize: FS.xs, fontWeight: FW.semibold, color: COLORS.textSub, letterSpacing: 0.8, marginBottom: 6 },
  input:         { backgroundColor: '#FFFFFF', borderRadius: RADIUS.xl, paddingHorizontal: SPACING.md, paddingVertical: 14, fontSize: FS.md, color: COLORS.text },
  multiline:     { height: 100, paddingTop: 14 },
  segmentRow:    { flexDirection: 'row', gap: SPACING.sm },
  segment:       { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: RADIUS.xl, backgroundColor: INPUT_BG },
  segmentActive: { backgroundColor: COLORS.lime },
  segmentText:   { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.textSub },
  segmentTextActive: { color: COLORS.dark }
});
