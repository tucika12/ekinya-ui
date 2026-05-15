import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

// Mesajlaşma sistemi henüz backend'de uygulanmadı.
// Ekran şimdilik boş mesaj listesiyle açılıyor;
// kullanıcı mesaj yazabilir ama gönderme sadece local state'e ekleniyor.

export default function ChatDetailScreen({ navigation, route }) {
  const thread = route?.params?.thread;
  const name = thread?.name ?? 'Kullanıcı';
  const initials = thread?.initials
    ?? (name.trim().split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() || '?');

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatRef = useRef(null);

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [{
      id: Date.now().toString(),
      text: input.trim(),
      isMine: true,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      read: false
    }, ...prev]);
    setInput('');
  };

  const renderItem = ({ item }) => {
    if (item.isMine) {
      return (
        <View style={styles.myRow}>
          <View style={styles.myBubble}>
            <Text style={styles.myText}>{item.text}</Text>
            <View style={styles.timeRow}>
              <Text style={styles.myTime}>{item.time}</Text>
              <Ionicons name="checkmark-done" size={13} color={COLORS.dark} opacity={0.6} />
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.theirRow}>
        <View style={styles.theirBubble}>
          <Text style={styles.theirText}>{item.text}</Text>
          <Text style={styles.theirTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* ── ÜST BAR ── */}
      <View style={styles.topBar}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <View style={styles.contactInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View>
            <Text style={styles.contactName}>{name}</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* ── MESAJ ALANI ── */}
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          inverted
          contentContainerStyle={[
            styles.listContent,
            messages.length === 0 && styles.emptyListContent
          ]}
          showsVerticalScrollIndicator={false}
          style={styles.messageList}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="chatbubble-outline" size={36} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>Henüz mesaj yok</Text>
              <Text style={styles.emptySubText}>Mesajlaşma özelliği yakında aktif olacak</Text>
            </View>
          }
        />

        {/* ── ALT INPUT ── */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Mesaj yaz..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            maxHeight={100}
          />
          <Pressable
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={send}
          >
            <Ionicons name="paper-plane" size={18} color={COLORS.dark} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.surface },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.md, paddingVertical: 10, gap: SPACING.sm,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  contactInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  avatar: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.lime,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.dark },
  contactName: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.text },
  messageList: { backgroundColor: COLORS.bg },
  listContent: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, gap: SPACING.sm },
  emptyListContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyWrap: { alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.xl },
  emptyText: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.textSub },
  emptySubText: { fontSize: FS.sm, color: COLORS.textMuted, textAlign: 'center' },
  myRow: { alignItems: 'flex-end', marginVertical: 2 },
  myBubble: {
    backgroundColor: COLORS.lime, borderRadius: 18, borderBottomRightRadius: 4,
    paddingHorizontal: 14, paddingVertical: 10, maxWidth: '75%',
  },
  myText: { fontSize: FS.md, color: COLORS.dark, lineHeight: 20 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4, justifyContent: 'flex-end' },
  myTime: { fontSize: 11, color: COLORS.dark, opacity: 0.6 },
  theirRow: { alignItems: 'flex-start', marginVertical: 2 },
  theirBubble: {
    backgroundColor: COLORS.surface, borderRadius: 18, borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14, paddingVertical: 10, maxWidth: '75%',
  },
  theirText: { fontSize: FS.md, color: COLORS.text, lineHeight: 20 },
  theirTime: { fontSize: 11, color: COLORS.textMuted, marginTop: 4, textAlign: 'right' },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.md, paddingVertical: 10, gap: SPACING.sm,
  },
  textInput: {
    flex: 1, backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: 10,
    fontSize: FS.md, color: COLORS.text, maxHeight: 100,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lime,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
});
