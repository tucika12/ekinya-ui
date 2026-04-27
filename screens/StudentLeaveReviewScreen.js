import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, TextInput
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const STAR_LABELS = ['', 'Berbat', 'Kötü', 'Orta', 'İyi', 'Mükemmel'];
const CATEGORIES = ['İş güvenliği', 'İletişim', 'Zaman uyumu', 'Ödeme'];
const TAGS = ['Profesyonel', 'Saygılı', 'Vaktinde ödedi', 'Açık iletişim', 'Güvenli ortam', 'Tekrar çalışırım'];

function StarRow({ count, size = 40, onPress }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Pressable
          key={i}
          onPress={() => onPress(i)}
          style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons
            name={i <= count ? 'star' : 'star-outline'}
            size={size - 4}
            color={i <= count ? '#F5A623' : '#DDD'}
          />
        </Pressable>
      ))}
    </View>
  );
}

export default function StudentLeaveReviewScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const farmer = route?.params?.farmer ?? {
    name: 'Mehmet Kaya',
    initials: 'MK',
    farmName: 'Kaya Çiftliği',
    job: 'Zeytin Toplama',
    emoji: '🫒',
    dates: '15-25 Mayıs',
  };

  const [overall, setOverall] = useState(0);
  const [cats, setCats] = useState({
    'İş güvenliği': 0,
    'İletişim': 0,
    'Zaman uyumu': 0,
    'Ödeme': 0,
  });
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [wouldWorkAgain, setWouldWorkAgain] = useState(null);

  const toggleTag = (t) => setSelectedTags(prev =>
    prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
  );
  const setCatRating = (cat, val) => setCats(c => ({ ...c, [cat]: val }));
  const canSubmit = overall > 0;

  return (
    <View style={styles.screen}>

      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>Çiftçiyi Değerlendir</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── ÇİFTÇİ KARTI ── */}
        <View style={styles.farmerCard}>
          <View style={styles.farmerEmojiBox}>
            <Text style={styles.farmerEmoji}>{farmer.emoji}</Text>
          </View>
          <View style={styles.farmerInfo}>
            <Text style={styles.farmerName}>{farmer.name}</Text>
            <Text style={styles.farmerFarm}>{farmer.farmName}</Text>
            <View style={styles.jobTagRow}>
              <Ionicons name="briefcase-outline" size={11} color={COLORS.success} />
              <Text style={styles.jobTagText}>{farmer.job} · {farmer.dates}</Text>
            </View>
          </View>
        </View>

        {/* ── GENEL PUAN ── */}
        <View style={styles.overallWrap}>
          <Text style={styles.overallQuestion}>Bu çiftçiyle çalışmak nasıldı?</Text>
          <StarRow count={overall} size={52} onPress={setOverall} />
          {overall > 0 && (
            <Text style={styles.overallLabel}>{STAR_LABELS[overall]}</Text>
          )}
        </View>

        {/* ── KATEGORİLER ── */}
        <Text style={styles.sectionLabel}>Detaylı değerlendirme</Text>
        <View style={styles.catsWrap}>
          {CATEGORIES.map((cat, idx) => (
            <View
              key={cat}
              style={[styles.catRow, idx === CATEGORIES.length - 1 && { borderBottomWidth: 0 }]}
            >
              <Text style={styles.catLabel}>{cat}</Text>
              <StarRow count={cats[cat]} size={28} onPress={(v) => setCatRating(cat, v)} />
            </View>
          ))}
        </View>

        {/* ── TEKRAR ÇALIŞIR MIYDIN ── */}
        <Text style={styles.sectionLabel}>Tekrar çalışır mıydın?</Text>
        <View style={styles.yesNoRow}>
          <Pressable
            style={[styles.yesNoBtn, wouldWorkAgain === true && styles.yesNoBtnActive]}
            onPress={() => setWouldWorkAgain(true)}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={wouldWorkAgain === true ? COLORS.dark : COLORS.textSub}
            />
            <Text style={[styles.yesNoText, wouldWorkAgain === true && styles.yesNoTextActive]}>
              Evet, kesinlikle
            </Text>
          </Pressable>
          <Pressable
            style={[styles.yesNoBtn, wouldWorkAgain === false && styles.yesNoBtnNo]}
            onPress={() => setWouldWorkAgain(false)}
          >
            <Ionicons
              name="close-circle-outline"
              size={20}
              color={wouldWorkAgain === false ? COLORS.error : COLORS.textSub}
            />
            <Text style={[styles.yesNoText, wouldWorkAgain === false && { color: COLORS.error }]}>
              Hayır
            </Text>
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
              <Text style={[styles.tagText, selectedTags.includes(t) && styles.tagTextActive]}>
                {t}
              </Text>
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
            placeholder="Bu çiftçiyle çalışma deneyimini paylaş..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{comment.length}/500</Text>
        </View>

        {/* ── GÖNDER ── */}
        <Pressable
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          disabled={!canSubmit}
          onPress={() => navigation?.goBack?.()}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.textOnDark} />
          <Text style={styles.submitText}>Değerlendirmeyi gönder</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  pageTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },

  content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },

  // ── ÇİFTÇİ KARTI ──
  farmerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    marginTop: SPACING.sm,
  },
  farmerEmojiBox: {
    width: 56, height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.dark,
    alignItems: 'center', justifyContent: 'center',
  },
  farmerEmoji: { fontSize: 26 },
  farmerInfo: { flex: 1 },
  farmerName: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.text },
  farmerFarm: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 2 },
  jobTagRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  jobTagText: { fontSize: FS.xs, color: COLORS.success, fontWeight: FW.semibold },

  // ── GENEL ──
  overallWrap: { alignItems: 'center', marginBottom: SPACING.xl },
  overallQuestion: {
    fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text,
    marginBottom: SPACING.md, textAlign: 'center',
  },
  overallLabel: {
    fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.textSub,
    marginTop: SPACING.sm,
  },

  // ── KATEGORİLER ──
  sectionLabel: {
    fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text,
    marginBottom: SPACING.sm, marginTop: SPACING.sm,
  },
  catsWrap: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  catLabel: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text },

  // ── EVET / HAYIR ──
  yesNoRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  yesNoBtn: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: SPACING.sm,
    borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  yesNoBtnActive: { borderColor: COLORS.lime, backgroundColor: COLORS.limeSoft },
  yesNoBtnNo: { borderColor: COLORS.error, backgroundColor: '#FFEBEE' },
  yesNoText: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.textSub },
  yesNoTextActive: { color: COLORS.dark },

  // ── ETİKETLER ──
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  tagChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  tagChipActive: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  tagText: { fontSize: FS.sm, color: COLORS.textSub },
  tagTextActive: { color: COLORS.dark, fontWeight: FW.semibold },

  // ── YORUM ──
  commentWrap: { marginBottom: SPACING.lg },
  commentInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    fontSize: FS.md, color: COLORS.text,
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: { fontSize: FS.xs, color: COLORS.textMuted, textAlign: 'right', marginTop: 4 },

  // ── GÖNDER ──
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md + 2,
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitText: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.textOnDark },
});
