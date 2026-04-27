import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const mockThreads = [
  { id: 1, initials: 'MK', name: 'Mehmet Kaya', role: 'Çiftçi', lastMsg: 'Yarın saat 8de bekliyorum', time: '14:30', unread: 2, online: true, job: 'Zeytin Toplama' },
  { id: 2, initials: 'AÇ', name: 'Ali Çelik', role: 'Çiftçi', lastMsg: 'Tamam görüşürüz', time: 'Dün', unread: 0, online: false, job: 'Domates Hasadı' },
  { id: 3, initials: 'FY', name: 'Fatma Yıldız', role: 'Çiftçi', lastMsg: 'Belgeyi gönderdim mi?', time: 'Pzt', unread: 1, online: true, job: 'Fidan Dikimi' },
  { id: 4, initials: 'HK', name: 'Hasan Kara', role: 'Çiftçi', lastMsg: 'Mükemmel teşekkürler', time: 'Paz', unread: 0, online: false, job: 'Çilek Hasadı' },
  { id: 5, initials: 'SA', name: 'Selin Arslan', role: 'İşçi', lastMsg: 'Ne zaman başlıyoruz?', time: '23 Nis', unread: 3, online: true, job: 'Bağbozumu' },
];

const activePartners = mockThreads.filter(t => t.online);

const AVATAR_COLORS = ['#C5F542', '#D4E8C2', '#B8D4A8', '#E8F5DD', '#A8C898'];

