import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, TextInput, Switch
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const JOB_TYPES = ['Hasat', 'Paketleme', 'Bakım', 'Sulama', 'Fidan dikimi', 'Diğer'];
const DISTANCES = ['5 km', '10 km', '25 km', 'Tümü'];

export default function FilterScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [minWage, setMinWage] = useState('');
  const [maxWage, setMaxWage] = useState('');
  const [distance, setDistance] = useState('Tümü');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyEscrow, setOnlyEscrow] = useState(false);
  const [city, setCity] = useState('');

  const toggleType = (t) => setSelectedTypes(prev =>
    prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
  );

  const reset = () => {
    setSelectedTypes([]);
    setMinWage('');
    setMaxWage('');
    setDistance('Tümü');
    setOnlyVerified(false);
    setOnlyEscrow(false);
    setCity('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.closeBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="close-outline" size={24} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>Filtrele</Text>
        <Pressable onPress={reset}>
          <Text style={styles.resetLink}>Sıfırla</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── KONUM ── */}
        <Text style={styles.sectionLabel}>Konum</Text>
        <Pressable style={styles.locationCard}>
          <Text style={city ? styles.locationValue : styles.locationPlaceholder}>
            {city || 'Şehir seç'}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </Pressable>

        {/* ── İŞ TÜRÜ ── */}
        <Text style={styles.sectionLabel}>İş türü</Text>
        <View style={styles.chipRow}>
          {JOB_TYPES.map(t => (
            <Pressable
              key={t}
              style={[styles.chip, selectedTypes.includes(t) && styles.chipActive]}
              onPress={() => toggleType(t)}
            >
              <Text style={[styles.chipText, selectedTypes.includes(t) && styles.chipTextActive]}>
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── ÜCRET ARALIĞI ── */}
        <Text style={styles.sectionLabel}>Ücret aralığı</Text>
        <View style={styles.wageRow}>
          <TextInput
            style={[styles.wageInput, { flex: 1 }]}
            value={minWage}
            onChangeText={setMinWage}
            placeholder="Min ₺"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
          />
          <View style={styles.wageSep} />
          <TextInput
            style={[styles.wageInput, { flex: 1 }]}
            value={maxWage}
            onChangeText={setMaxWage}
            placeholder="Max ₺"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
          />
        </View>
        {(minWage || maxWage) && (
          <Text style={styles.wageHint}>
            Aralık: ₺{minWage || '0'} - ₺{maxWage || '∞'}/gün
          </Text>
        )}

        {/* ── MESAFE ── */}
        <Text style={styles.sectionLabel}>Mesafe</Text>
        <View style={styles.distanceRow}>
          {DISTANCES.map(d => (
            <Pressable
              key={d}
              style={[styles.distChip, distance === d && styles.distChipActive]}
              onPress={() => setDistance(d)}
            >
              <Text style={[styles.distText, distance === d && styles.distTextActive]}>
                {d}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── DOĞRULAMA ── */}
        <Text style={styles.sectionLabel}>Doğrulama</Text>
        <View style={styles.switchGroup}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Sadece doğrulanmış çiftçiler</Text>
            <Switch
              value={onlyVerified}
              onValueChange={setOnlyVerified}
              trackColor={{ false: COLORS.border, true: COLORS.lime }}
              thumbColor={onlyVerified ? COLORS.dark : COLORS.surface}
              ios_backgroundColor={COLORS.border}
            />
          </View>
          <View style={[styles.switchRow, styles.lastSwitch]}>
            <Text style={styles.switchLabel}>Sadece escrow ile ödeme</Text>
            <Switch
              value={onlyEscrow}
              onValueChange={setOnlyEscrow}
              trackColor={{ false: COLORS.border, true: COLORS.lime }}
              thumbColor={onlyEscrow ? COLORS.dark : COLORS.surface}
              ios_backgroundColor={COLORS.border}
            />
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── UYGULA BUTONU ── */}
      <View style={styles.footer}>
        <Pressable style={styles.applyBtn} onPress={() => navigation?.goBack()}>
          <Text style={styles.applyText}>Filtrele</Text>
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
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center'
  },
  pageTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  resetLink: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.lime },

  content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },

  sectionLabel: {
    fontSize: FS.md, fontWeight: FW.bold,
    color: COLORS.text,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm
  },

  locationCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md
  },
  locationValue: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text },
  locationPlaceholder: { fontSize: FS.md, color: COLORS.textMuted },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surface
  },
  chipActive: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  chipText: { fontSize: FS.sm, color: COLORS.textSub, fontWeight: FW.medium },
  chipTextActive: { color: COLORS.dark, fontWeight: FW.semibold },

  wageRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  wageInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    fontSize: FS.md, color: COLORS.text
  },
  wageSep: { width: 16, height: 2, backgroundColor: COLORS.border },
  wageHint: { fontSize: FS.sm, color: COLORS.textSub, marginTop: 6 },

  distanceRow: { flexDirection: 'row', gap: SPACING.sm },
  distChip: {
    flex: 1, alignItems: 'center',
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surface
  },
  distChipActive: { backgroundColor: COLORS.lime, borderColor: COLORS.lime },
  distText: { fontSize: FS.sm, fontWeight: FW.medium, color: COLORS.textSub },
  distTextActive: { color: COLORS.dark, fontWeight: FW.bold },

  switchGroup: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden'
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  lastSwitch: { borderBottomWidth: 0 },
  switchLabel: { fontSize: FS.md, fontWeight: FW.medium, color: COLORS.text, flex: 1 },

  footer: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.lg
  },
  applyBtn: {
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center'
  },
  applyText: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.textOnDark }
});
