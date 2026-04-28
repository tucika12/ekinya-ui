import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, TextInput, Switch, Alert, ActivityIndicator
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';
import { createJobPost } from '../services/jobService';

const JOB_TYPES = ['Hasat', 'Bakım', 'Paketleme', 'Sulama', 'Ekim', 'Diğer'];
const SKILLS = ['Fiziksel dayanıklılık', 'Tarım bilgisi', 'Ekip çalışması', 'Araç kullanımı', 'Depolama', 'Budama'];

export default function CreateJobScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    jobType: '',
    city: '',
    district: '',
    address: '',
    startDate: '15.07.2026',
    endDate: '30.07.2026',
    workerCount: 3,
    skills: [],
    wageType: 'Günlük',
    wage: '',
    escrow: true
  });

  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const toggleSkill = (s) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(s)
        ? f.skills.filter(x => x !== s)
        : [...f.skills, s]
    }));
  };

  const step1Valid = form.title.trim() && form.jobType;
  const step2Valid = form.city.trim() && form.startDate && form.endDate;
  const step3Valid = form.wage.trim();

  const canContinue = [step1Valid, step2Valid, step3Valid][step - 1];

  const handleNext = async () => {
    if (step < 3) {
      setStep(s => s + 1);
    } else {
      setLoading(true);
      try {
        const parseDate = (dStr) => {
          const [d, m, y] = dStr.split('.');
          return new Date(`${y}-${m}-${d}T00:00:00Z`).toISOString();
        };

        const payload = {
          title: form.title,
          description: `${form.description}\n\nİş Türü: ${form.jobType}\nBeceriler: ${form.skills.join(', ')}`,
          location: `${form.city}, ${form.district} - ${form.address}`,
          startDate: parseDate(form.startDate),
          endDate: parseDate(form.endDate),
          hourlyRate: parseFloat(form.wage),
          requiredWorkers: form.workerCount
        };

        await createJobPost(payload);
        Alert.alert('Başarılı', 'İlanınız başarıyla oluşturuldu!', [
          { text: 'Tamam', onPress: () => navigation?.goBack() }
        ]);
      } catch (error) {
        console.error('Job creation error:', error?.response?.data || error);
        Alert.alert('Hata', 'İlan oluşturulurken bir hata oluştu. Lütfen bilgileri kontrol edin.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable
          style={styles.backBtn}
          onPress={() => (step > 1 ? setStep(s => s - 1) : navigation?.goBack())}
        >
          <Ionicons name={step === 1 ? 'close' : 'chevron-back'} size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>Yeni ilan</Text>
        <Text style={styles.stepLabel}>Adım {step}/3</Text>
      </View>

      {/* ── PROGRESS ── */}
      <View style={styles.progressWrap}>
        {[1, 2, 3].map(s => (
          <View
            key={s}
            style={[styles.progressBar, s <= step && styles.progressBarActive]}
          />
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* ══ ADIM 1 ══ */}
        {step === 1 && (
          <>
            <Text style={styles.stepTitle}>Temel Bilgiler</Text>

            <Text style={styles.label}>İş başlığı</Text>
            <TextInput
              style={styles.input}
              value={form.title}
              onChangeText={set('title')}
              placeholder="Örn: Şeftali Hasadı İşçisi"
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={styles.label}>Açıklama</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={form.description}
              onChangeText={set('description')}
              placeholder="İlan detaylarını yaz..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Text style={styles.label}>İş türü</Text>
            <View style={styles.chipGrid}>
              {JOB_TYPES.map(t => (
                <Pressable
                  key={t}
                  style={[styles.typeChip, form.jobType === t && styles.typeChipActive]}
                  onPress={() => set('jobType')(t)}
                >
                  <Text style={[styles.typeChipText, form.jobType === t && styles.typeChipTextActive]}>
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {/* ══ ADIM 2 ══ */}
        {step === 2 && (
          <>
            <Text style={styles.stepTitle}>Detaylar</Text>

            <Text style={styles.label}>Şehir</Text>
            <TextInput
              style={styles.input}
              value={form.city}
              onChangeText={set('city')}
              placeholder="Şehir seç"
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={styles.label}>İlçe</Text>
            <TextInput
              style={styles.input}
              value={form.district}
              onChangeText={set('district')}
              placeholder="İlçe"
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={styles.label}>Adres detayı <Text style={styles.optional}>(opsiyonel)</Text></Text>
            <TextInput
              style={styles.input}
              value={form.address}
              onChangeText={set('address')}
              placeholder="Mahalle, cadde vb."
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={styles.label}>Tarih</Text>
            <View style={styles.dateRow}>
              <Pressable style={styles.datePicker}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.textSub} />
                <Text style={styles.dateText}>{form.startDate}</Text>
              </Pressable>
              <Text style={styles.dateSep}>—</Text>
              <Pressable style={styles.datePicker}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.textSub} />
                <Text style={styles.dateText}>{form.endDate}</Text>
              </Pressable>
            </View>

            <Text style={styles.label}>Kaç işçi gerekiyor?</Text>
            <View style={styles.stepper}>
              <Pressable
                style={styles.stepperBtn}
                onPress={() => set('workerCount')(Math.max(1, form.workerCount - 1))}
              >
                <Ionicons name="remove" size={22} color={COLORS.text} />
              </Pressable>
              <Text style={styles.stepperCount}>{form.workerCount}</Text>
              <Pressable
                style={styles.stepperBtn}
                onPress={() => set('workerCount')(form.workerCount + 1)}
              >
                <Ionicons name="add" size={22} color={COLORS.text} />
              </Pressable>
            </View>

            <Text style={styles.label}>Aranan beceriler</Text>
            <View style={styles.chipRow}>
              {SKILLS.map(s => (
                <Pressable
                  key={s}
                  style={[styles.skillChip, form.skills.includes(s) && styles.skillChipActive]}
                  onPress={() => toggleSkill(s)}
                >
                  <Text style={[styles.skillText, form.skills.includes(s) && styles.skillTextActive]}>
                    {s}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {/* ══ ADIM 3 ══ */}
        {step === 3 && (
          <>
            <Text style={styles.stepTitle}>Ücret</Text>

            <Text style={styles.label}>Ücret tipi</Text>
            <View style={styles.wageTypeRow}>
              {['Saatlik', 'Günlük'].map(t => (
                <Pressable
                  key={t}
                  style={[styles.wageTypeBtn, form.wageType === t && styles.wageTypeBtnActive]}
                  onPress={() => set('wageType')(t)}
                >
                  <Text style={[styles.wageTypeText, form.wageType === t && styles.wageTypeTextActive]}>
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Ücret miktarı</Text>
            <View style={styles.wageInputWrap}>
              <Text style={styles.wagePrefix}>₺</Text>
              <TextInput
                style={styles.wageInput}
                value={form.wage}
                onChangeText={set('wage')}
                placeholder="0"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
              />
            </View>

            {form.wage ? (
              <View style={styles.estimateCard}>
                <Ionicons name="calculator-outline" size={16} color={COLORS.dark} />
                <Text style={styles.estimateText}>
                  Tahmini toplam: ₺{(parseFloat(form.wage || 0) * 15).toLocaleString('tr-TR')}
                  {' '}(15 gün × ₺{form.wage})
                </Text>
              </View>
            ) : null}

            <View style={styles.escrowRow}>
              <View style={styles.escrowLeft}>
                <Text style={styles.escrowLabel}>Escrow ile öde</Text>
                <Text style={styles.escrowDesc}>
                  Para platformda tutulur, iş bittiğinde otomatik aktarılır. %3 platform ücreti.
                </Text>
              </View>
              <Switch
                value={form.escrow}
                onValueChange={set('escrow')}
                trackColor={{ false: COLORS.border, true: COLORS.lime }}
                thumbColor={form.escrow ? COLORS.dark : COLORS.surface}
              />
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── ALT BUTON ── */}
      <View style={styles.footer}>
        {step > 1 && (
          <Pressable
            style={styles.backFooterBtn}
            onPress={() => setStep(s => s - 1)}
          >
            <Text style={styles.backFooterText}>Geri</Text>
          </Pressable>
        )}
        <Pressable
          style={[
            styles.continueBtn,
            step === 1 && { flex: 1 },
            (!canContinue || loading) && styles.continueBtnDisabled,
          ]}
          onPress={handleNext}
          disabled={!canContinue || loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.textOnDark} />
          ) : (
            <Text style={styles.continueBtnText}>
              {step === 3 ? 'Yayınla' : 'Devam et'}
            </Text>
          )}
        </Pressable>
      </View>
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
  stepLabel: { fontSize: FS.sm, fontWeight: FW.medium, color: COLORS.textSub },

  progressWrap: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: 4,
    marginBottom: SPACING.md
  },
  progressBar: {
    flex: 1, height: 4,
    backgroundColor: '#E5E2DA',
    borderRadius: RADIUS.pill
  },
  progressBarActive: { backgroundColor: COLORS.lime },

  content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },

  stepTitle: {
    fontSize: FS.xl, fontWeight: FW.bold,
    color: COLORS.text, marginBottom: SPACING.lg
  },

  label: {
    fontSize: FS.sm, fontWeight: FW.semibold,
    color: COLORS.textSub, marginBottom: 6,
    marginTop: SPACING.md
  },
  optional: { fontWeight: FW.regular, color: COLORS.textMuted },

  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    fontSize: FS.md,
    color: COLORS.text
  },
  multiline: { height: 110, paddingTop: 14, textAlignVertical: 'top' },

  chipGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm
  },
  typeChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surface
  },
  typeChipActive: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  typeChipText: { fontSize: FS.sm, fontWeight: FW.medium, color: COLORS.textSub },
  typeChipTextActive: { color: COLORS.dark, fontWeight: FW.semibold },

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

  stepper: {
    flexDirection: 'row', alignItems: 'center',
    gap: SPACING.md
  },
  stepperBtn: {
    width: 44, height: 44, borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center'
  },
  stepperCount: { fontSize: FS.xxl, fontWeight: FW.bold, color: COLORS.text, minWidth: 40, textAlign: 'center' },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
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

  wageTypeRow: { flexDirection: 'row', gap: SPACING.sm },
  wageTypeBtn: {
    flex: 1, alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surface
  },
  wageTypeBtnActive: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  wageTypeText: { fontSize: FS.md, fontWeight: FW.medium, color: COLORS.textSub },
  wageTypeTextActive: { color: COLORS.dark, fontWeight: FW.bold },

  wageInputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md
  },
  wagePrefix: { fontSize: FS.xl, fontWeight: FW.bold, color: COLORS.textSub, marginRight: 4 },
  wageInput: {
    flex: 1, fontSize: FS.xl, fontWeight: FW.bold,
    color: COLORS.text, paddingVertical: 14
  },

  estimateCard: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.limeSoft,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm
  },
  estimateText: { fontSize: FS.sm, color: COLORS.dark, flex: 1 },

  escrowRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    gap: SPACING.md
  },
  escrowLeft: { flex: 1 },
  escrowLabel: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text, marginBottom: 4 },
  escrowDesc: { fontSize: FS.xs, color: COLORS.textSub, lineHeight: 18 },

  // ── FOOTER ──
  footer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.lg
  },
  backFooterBtn: {
    flex: 1,
    borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center'
  },
  backFooterText: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text },
  continueBtn: {
    flex: 2, backgroundColor: COLORS.dark,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center'
  },
  continueBtnDisabled: { opacity: 0.4 },
  continueBtnText: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.textOnDark }
});
