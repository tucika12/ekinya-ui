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

// Bildirim sistemi henüz backend'de uygulanmadı.
// FCM push bildirimleri AuthService üzerinden token kaydediliyor,
// ancak geçmiş bildirim listesi için endpoint mevcut değil.
// Ekran şimdilik boş state gösteriyor.

const TABS = ['Tümü', 'İş', 'Mesaj', 'Ödeme'];

export default function NotificationsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Tümü');

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>Bildirimler</Text>
        <View style={{ width: 40 }} />
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

      {/* ── BOŞ DURUM ── */}
      <FlatList
        data={[]}
        keyExtractor={item => item.id}
        renderItem={null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.emptyContainer}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-off-outline" size={36} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Bildirim yok</Text>
            <Text style={styles.emptyDesc}>Yeni bildirimler burada görünecek</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center'
  },
  pageTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  tabsWrap: {
    flexDirection: 'row', marginHorizontal: SPACING.md, marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.pill,
    borderWidth: 1, borderColor: COLORS.border, padding: 4, gap: 4
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: RADIUS.pill },
  tabActive: { backgroundColor: COLORS.dark },
  tabText: { fontSize: FS.sm, fontWeight: FW.medium, color: COLORS.textSub },
  tabTextActive: { color: COLORS.textOnDark, fontWeight: FW.bold },
  emptyContainer: { flex: 1 },
  empty: { alignItems: 'center', justifyContent: 'center', marginTop: 80, gap: SPACING.sm },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.limeSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm
  },
  emptyTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  emptyDesc: { fontSize: FS.sm, color: COLORS.textSub },
});
