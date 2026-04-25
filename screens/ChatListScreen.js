import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const mockThreads = [
  { id: 1, initials: 'MK', name: 'Mehmet Kaya', lastMsg: 'Yarın saat 8de bekliyorum', time: '14:30', unread: 2 },
  { id: 2, initials: 'AÇ', name: 'Ali Çelik', lastMsg: 'Tamam görüşürüz', time: 'Dün', unread: 0 },
  { id: 3, initials: 'FY', name: 'Fatma Yıldız', lastMsg: 'Belgeyi gönderdim mi?', time: 'Pzt', unread: 1 },
  { id: 4, initials: 'HK', name: 'Hasan Kara', lastMsg: 'Mükemmel teşekkürler', time: 'Paz', unread: 0 },
  { id: 5, initials: 'SA', name: 'Selin Arslan', lastMsg: 'Ne zaman başlıyoruz?', time: '23 Nis', unread: 3 },
];

const activePartners = [
  { id: 1, initials: 'MK', name: 'Mehmet K.' },
  { id: 2, initials: 'FY', name: 'Fatma Y.' },
  { id: 3, initials: 'SA', name: 'Selin A.' },
];

export default function ChatListScreen({ navigation }) {
  return (
    <View style={styles.screen}>

      {/* ── ÜST BAR ── */}
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Mesajlar</Text>
        <Pressable><Ionicons name="search-outline" size={24} color={COLORS.text} /></Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── AKTİF PARTNERLER ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.partnersRow}>
          {activePartners.map(p => (
            <Pressable key={p.id} style={styles.partnerItem}>
              <View style={styles.partnerAvatar}>
                <Text style={styles.partnerInitials}>{p.initials}</Text>
                <View style={styles.activeDot} />
              </View>
              <Text style={styles.partnerName} numberOfLines={1}>{p.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── THREAD LİSTESİ ── */}
        <View style={styles.threadList}>
          {mockThreads.map((t, i) => (
            <Pressable
              key={t.id}
              style={[styles.threadItem, i < mockThreads.length - 1 && styles.threadBorder]}
              onPress={() => navigation?.navigate?.('ChatDetail', { thread: t })}
            >
              <View style={styles.threadAvatar}>
                <Text style={styles.threadInitials}>{t.initials}</Text>
              </View>
              <View style={styles.threadContent}>
                <View style={styles.threadTopRow}>
                  <Text style={styles.threadName}>{t.name}</Text>
                  <Text style={styles.threadTime}>{t.time}</Text>
                </View>
                <View style={styles.threadBottomRow}>
                  <Text style={styles.threadMsg} numberOfLines={1}>{t.lastMsg}</Text>
                  {t.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadCount}>{t.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* ── BOŞ ALAN FOOTER ── */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, paddingTop: SPACING.lg },
  pageTitle: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.text },
  partnersRow: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, gap: SPACING.md },
  partnerItem: { alignItems: 'center', width: 64 },
  partnerAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E8E8E8', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.lime, marginBottom: 4, position: 'relative' },
  partnerInitials: { fontWeight: FW.bold, fontSize: FS.md, color: COLORS.textSub },
  activeDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.surface },
  partnerName: { fontSize: FS.xs, color: COLORS.textSub, textAlign: 'center' },
  threadList: { borderTopWidth: 1, borderTopColor: COLORS.border },
  threadItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md },
  threadBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  threadAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#E8E8E8', alignItems: 'center', justifyContent: 'center' },
  threadInitials: { fontWeight: FW.semibold, fontSize: FS.md, color: COLORS.textSub },
  threadContent: { flex: 1 },
  threadTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  threadName: { fontWeight: FW.semibold, fontSize: FS.md, color: COLORS.text },
  threadTime: { fontSize: FS.xs, color: COLORS.textMuted },
  threadBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  threadMsg: { fontSize: FS.sm, color: COLORS.textSub, flex: 1 },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.lime, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, marginLeft: SPACING.sm },
  unreadCount: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.dark },
});
