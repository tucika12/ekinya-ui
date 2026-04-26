import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, TextInput
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const SKILLS = ['Fiziksel dayanıklılık', 'Tarım bilgisi', 'Ekip çalışması', 'Araç kullanımı', 'Budama', 'Depolama'];

export default function ApplyJobScreen({ navigation, route }) {
  const job = route?.params?.job ?? {
    title: 'Şeftali Hasadı İşçisi',
    farm: 'Bursa Şeftali Bahçesi',
    emoji: '🍑',
    wage: '₺850/gün',
    location: 'Bursa',
    distance: '3.2 km'
  };

  const [startDate] = useState('15.07.2025');
  const [endDate] = useState('30.07.2025');
  const [message, setMessage] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [consent, setConsent] = useState(false);

  const toggleSkill = (s) => setSelectedSkills(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
  );

  const canSubmit = startDate && endDate && consent;

  const handleSubmit = () => {
    navigation?.navigate('ApplicationDetail', {
      application: {
        id: Date.now().toString(),
        jobTitle: job.title,
        farm: job.farm,
        emoji: job.emoji,
        status: 'pending',
        message: message || 'Başvuru mesajı yok.',
        wage: job.wage,
        dates: `${startDate} — ${endDate}`
      }
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── ÜST BAR ── */}
      <View style={styles.topBar}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>Başvur</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* ── İLAN ÖZETİ ── */}
        <View style={styles.jobSummary}>
          <View style={styles.jobEmoji}>
            <Text style={styles.emojiText}>{job.emoji}</Text>
          </View>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
            <Text style={styles.jobWage}>{job.wage}</Text>
            <Text style={styles.jobLocation}>{job.location} · {job.distance}</Text>
          </View>
        </View>

        {/* ── MÜSAİTLİK ── */}
        <Text style={styles.sectionLabel}>Çalışabileceğin tarihler</Text>
        <View style={styles.dateRow}>
          <Pressable style={styles.datePicker}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textSub} />
            <Text style={styles.dateText}>{startDate}</Text>
          </Pressable>
          <Text style={styles.dateSep}>—</Text>
          <Pressable style={styles.datePicker}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textSub} />
            <Text style={styles.dateText}>{endDate}</Text>
          </Pressable>
        </View>

        {/* ── MESAJ ── */}
        <Text style={styles.sectionLabel}>
          Mesajın <Text style={styles.optional}>(opsiyonel)</Text>
        </Text>
        <View style={styles.messageWrap}>
          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Daha önce hasat tecrübem var..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{message.length}/500</Text>
        </View>

        {/* ── BECERİLER ── */}
        <Text style={styles.sectionLabel}>Sahip olduğun beceriler</Text>
        <Text style={styles.skillsHint}>İlana göre öneriler</Text>
        <View style={styles.skillsRow}>
          {SKILLS.map(s => (
            <Pressable
              key={s}
              style={[styles.skillChip, selectedSkills.includes(s) && styles.skillChipActive]}
              onPress={() => toggleSkill(s)}
            >
              <Text style={[styles.skillText, selectedSkills.includes(s) && styles.skillTextActive]}>
                {s}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── KVKK ── */}
        <Pressable
          style={styles.consentRow}
          onPress={() => setConsent(c => !c)}
        >
          <View style={[styles.checkbox, consent && styles.checkboxActive]}>
            {consent && <Ionicons name="checkmark" size={14} color={COLORS.dark} />}
          </View>
          <Text style={styles.consentText}>
            Profil bilgilerimin çiftçi ile paylaşılmasına izin veriyorum.
          </Text>
        </Pressable>

        {/* ── GÖNDER ── */}
        <Pressable
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          disabled={!canSubmit}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Başvuruyu gönder</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
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
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center'
  },
  pageTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },

  content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },

  // ── İLAN ──
  jobSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl
  },
  jobEmoji: {
    width: 64, height: 64, borderRadius: RADIUS.md,
    backgroundColor: '#001c0e',
    alignItems: 'center', justifyContent: 'center'
  },
  emojiText: { fontSize: 32 },
  jobInfo: { flex: 1 },
  jobTitle: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text },
  jobWage: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.lime, marginTop: 2 },
  jobLocation: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 2 },

  sectionLabel: {
    fontSize: FS.md, fontWeight: FW.semibold,
    color: COLORS.text, marginBottom: SPACING.sm,
    marginTop: SPACING.lg
  },
  optional: { fontWeight: FW.regular, color: COLORS.textMuted, fontSize: FS.sm },
  skillsHint: { fontSize: FS.xs, color: COLORS.textMuted, marginBottom: SPACING.sm, marginTop: -6 },

  dateRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  datePicker: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14
  },
  dateSep: { fontSize: FS.md, color: COLORS.textMuted },
  dateText: { fontSize: FS.md, color: COLORS.text },

  messageWrap: { marginBottom: SPACING.sm },
  messageInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    fontSize: FS.md, color: COLORS.text,
    height: 110,
    textAlignVertical: 'top'
  },
  charCount: { fontSize: FS.xs, color: COLORS.textMuted, textAlign: 'right', marginTop: 4 },

  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  skillChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surface
  },
  skillChipActive: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  skillText: { fontSize: FS.sm, color: COLORS.textSub },
  skillTextActive: { color: COLORS.dark, fontWeight: FW.semibold },

  consentRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: SPACING.sm, marginTop: SPACING.xl,
    marginBottom: SPACING.lg
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surface, flexShrink: 0,
    marginTop: 1
  },
  checkboxActive: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  consentText: { flex: 1, fontSize: FS.sm, color: COLORS.textSub, lineHeight: 20 },

  submitBtn: {
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center'
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitText: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.textOnDark }
});
