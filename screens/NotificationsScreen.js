import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Pressable
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const TABS = ['Tümü', 'İş', 'Mesaj', 'Ödeme'];

const MOCK_NOTIFS = [
  { id: '1', type: 'application_accepted', icon: 'briefcase-outline', iconColor: COLORS.lime, bg: COLORS.limeSoft, title: 'Başvurun kabul edildi!', desc: 'Şeftali Hasadı ilanına başvurun çiftçi tarafından kabul edildi.', time: '2 dk önce', read: false, category: 'İş' },
  { id: '2', type: 'new_message', icon: 'chatbubble-outline', iconColor: '#3B82F6', bg: '#EFF6FF', title: 'Mehmet Kaya mesaj gönderdi', desc: 'Servis sabah 06:30\'da kalkıyor, hazır ol.', time: '15 dk önce', read: false, category: 'Mesaj' },
  { id: '3', type: 'payment_received', icon: 'wallet-outline', iconColor: COLORS.success, bg: '#F0FDF4', title: 'Ödeme alındı', desc: '₺1.800 hesabınıza aktarıldı.', time: '1 sa önce', read: false, category: 'Ödeme' },
  { id: '4', type: 'new_review', icon: 'star-outline', iconColor: '#F59E0B', bg: '#FFFBEB', title: 'Yeni bir değerlendirme aldın', desc: 'Mehmet Kaya seni 5 yıldız ile değerlendirdi.', time: '3 sa önce', read: true, category: 'İş' },
  { id: '5', type: 'application_rejected', icon: 'close-circle-outline', iconColor: COLORS.error, bg: '#FFEBEE', title: 'Başvurun reddedildi', desc: 'Kiraz Hasadı ilanına yaptığın başvuru reddedildi.', time: '1 gün önce', read: true, category: 'İş' },
  { id: '6', type: 'new_message', icon: 'chatbubble-outline', iconColor: '#3B82F6', bg: '#EFF6FF', title: 'Ayşe Çelik mesaj gönderdi', desc: 'Merhaba, başvurunuzu inceledik.', time: '1 gün önce', read: true, category: 'Mesaj' },
  { id: '7', type: 'payment_received', icon: 'wallet-outline', iconColor: COLORS.success, bg: '#F0FDF4', title: 'Ödeme alındı', desc: '₺2.400 escrow\'dan hesabınıza aktarıldı.', time: '2 gün önce', read: true, category: 'Ödeme' },
  { id: '8', type: 'new_job', icon: 'briefcase-outline', iconColor: COLORS.lime, bg: COLORS.limeSoft, title: 'Yeni ilan sana göre!', desc: 'Bursa\'da şeftali hasadı için yeni bir ilan yayınlandı.', time: '3 gün önce', read: true, category: 'İş' },
  { id: '9', type: 'new_review', icon: 'star-outline', iconColor: '#F59E0B', bg: '#FFFBEB', title: 'Değerlendirme hatırlatması', desc: 'Bitirdiğin iş için değerlendirme yapmayı unutma!', time: '4 gün önce', read: true, category: 'İş' },
  { id: '10', type: 'payment_received', icon: 'wallet-outline', iconColor: COLORS.success, bg: '#F0FDF4', title: 'Escrow güvencesi aktif', desc: 'Zeytin Hasadı ilanı için ödeme escrow\'a alındı.', time: '5 gün önce', read: true, category: 'Ödeme' },
];

export default function NotificationsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Tümü');
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);

  const filtered = activeTab === 'Tümü'
    ? notifs
    : notifs.filter(n => n.category === activeTab);

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));

  const renderItem = ({ item }) => (
    <Pressable
      style={[styles.notifRow, item.read && styles.notifRowRead]}
      onPress={() => setNotifs(n => n.map(x => x.id === item.id ? { ...x, read: true } : x))}
    >
      {!item.read && <View style={styles.unreadBar} />}
      <View style={[styles.notifIcon, { backgroundColor: item.bg }]}>
        <Ionicons name={item.icon} size={20} color={item.iconColor} />
      </View>
      <View style={styles.notifContent}>
        <Text style={[styles.notifTitle, item.read && styles.notifTitleRead]}>
          {item.title}
        </Text>
        <Text style={styles.notifDesc} numberOfLines={1}>{item.desc}</Text>
        <Text style={styles.notifTime}>{item.time}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>Bildirimler</Text>
        <Pressable onPress={markAllRead}>
          <Text style={styles.readAllLink}>Tümünü oku</Text>
        </Pressable>
      </View>

      {/* ── SEKMELER ── */}
      <View style={styles.tabsWrap}>
        {TABS.map(tab => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ── LİSTE ── */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-off-outline" size={36} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Bildirim yok</Text>
          </View>
        }
      />
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
  readAllLink: { fontSize: FS.sm, fontWeight: FW.semibold, color: COLORS.lime },

  // ── SEKMELER ──
  tabsWrap: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
    gap: 4
  },
  tab: {
    flex: 1, alignItems: 'center',
    paddingVertical: 8,
    borderRadius: RADIUS.pill
  },
  tabActive: { backgroundColor: COLORS.dark },
  tabText: { fontSize: FS.sm, fontWeight: FW.medium, color: COLORS.textSub },
  tabTextActive: { color: COLORS.textOnDark, fontWeight: FW.bold },

  // ── ITEM ──
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
    position: 'relative'
  },
  notifRowRead: { backgroundColor: COLORS.bg },
  unreadBar: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 3,
    backgroundColor: COLORS.lime,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2
  },
  notifIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0
  },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.text, marginBottom: 2 },
  notifTitleRead: { fontWeight: FW.medium, color: COLORS.textSub },
  notifDesc: { fontSize: FS.sm, color: COLORS.textSub, lineHeight: 18 },
  notifTime: { fontSize: FS.xs, color: COLORS.textMuted, marginTop: 4 },

  // ── EMPTY ──
  emptyContainer: { flex: 1 },
  empty: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.limeSoft,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.md
  },
  emptyTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text }
});
