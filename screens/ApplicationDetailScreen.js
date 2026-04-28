import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, ActivityIndicator
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';
import { getApplicationById } from '../services/jobService';

const STATUS_CONFIG = {
  accepted: {
    icon: 'checkmark-circle',
    bg: COLORS.limeSoft,
    iconColor: COLORS.dark,
    title: 'Kabul edildi! 🎉',
    desc: 'Tebrikler! Çiftçi başvurunu onayladı. QR kodunu hazırla.'
  },
  pending: {
    icon: 'time-outline',
    bg: '#FFF4E5',
    iconColor: '#B45309',
    title: 'Beklemede',
    desc: 'Başvurun çiftçi tarafından henüz incelenmedi. Yakında yanıt alacaksın.'
  },
  rejected: {
    icon: 'close-circle',
    bg: '#FFEBEE',
    iconColor: COLORS.error,
    title: 'Reddedildi',
    desc: 'Üzgünüz, çiftçi bu başvuruyu kabul etmedi. Başka ilanlara bakabilirsin.'
  }
};

const formatDate = (iso) => {
  if (!iso) return null;
  return new Date(iso).toLocaleString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
};

export default function ApplicationDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const routeApp = route?.params?.application ?? {};

  const [application, setApplication] = useState(routeApp);
  const [loading, setLoading] = useState(!!routeApp.id);

  useEffect(() => {
    if (!routeApp.id) return;
    const load = async () => {
      try {
        const data = await getApplicationById(routeApp.id);
        setApplication({
          id:                data.id,
          jobPostId:         data.jobPostId,
          jobTitle:          routeApp.jobTitle  ?? 'İş İlanı',
          farm:              routeApp.farm      ?? '',
          emoji:             routeApp.emoji     ?? '🌾',
          wage:              routeApp.wage      ?? '',
          dates:             routeApp.dates     ?? '',
          status:            data.applicationStatus,
          message:           data.coverLetter   ?? '',
          appliedAt:         data.appliedAt,
          reviewedAt:        data.reviewedAt,
        });
      } catch (e) {
        console.error('ApplicationDetailScreen load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [routeApp.id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.lime} />
        </View>
      </SafeAreaView>
    );
  }

  const config = STATUS_CONFIG[application.status] ?? STATUS_CONFIG.pending;

  // Gerçek tarihlerden timeline oluştur
  const timeline = [
    { label: 'Başvuru yapıldı', time: formatDate(application.appliedAt), done: true },
    { label: 'Yanıt verildi',   time: formatDate(application.reviewedAt), done: !!application.reviewedAt },
  ].filter(t => t.time);

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>Başvuru detayı</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── STATUS HERO ── */}
        <View style={styles.heroWrap}>
          <View style={[styles.heroCircle, { backgroundColor: config.bg }]}>
            <Ionicons name={config.icon} size={44} color={config.iconColor} />
          </View>
          <Text style={styles.heroTitle}>{config.title}</Text>
          <Text style={styles.heroDesc}>{config.desc}</Text>
        </View>

        {/* ── İLAN KARTI ── */}
        <Pressable
          style={styles.jobCard}
          onPress={() => navigation?.navigate('JobDetail', { job: application })}
        >
          <View style={styles.jobEmoji}>
            <Text style={styles.emojiText}>{application.emoji}</Text>
          </View>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{application.jobTitle}</Text>
            <Text style={styles.jobFarm}>{application.farm}</Text>
            <Text style={styles.jobWage}>{application.wage} · {application.dates}</Text>
          </View>
          <View style={styles.detailLink}>
            <Text style={styles.detailLinkText}>Detayı gör</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.lime} />
          </View>
        </Pressable>

        {/* ── ZAMANÇİZELGESİ ── */}
        <Text style={styles.sectionTitle}>Zaman çizelgesi</Text>
        <View style={styles.timelineWrap}>
          {timeline.map((step, idx) => (
            <View key={idx} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineDot, step.done && styles.timelineDotDone]} />
                {idx < timeline.length - 1 && (
                  <View style={[styles.timelineLine, step.done && styles.timelineLineDone]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>{step.label}</Text>
                <Text style={styles.timelineTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── MESAJLAR ── */}
        {application.message ? (
          <>
            <Text style={styles.sectionTitle}>Mesajların</Text>
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>{application.message}</Text>
            </View>
            {application.employerReply && (
              <View style={[styles.messageBubble, styles.replyBubble]}>
                <Text style={styles.replyLabel}>İşveren yanıtı</Text>
                <Text style={styles.messageText}>{application.employerReply}</Text>
              </View>
            )}
          </>
        ) : null}

        {/* ── CTA ── */}
        <View style={styles.ctaWrap}>
          {application.status === 'accepted' && (
            <Pressable
              style={styles.primaryBtn}
              onPress={() => navigation?.navigate('QRCode', { applicationId: application.id })}
            >
              <Ionicons name="qr-code-outline" size={20} color={COLORS.dark} style={{ marginRight: 8 }} />
              <Text style={styles.primaryBtnText}>QR kodumu göster</Text>
            </Pressable>
          )}
          {application.status === 'pending' && (
            <Pressable style={styles.outlineBtn}>
              <Text style={styles.outlineBtnText}>Başvuruyu geri çek</Text>
            </Pressable>
          )}
          {application.status === 'rejected' && (
            <Pressable
              style={styles.darkBtn}
              onPress={() => navigation?.goBack()}
            >
              <Text style={styles.darkBtnText}>Benzer ilanlara bak</Text>
            </Pressable>
          )}
        </View>

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

  content: { paddingHorizontal: SPACING.md },

  // ── HERO ──
  heroWrap: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl
  },
  heroCircle: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.md
  },
  heroTitle: { fontSize: FS.xl, fontWeight: FW.bold, color: COLORS.text, marginBottom: 6 },
  heroDesc: {
    fontSize: FS.sm, color: COLORS.textSub,
    textAlign: 'center', lineHeight: 20,
    paddingHorizontal: SPACING.md
  },

  // ── İLAN KARTI ──
  jobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.md,
    marginBottom: SPACING.xl
  },
  jobEmoji: {
    width: 56, height: 56, borderRadius: RADIUS.md,
    backgroundColor: '#001c0e',
    alignItems: 'center', justifyContent: 'center'
  },
  emojiText: { fontSize: 28 },
  jobInfo: { flex: 1 },
  jobTitle: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text },
  jobFarm: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 2 },
  jobWage: { fontSize: FS.xs, color: COLORS.lime, fontWeight: FW.semibold, marginTop: 4 },
  detailLink: {
    flexDirection: 'row', alignItems: 'center',
    gap: 2
  },
  detailLinkText: { fontSize: FS.xs, color: COLORS.lime, fontWeight: FW.semibold },

  // ── ZAMANÇİZELGESİ ──
  sectionTitle: {
    fontSize: FS.lg, fontWeight: FW.bold,
    color: COLORS.text, marginBottom: SPACING.md
  },
  timelineWrap: { marginBottom: SPACING.xl },
  timelineItem: { flexDirection: 'row', gap: SPACING.md },
  timelineLeft: { alignItems: 'center', width: 12 },
  timelineDot: {
    width: 12, height: 12, borderRadius: 6,
    borderWidth: 2, borderColor: COLORS.border,
    backgroundColor: COLORS.surface
  },
  timelineDotDone: {
    backgroundColor: COLORS.lime,
    borderColor: COLORS.lime
  },
  timelineLine: {
    flex: 1, width: 2,
    backgroundColor: COLORS.border,
    marginVertical: 2,
    minHeight: 30
  },
  timelineLineDone: { backgroundColor: COLORS.lime },
  timelineContent: { flex: 1, paddingBottom: SPACING.lg },
  timelineLabel: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text },
  timelineTime: { fontSize: FS.xs, color: COLORS.textSub, marginTop: 2 },

  // ── MESAJLAR ──
  messageBubble: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm
  },
  replyBubble: { backgroundColor: COLORS.limeSoft, borderColor: COLORS.lime },
  replyLabel: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.dark, marginBottom: 6 },
  messageText: { fontSize: FS.md, color: COLORS.text, lineHeight: 22 },

  // ── CTA ──
  ctaWrap: { marginTop: SPACING.lg },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lime,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md + 2
  },
  primaryBtnText: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.dark },
  outlineBtn: {
    borderWidth: 1.5, borderColor: COLORS.error,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center'
  },
  outlineBtnText: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.error },
  darkBtn: {
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center'
  },
  darkBtnText: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.textOnDark }
});
