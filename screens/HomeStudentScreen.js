import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const mockJobs = [
  { id: 1, title: 'Zeytin Toplama', farm: 'Kaya Çiftliği', location: 'Aydın', distance: '2.3 km', rating: '4.8', wage: '₺600/gün' },
  { id: 2, title: 'Domates Hasadı', farm: 'Demir Tarım', location: 'Antalya', distance: '5.1 km', rating: '4.6', wage: '₺550/gün' },
  { id: 3, title: 'Fidan Dikimi', farm: 'Yeşil Tarla', location: 'İzmir', distance: '3.8 km', rating: '4.9', wage: '₺500/gün' },
];

const quickLinks = [
  { label: 'Belgelerim', icon: 'document-text-outline' },
  { label: 'Başvurularım', icon: 'briefcase-outline' },
  { label: 'QR kodum', icon: 'qr-code-outline' },
  { label: 'Cüzdan', icon: 'wallet-outline' },
];

export default function HomeStudentScreen({ navigation }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* ── ÜST BAR ── */}
      <View style={styles.topBar}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AY</Text>
          </View>
          <View>
            <Text style={styles.greet}>Merhaba 👋</Text>
            <Text style={styles.name}>Ayşe Yılmaz</Text>
          </View>
        </View>
        <Pressable style={styles.bellWrap}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
          <View style={styles.notifDot} />
        </Pressable>
      </View>

      {/* ── ARAMA ── */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
        <TextInput style={styles.searchInput} placeholder="İş ara..." placeholderTextColor={COLORS.textMuted} />
      </View>

      {/* ── KAZANÇ KARTI ── */}
      <View style={styles.earningCard}>
        <Text style={styles.earningLabel}>AKTİF KAZANÇ</Text>
        <Text style={styles.earningAmount}>₺0</Text>
        <Text style={styles.earningDesc}>Henüz aktif iş yok. İlk ilanına başvur.</Text>
        <Pressable style={styles.findJobBtn} onPress={() => navigation?.navigate?.('İlanlar')}>
          <Text style={styles.findJobText}>İş bul →</Text>
        </Pressable>
      </View>

      {/* ── YAKINDAKI İLANLAR ── */}
      <SectionHeader title="Yakındaki ilanlar" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
        {mockJobs.map(job => <JobCard key={job.id} job={job} />)}
      </ScrollView>

      {/* ── ÖNERİLEN İLANLAR ── */}
      <SectionHeader title="Önerilen ilanlar" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
        {[...mockJobs].reverse().map(job => <JobCard key={job.id} job={job} />)}
      </ScrollView>

      {/* ── HIZLI BAĞLANTILAR ── */}
      <View style={styles.quickSection}>
        <Text style={styles.quickTitle}>Hızlı bağlantılar</Text>
        <View style={styles.quickGrid}>
          {quickLinks.map(item => (
            <Pressable key={item.label} style={styles.quickCard}>
              <View style={styles.quickIconWrap}>
                <Ionicons name={item.icon} size={20} color={COLORS.dark} />
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

function SectionHeader({ title }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionAll}>Tümü →</Text>
    </View>
  );
}

function JobCard({ job }) {
  return (
    <View style={styles.jobCard}>
      <View style={styles.jobImage}>
        <View style={styles.wagePill}><Text style={styles.wageText}>{job.wage}</Text></View>
      </View>
      <View style={styles.jobBody}>
        <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
        <Text style={styles.jobFarm}>{job.farm} · {job.location}</Text>
        <View style={styles.jobFooter}>
          <Text style={styles.jobMeta}>📍 {job.distance}</Text>
          <Text style={styles.jobMeta}>⭐ {job.rating}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: SPACING.xxl },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, paddingTop: SPACING.lg },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lime, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: FW.bold, fontSize: FS.sm, color: COLORS.dark },
  greet: { fontSize: FS.xs, color: COLORS.textSub },
  name: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text },
  bellWrap: { position: 'relative', padding: SPACING.xs },
  notifDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: '#ECF0FF', borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: 12, marginHorizontal: SPACING.md, marginBottom: SPACING.md },
  searchInput: { flex: 1, fontSize: FS.md, color: COLORS.text },
  earningCard: { backgroundColor: COLORS.dark, borderRadius: RADIUS.xl, padding: SPACING.lg, marginHorizontal: SPACING.md, marginBottom: SPACING.md },
  earningLabel: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.lime, letterSpacing: 1.5 },
  earningAmount: { fontSize: FS.display, fontWeight: FW.bold, color: COLORS.textOnDark, marginTop: 4 },
  earningDesc: { fontSize: FS.sm, color: COLORS.textMuted, marginTop: 4 },
  findJobBtn: { alignSelf: 'flex-start', backgroundColor: COLORS.lime, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginTop: SPACING.sm },
  findJobText: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.dark },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  sectionTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  sectionAll: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.lime },
  hScroll: { paddingLeft: SPACING.md, paddingRight: SPACING.sm, gap: SPACING.sm, paddingBottom: SPACING.sm },
  jobCard: { width: 240, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  jobImage: { height: 120, backgroundColor: '#D8EDD8', justifyContent: 'flex-end', alignItems: 'flex-end', padding: SPACING.sm },
  wagePill: { backgroundColor: COLORS.lime, borderRadius: RADIUS.pill, paddingHorizontal: 10, paddingVertical: 5 },
  wageText: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.dark },
  jobBody: { padding: SPACING.sm + 2 },
  jobTitle: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.text },
  jobFarm: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 2 },
  jobFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm },
  jobMeta: { fontSize: FS.xs, color: COLORS.textMuted },
  quickSection: { padding: SPACING.md },
  quickTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text, marginBottom: SPACING.sm },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  quickCard: { width: '47%', backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md },
  quickIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.limeSoft, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.text, marginTop: SPACING.sm },
});
