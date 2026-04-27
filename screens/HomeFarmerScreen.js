import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const mockListings = [
  { id: 1, title: 'Zeytin Toplama', status: 'active',    statusLabel: 'AKTİF', applications: 5,  dates: '15-25 May', workers: 8 },
  { id: 2, title: 'Domates Hasadı', status: 'full',      statusLabel: 'DOLU',  applications: 7,  dates: '10-18 May', workers: 7 },
  { id: 3, title: 'Fidan Dikimi',   status: 'active',    statusLabel: 'AKTİF', applications: 3,  dates: '20-28 May', workers: 4 },
];

const mockApplicants = [
  { id: 1, initials: 'AY', name: 'Ayşe Yılmaz', job: 'Zeytin Toplama', time: '2 sa önce' },
  { id: 2, initials: 'MK', name: 'Mehmet Koç',  job: 'Domates Hasadı', time: '4 sa önce' },
  { id: 3, initials: 'ZD', name: 'Zeynep Doğan',job: 'Fidan Dikimi',   time: 'Dün' },
];

const EMOJIS = { active: '🌱', full: '✅', completed: '🏆', draft: '📝' };

export default function HomeFarmerScreen({ navigation }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* ── ÜST BAR ── */}
      <View style={styles.topBar}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MK</Text>
          </View>
          <View>
            <Text style={styles.greet}>Merhaba 👋</Text>
            <Text style={styles.name}>Mehmet Kaya</Text>
            <Text style={styles.farmName}>Kaya Çiftliği</Text>
          </View>
        </View>
        <Pressable style={styles.bellWrap} onPress={() => navigation?.navigate?.('Notifications')}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
          <View style={styles.notifDot} />
        </Pressable>
      </View>

      {/* ── AKTİF İŞÇİ KARTI ── */}
      <View style={styles.workerCard}>
        <View style={styles.workerCardTop}>
          <View>
            <Text style={styles.workerLabel}>AKTİF İŞÇİ</Text>
            <Text style={styles.workerCount}>12</Text>
            <Text style={styles.workerDesc}>3 ilanında bugün çalışıyor</Text>
          </View>
          <Pressable style={styles.newJobBtn} onPress={() => navigation?.navigate?.('CreateJob')}>
            <Ionicons name="add" size={16} color={COLORS.dark} />
            <Text style={styles.newJobText}>Yeni ilan</Text>
          </Pressable>
        </View>
      </View>

      {/* ── İSTATİSTİK BARI ── */}
      <View style={styles.statsBar}>
        {[
          { value: '24', label: 'Tamamlanan' },
          { value: '₺18K', label: 'Ödenen' },
          { value: '⭐ 4.8', label: 'Ortalama' },
        ].map((s, i) => (
          <View key={i} style={[styles.statCol, i < 2 && styles.statDivider]}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* ── İLANLARIM ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>İlanlarım</Text>
        <Pressable onPress={() => navigation?.navigate?.('FarmerMyJobs')}>
          <Text style={styles.sectionAll}>Tümü →</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
        {mockListings.map(job => (
          <Pressable
            key={job.id}
            style={styles.jobCard}
            onPress={() => navigation?.navigate?.('FarmerApplicants', { job })}
          >
            {/* Üst görsel alanı — öğrenci kartıyla aynı stil */}
            <View style={[styles.jobImage, { backgroundColor: job.status === 'active' ? '#D8EDD8' : '#E8E8E8' }]}>
              <View style={[styles.statusPill, { backgroundColor: job.status === 'active' ? COLORS.lime : '#D0D0D0' }]}>
                <Text style={styles.statusText}>{job.statusLabel}</Text>
              </View>
              <View style={styles.appBadge}>
                <Ionicons name="people-outline" size={11} color={COLORS.dark} />
                <Text style={styles.appBadgeText}>{job.applications}</Text>
              </View>
            </View>
            {/* Kart içeriği */}
            <View style={styles.jobBody}>
              <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
              <Text style={styles.jobDates}>{job.dates}</Text>
              <Text style={styles.jobWorkers}>{job.workers} işçi aranıyor</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* ── YENİ BAŞVURULAR ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Yeni başvurular</Text>
        <Pressable onPress={() => navigation?.navigate?.('FarmerMyJobs')}>
          <Text style={styles.sectionAll}>Tümü →</Text>
        </Pressable>
      </View>
      <View style={styles.applicantList}>
        {mockApplicants.map(a => (
          <View key={a.id} style={styles.applicantRow}>
            <View style={styles.applicantAvatar}>
              <Text style={styles.applicantInitials}>{a.initials}</Text>
            </View>
            <View style={styles.applicantInfo}>
              <Text style={styles.applicantName}>{a.name}</Text>
              <Text style={styles.applicantJob}>{a.job}</Text>
              <Text style={styles.applicantTime}>{a.time}</Text>
            </View>
            <View style={styles.applicantActions}>
              <Pressable style={styles.acceptBtn}>
                <Ionicons name="checkmark" size={16} color={COLORS.success} />
              </Pressable>
              <Pressable style={styles.rejectBtn}>
                <Ionicons name="close" size={16} color={COLORS.error} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      {/* ── KEŞFET BANNER ── */}
      <Pressable style={styles.discoverBanner} onPress={() => navigation?.navigate?.('FarmerDiscover')}>
        <View style={styles.discoverLeft}>
          <Text style={styles.discoverLabel}>İşçi keşfet</Text>
          <Text style={styles.discoverDesc}>Bölgende çalışmaya hazır öğrencileri bul</Text>
        </View>
        <View style={styles.discoverIcon}>
          <Ionicons name="search" size={22} color={COLORS.dark} />
        </View>
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: SPACING.xxl },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, paddingTop: SPACING.lg },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.lime, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: FW.bold, fontSize: FS.sm, color: COLORS.dark },
  greet: { fontSize: FS.xs, color: COLORS.textSub },
  name: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text },
  farmName: { fontSize: FS.xs, color: COLORS.textSub },
  bellWrap: { position: 'relative', padding: SPACING.xs },
  notifDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
  workerCard: { backgroundColor: COLORS.dark, borderRadius: RADIUS.xl, padding: SPACING.lg, marginHorizontal: SPACING.md, marginBottom: SPACING.sm },
  workerCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  workerLabel: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.lime, letterSpacing: 1.5 },
  workerCount: { fontSize: FS.display, fontWeight: FW.bold, color: COLORS.textOnDark, marginTop: 4 },
  workerDesc: { fontSize: FS.sm, color: COLORS.textMuted, marginTop: 2 },
  newJobBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.lime, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  newJobText: { fontSize: FS.sm, fontWeight: FW.bold, color: COLORS.dark },
  statsBar: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, marginHorizontal: SPACING.md, marginBottom: SPACING.sm, padding: SPACING.md },
  statCol: { flex: 1, alignItems: 'center' },
  statDivider: { borderRightWidth: 1, borderRightColor: COLORS.border },
  statValue: { fontSize: FS.xl, fontWeight: FW.bold, color: COLORS.text },
  statLabel: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  sectionTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  sectionAll: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.text },
  hScroll: { paddingLeft: SPACING.md, paddingRight: SPACING.sm, gap: SPACING.sm, paddingBottom: SPACING.sm },
  /* ── iş kartı — öğrenci sayfasıyla özdeş stil ── */
  jobCard: { width: 200, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  jobImage: { height: 110, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-start', padding: SPACING.sm },
  statusPill: { borderRadius: RADIUS.pill, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.dark },
  appBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: COLORS.surface, borderRadius: RADIUS.pill, paddingHorizontal: 8, paddingVertical: 4 },
  appBadgeText: { fontSize: FS.xs, fontWeight: FW.semibold, color: COLORS.dark },
  jobBody: { padding: SPACING.sm + 2 },
  jobTitle: { fontSize: FS.sm, fontWeight: FW.bold, color: COLORS.text },
  jobDates: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 3 },
  jobWorkers: { fontSize: FS.xs, color: COLORS.textMuted, marginTop: 2 },
  applicantList: { paddingHorizontal: SPACING.md, gap: SPACING.sm, marginBottom: SPACING.md },
  applicantRow: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  applicantAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8E8E8', alignItems: 'center', justifyContent: 'center' },
  applicantInitials: { fontWeight: FW.bold, fontSize: FS.sm, color: COLORS.textSub },
  applicantInfo: { flex: 1 },
  applicantName: { fontWeight: FW.semibold, fontSize: FS.md, color: COLORS.text },
  applicantJob: { fontSize: FS.xs, color: COLORS.textSub },
  applicantTime: { fontSize: FS.xs, color: COLORS.textMuted, marginTop: 2 },
  applicantActions: { flexDirection: 'row', gap: SPACING.sm },
  acceptBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8F5DD', alignItems: 'center', justifyContent: 'center' },
  rejectBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFEBEE', alignItems: 'center', justifyContent: 'center' },
  discoverBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: SPACING.md, marginTop: 0, backgroundColor: COLORS.limeSoft, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.lime, padding: SPACING.md },
  discoverLeft: { flex: 1 },
  discoverLabel: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.dark },
  discoverDesc: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 3 },
  discoverIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.lime, alignItems: 'center', justifyContent: 'center' },
});
