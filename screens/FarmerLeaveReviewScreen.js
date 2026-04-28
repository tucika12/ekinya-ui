import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';
import { createReview } from '../services/reviewService';

const STAR_LABELS = ['', 'Berbat', 'Kötü', 'Orta', 'İyi', 'Mükemmel'];
const CATEGORIES = ['Çalışma gayreti', 'Dakiklik', 'İletişim', 'İş kalitesi'];
const TAGS = ['Çalışkan', 'Dakik', 'Güvenilir', 'Uyumlu', 'Hızlı öğrenir', 'Temiz çalışır'];

function StarRow({ count, size = 40, onPress }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Pressable key={i} onPress={() => onPress(i)} style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons
            name={i <= count ? 'star' : 'star-outline'}
            size={size - 4}
            color={i <= count ? COLORS.lime : '#CCC'}
          />
        </Pressable>
      ))}
    </View>
  );
}

export default function FarmerLeaveReviewScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const worker = route?.params?.worker ?? {
    applicationId: 1,
    studentId: 2,
    name: 'Ayşe Yılmaz',
    initials: 'AY',
    job: 'Zeytin Toplama',
    dates: '15-25 Mayıs',
  };

  const [overall, setOverall] = useState(0);
  const [cats, setCats] = useState({ 'Çalışma gayreti': 0, 'Dakiklik': 0, 'İletişim': 0, 'İş kalitesi': 0 });
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [wouldHireAgain, setWouldHireAgain] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleTag = (t) => setSelectedTags(prev =>
    prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
  );
  const setCatRating = (cat, val) => setCats(c => ({ ...c, [cat]: val }));
  const canSubmit = overall > 0;

  const handleSubmit = async () => {
    if (!worker.applicationId || !worker.studentId) {
      Alert.alert('Hata', 'İş başvurusu bilgisi eksik.');
      return;
    }

    setLoading(true);
    try {
      const finalComment = `${comment}\n\nEtiketler: ${selectedTags.join(', ')}\nTekrar Çalıştırır Mı?: ${wouldHireAgain ? 'Evet' : 'Hayır'}`;

      await createReview({
        applicationId: worker.applicationId,
        revieweeId: worker.studentId,
        rating: overall,
        comment: finalComment
      });

      Alert.alert('Başarılı', 'Değerlendirmeniz gönderildi!', [
        { text: 'Tamam', onPress: () => navigation?.goBack() }
      ]);
    } catch (e) {
      console.log('Review error:', e);
      Alert.alert('Hata', e.response?.data?.message || 'Değerlendirme gönderilemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safe}>
      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.closeBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>İşçiyi Değerlendir</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── İŞÇİ KARTI ── */}
        <View style={styles.workerCard}>
          <View style={styles.workerAvatar}>
            <Text style={styles.workerInitials}>{worker.initials}</Text>
          </View>
          <View>
            <Text style={styles.workerName}>{worker.name}</Text>
            <Text style={styles.workerJob}>{worker.job}</Text>
            <Text style={styles.workerDates}>📅 {worker.dates}</Text>
          </View>
        </View>

        {/* ── GENEL PUAN ── */}
        <View style={styles.overallWrap}>
          <Text style={styles.overallQuestion}>Bu işçiyi nasıl değerlendirirsin?</Text>
          <StarRow count={overall} size={48} onPress={setOverall} />
          {overall > 0 && (
            <Text style={styles.overallLabel}>{STAR_LABELS[overall]}</Text>
          )}
        </View>

        {/* ── KATEGORİLER ── */}
        <View style={styles.catsWrap}>
          {CATEGORIES.map(cat => (
            <View key={cat} style={styles.catRow}>
              <Text style={styles.catLabel}>{cat}</Text>
              <StarRow count={cats[cat]} size={28} onPress={(v) => setCatRating(cat, v)} />
            </View>
          ))}
        </View>

        {/* ── TEKRAR ÇALIŞTIRIR MIYDIN ── */}
        <Text style={styles.sectionLabel}>Tekrar çalıştırır mıydın?</Text>
        <View style={styles.yesNoRow}>
          <Pressable
            style={[styles.yesNoBtn, wouldHireAgain === true && styles.yesNoBtnActive]}
            onPress={() => setWouldHireAgain(true)}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={wouldHireAgain === true ? COLORS.dark : COLORS.textSub} />
            <Text style={[styles.yesNoText, wouldHireAgain === true && styles.yesNoTextActive]}>Evet, kesinlikle</Text>
          </Pressable>
          <Pressable
            style={[styles.yesNoBtn, wouldHireAgain === false && styles.yesNoBtnNo]}
            onPress={() => setWouldHireAgain(false)}
          >
            <Ionicons name="close-circle-outline" size={20} color={wouldHireAgain === false ? COLORS.error : COLORS.textSub} />
            <Text style={[styles.yesNoText, wouldHireAgain === false && { color: COLORS.error }]}>Hayır</Text>
          </Pressable>
        </View>

        {/* ── ETİKETLER ── */}
        <Text style={styles.sectionLabel}>Özellikler</Text>
        <View style={styles.tagsRow}>
          {TAGS.map(t => (
            <Pressable
              key={t}
              style={[styles.tagChip, selectedTags.includes(t) && styles.tagChipActive]}
              onPress={() => toggleTag(t)}
            >
              <Text style={[styles.tagText, selectedTags.includes(t) && styles.tagTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        {/* ── YORUM ── */}
        <Text style={styles.sectionLabel}>Yorumun</Text>
        <View style={styles.commentWrap}>
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder="Bu işçi hakkında deneyimini paylaş..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={5}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{comment.length}/500</Text>
        </View>

        {/* ── GÖNDER ── */}
        <Pressable
          style={[styles.submitBtn, (!canSubmit || loading) && styles.submitBtnDisabled]}
          disabled={!canSubmit || loading}
          onPress={handleSubmit}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.textOnDark} />
          ) : (
            <Text style={styles.submitText}>Değerlendirmeyi gönder</Text>
          )}
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  pageTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },
  workerCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, marginBottom: SPACING.xl, marginTop: SPACING.sm },
  workerAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.limeSoft, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.lime },
  workerInitials: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.dark },
  workerName: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.text },
  workerJob: { fontSize: FS.sm, color: COLORS.textSub, marginTop: 2 },
  workerDates: { fontSize: FS.xs, color: COLORS.textMuted, marginTop: 2 },
  overallWrap: { alignItems: 'center', marginBottom: SPACING.xl },
  overallQuestion: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text, marginBottom: SPACING.md, textAlign: 'center' },
  overallLabel: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.textSub, marginTop: SPACING.sm },
  catsWrap: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.xl },
  catRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  catLabel: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text },
  sectionLabel: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text, marginBottom: SPACING.sm, marginTop: SPACING.sm },
  yesNoRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  yesNoBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.xl, paddingVertical: SPACING.md, backgroundColor: COLORS.surface },
  yesNoBtnActive: { borderColor: COLORS.lime, backgroundColor: COLORS.limeSoft },
  yesNoBtnNo: { borderColor: COLORS.error, backgroundColor: '#FFEBEE' },
  yesNoText: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.textSub },
  yesNoTextActive: { color: COLORS.dark },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  tagChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  tagChipActive: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  tagText: { fontSize: FS.sm, color: COLORS.textSub },
  tagTextActive: { color: COLORS.dark, fontWeight: FW.semibold },
  commentWrap: { marginBottom: SPACING.lg },
  commentInput: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: SPACING.md, fontSize: FS.md, color: COLORS.text, height: 120, textAlignVertical: 'top' },
  charCount: { fontSize: FS.xs, color: COLORS.textMuted, textAlign: 'right', marginTop: 4 },
  submitBtn: { backgroundColor: COLORS.dark, borderRadius: RADIUS.pill, paddingVertical: SPACING.md + 2, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.4 },
  submitText: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.textOnDark },
});
