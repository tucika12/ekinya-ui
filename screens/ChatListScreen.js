import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

// Mesajlaşma sistemi henüz backend'de uygulanmadı.
// Ekran şimdilik boş state gösteriyor.

export default function ChatListScreen({ navigation }) {
  const [search, setSearch] = useState('');

  return (
    <View style={styles.screen}>
      {/* ── ÜST BAR ── */}
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Mesajlar</Text>
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
          editable={false}
        />
      </View>

      {/* ── BOŞ DURUM ── */}
      <View style={styles.emptyWrap}>
        <View style={styles.emptyIcon}>
          <Ionicons name="chatbubbles-outline" size={40} color={COLORS.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>Henüz mesaj yok</Text>
        <Text style={styles.emptyDesc}>Mesajlaşma özelliği yakında aktif olacak</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  topBar: {
    paddingHorizontal: SPACING.md, paddingTop: SPACING.lg, paddingBottom: SPACING.sm
  },
  pageTitle: { fontSize: FS.title, fontWeight: FW.bold, color: COLORS.text },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.pill,
    marginHorizontal: SPACING.md, paddingHorizontal: SPACING.md,
    paddingVertical: 10, marginBottom: SPACING.sm, opacity: 0.5
  },
  searchIcon: { marginRight: SPACING.sm },
  searchInput: { flex: 1, fontSize: FS.md, color: COLORS.text },
  emptyWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingBottom: 60
  },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.limeSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm
  },
  emptyTitle: { fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  emptyDesc: { fontSize: FS.sm, color: COLORS.textSub, textAlign: 'center', paddingHorizontal: SPACING.xl },
});
