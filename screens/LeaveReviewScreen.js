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
const TAGS = ['Profesyonel', 'Saygılı', 'Vaktinde ödedi', 'Açık iletişim', 'Güvenli ortam'];

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

export default function LeaveReviewScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const job = route?.params?.job ?? {
    title: 'Şeftali Hasadı İşçisi',
    farm: 'Bursa Şeftali Bahçesi',
    emoji: '🍑'
  };

  const [overall, setOverall] = useState(0);
  const [cats, setCats] = useState({ 'İş güvenliği': 0, 'İletişim': 0, 'Zaman uyumu': 0, 'Ödeme': 0 });
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (t) => setSelectedTags(prev =>
    prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
  );

  const setCatRating = (cat, val) => setCats(c => ({ ...c, [cat]: val }));

  const canSubmit = overall > 0;

  return (
    <View style={styles.safe}>
      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.closeBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="close" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>Değerlendir</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── İLAN ÖZETİ ── */}
        <View style={styles.jobMini}>
          <View style={styles.jobEmoji}>
            <Text style={styles.emojiText}>{job.emoji}</Text>
          </View>
          <View>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobFarm}>{job.farm}</Text>
          </View>
        </View>

        {/* ── GENEL PUAN ── */}
        <View style={styles.overallWrap}>
          <Text style={styles.overallQuestion}>Bu işi nasıl buldun?</Text>
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

        {/* ── YORUM ── */}
        <Text style={styles.sectionLabel}>Yorumun</Text>
        <View style={styles.commentWrap}>
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder="Deneyimini paylaş..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={5}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{comment.length}/500</Text>
        </View>

        {/* ── ETİKETLER ── */}
        <Text style={styles.sectionLabel}>Etiketler</Text>
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

        {/* ── GÖNDER ── */}
        <Pressable
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          disabled={!canSubmit}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.submitText}>Değerlendirmeyi gönder</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center'
  },
  pageTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },

  content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },

  // ── İLAN ──
  jobMini: {
    flexDirection: 'row', alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    marginTop: SPACING.sm
  },
  jobEmoji: {
    width: 52, height: 52, borderRadius: RADIUS.md,
    backgroundColor: '#001c0e',
    alignItems: 'center', justifyContent: 'center'
  },
  emojiText: { fontSize: 26 },
  jobTitle: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text },
  jobFarm: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 2 },

  // ── GENEL ──
  overallWrap: {
    alignItems: 'center', marginBottom: SPACING.xl
  },
  overallQuestion: {
    fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text,
    marginBottom: SPACING.md
  },
  overallLabel: {
    fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.textSub,
    marginTop: SPACING.sm
  },

  // ── KATEGORİLER ──
  catsWrap: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.xl
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  catLabel: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text },

  // ── YORUM ──
  sectionLabel: {
    fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm
  },
  commentWrap: { marginBottom: SPACING.lg },
  commentInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    fontSize: FS.md, color: COLORS.text,
    height: 120,
    textAlignVertical: 'top'
  },
  charCount: {
    fontSize: FS.xs, color: COLORS.textMuted,
    textAlign: 'right', marginTop: 4
  },

  // ── ETİKETLER ──
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  tagChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surface
  },
  tagChipActive: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  tagText: { fontSize: FS.sm, color: COLORS.textSub },
  tagTextActive: { color: COLORS.dark, fontWeight: FW.semibold },

  // ── GÖNDER ──
  submitBtn: {
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center'
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitText: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.textOnDark }
});