export default function ChatListScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tümü');

  const totalUnread = mockThreads.reduce((s, t) => s + t.unread, 0);

  const filtered = mockThreads.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.lastMsg.toLowerCase().includes(search.toLowerCase());
    if (activeFilter === 'Okunmamış') return matchSearch && t.unread > 0;
    return matchSearch;
  });

  return (
    <View style={styles.screen}>

      {/* ── ÜST BAR ── */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.pageTitle}>Mesajlar</Text>
          {totalUnread > 0 && (
            <Text style={styles.unreadHint}>{totalUnread} okunmamış mesaj</Text>
          )}
        </View>
        <View style={styles.topActions}>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="create-outline" size={22} color={COLORS.text} />
          </Pressable>
        </View>
      </View>

      {/* ── ARAMA ── */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Konuşma ara..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </Pressable>
        )}
      </View>

      {/* ── FİLTRE ── */}
      <View style={styles.filterRow}>
        {['Tümü', 'Okunmamış'].map(f => (
          <Pressable
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
            {f === 'Okunmamış' && totalUnread > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{totalUnread}</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── ONLINE PARTNERLER ── */}
        {search.length === 0 && (
          <>
            <Text style={styles.sectionLabel}>Aktif</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storyRow}>
              {activePartners.map((p, idx) => (
                <Pressable
                  key={p.id}
                  style={styles.storyItem}
                  onPress={() => navigation?.navigate?.('ChatDetail', { thread: p })}
                >
                  <View style={styles.storyRing}>
                    <View style={[styles.storyAvatar, { backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }]}>
                      <Text style={styles.storyInitials}>{p.initials}</Text>
                    </View>
                  </View>
                  <View style={styles.onlineDot} />
                  <Text style={styles.storyName} numberOfLines={1}>{p.name.split(' ')[0]}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* ── THREAD LİSTESİ ── */}
        <Text style={styles.sectionLabel}>Konuşmalar</Text>
        <View style={styles.threadList}>
          {filtered.map((t, i) => (
            <Pressable
              key={t.id}
              style={[styles.threadItem, i < filtered.length - 1 && styles.threadBorder, t.unread > 0 && styles.threadUnread]}
              onPress={() => navigation?.navigate?.('ChatDetail', { thread: t })}
            >
              {/* Avatar */}
              <View style={styles.avatarWrap}>
                <View style={[styles.threadAvatar, t.unread > 0 && styles.threadAvatarActive]}>
                  <Text style={[styles.threadInitials, t.unread > 0 && styles.threadInitialsActive]}>{t.initials}</Text>
                </View>
                {t.online && <View style={styles.onlineDotSmall} />}
              </View>

              {/* İçerik */}
              <View style={styles.threadContent}>
                <View style={styles.threadTopRow}>
                  <Text style={[styles.threadName, t.unread > 0 && styles.threadNameBold]}>{t.name}</Text>
                  <Text style={[styles.threadTime, t.unread > 0 && styles.threadTimeActive]}>{t.time}</Text>
                </View>
                {/* İş etiketi */}
                <View style={styles.jobTagRow}>
                  <View style={styles.jobTag}>
                    <Ionicons name="briefcase-outline" size={10} color={COLORS.success} />
                    <Text style={styles.jobTagText}>{t.job}</Text>
                  </View>
                </View>
                <View style={styles.threadBottomRow}>
                  <Text style={[styles.threadMsg, t.unread > 0 && styles.threadMsgBold]} numberOfLines={1}>
                    {t.lastMsg}
                  </Text>
                  {t.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadCount}>{t.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          ))}

          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={40} color={COLORS.border} />
              <Text style={styles.emptyText}>Konuşma bulunamadı</Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: SPACING.md, paddingTop: SPACING.lg, paddingBottom: SPACING.sm },
  pageTitle: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.text },
  unreadHint: { fontSize: FS.xs, color: COLORS.success, fontWeight: FW.semibold, marginTop: 2 },
  topActions: { flexDirection: 'row', gap: SPACING.sm, paddingTop: 4 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.pill, marginHorizontal: SPACING.md, paddingHorizontal: SPACING.md, paddingVertical: 10, marginBottom: SPACING.sm },
  searchIcon: { marginRight: SPACING.sm },
  searchInput: { flex: 1, fontSize: FS.md, color: COLORS.text },
  filterRow: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: 6, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  filterChipActive: { backgroundColor: COLORS.dark, borderColor: COLORS.dark },
  filterChipText: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.textSub },
  filterChipTextActive: { color: COLORS.textOnDark },
  filterBadge: { width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.lime, alignItems: 'center', justifyContent: 'center' },
  filterBadgeText: { fontSize: 10, fontWeight: FW.bold, color: COLORS.dark },
  sectionLabel: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.textMuted, letterSpacing: 1.2, paddingHorizontal: SPACING.md, marginBottom: SPACING.sm, marginTop: SPACING.xs },
  storyRow: { paddingHorizontal: SPACING.md, gap: SPACING.md, paddingBottom: SPACING.md },
  storyItem: { alignItems: 'center', width: 68, position: 'relative' },
  storyRing: { width: 64, height: 64, borderRadius: 32, borderWidth: 2.5, borderColor: COLORS.lime, padding: 3, marginBottom: 4 },
  storyAvatar: { flex: 1, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  storyInitials: { fontWeight: FW.bold, fontSize: FS.md, color: COLORS.dark },
  storyName: { fontSize: FS.xs, color: COLORS.textSub, textAlign: 'center', fontWeight: FW.medium },
  onlineDot: { position: 'absolute', bottom: 22, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.bg },
  threadList: { backgroundColor: COLORS.surface, marginHorizontal: SPACING.md, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  threadItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md },
  threadBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  threadUnread: { backgroundColor: '#FAFFF5' },
  avatarWrap: { position: 'relative' },
  threadAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#E8E8E8', alignItems: 'center', justifyContent: 'center' },
  threadAvatarActive: { backgroundColor: COLORS.limeSoft, borderWidth: 2, borderColor: COLORS.lime },
  threadInitials: { fontWeight: FW.semibold, fontSize: FS.md, color: COLORS.textSub },
  threadInitialsActive: { color: COLORS.dark },
  onlineDotSmall: { position: 'absolute', bottom: 1, right: 1, width: 13, height: 13, borderRadius: 7, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.surface },
  threadContent: { flex: 1 },
  threadTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  threadName: { fontWeight: FW.medium, fontSize: FS.md, color: COLORS.text },
  threadNameBold: { fontWeight: FW.bold },
  threadTime: { fontSize: FS.xs, color: COLORS.textMuted },
  threadTimeActive: { color: COLORS.success, fontWeight: FW.semibold },
  jobTagRow: { marginBottom: 4 },
  jobTag: { flexDirection: 'row', alignItems: 'center', gap: 3, alignSelf: 'flex-start', backgroundColor: COLORS.limeSoft, borderRadius: RADIUS.pill, paddingHorizontal: 6, paddingVertical: 2 },
  jobTagText: { fontSize: 10, color: COLORS.success, fontWeight: FW.semibold },
  threadBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  threadMsg: { fontSize: FS.sm, color: COLORS.textSub, flex: 1 },
  threadMsgBold: { color: COLORS.text, fontWeight: FW.medium },
  unreadBadge: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.dark, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, marginLeft: SPACING.sm },
  unreadCount: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.lime },
  emptyState: { alignItems: 'center', padding: SPACING.xxl, gap: SPACING.sm },
  emptyText: { fontSize: FS.md, color: COLORS.textMuted },
});
