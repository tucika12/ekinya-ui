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

const MOCK_MESSAGES = [
  { id: '1', text: 'Merhaba, şeftali hasadı ilanına başvurdum. Müsait tarihlerim 15-30 Temmuz.', isMine: false, time: '09:14' },
  { id: '2', text: 'Merhaba! Başvurunuzu gördük, teşekkürler.', isMine: true, time: '09:20', read: true },
  { id: '3', text: 'Daha önce hasat deneyiminiz var mı?', isMine: true, time: '09:21', read: true },
  { id: '4', text: 'Evet, geçen yıl aynı bölgede kiraz hasadında çalıştım. Deneyimliyim.', isMine: false, time: '09:35' },
  { id: '5', text: 'Harika! Başlangıç saatiniz sabah 07:00. Servis saat 06:30\'da kalkıyor.', isMine: true, time: '10:02', read: true },
  { id: '6', text: 'Tamam, anladım. Servis nerede kalkıyor?', isMine: false, time: '10:15' },
  { id: 'sep1', isSeparator: true, label: 'Bugün' },
  { id: '7', text: 'Bursa Organize Sanayi bölgesi girişinden. Size konum pinini gönderebilirim.', isMine: true, time: '08:05', read: true },
  { id: '8', text: 'Harika, bekliyorum!', isMine: false, time: '08:10' },
];

export default function ChatDetailScreen({ navigation }) {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const flatRef = useRef(null);

  const send = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      text: input.trim(),
      isMine: true,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setMessages(prev => [newMsg, ...prev]);
    setInput('');
  };

  const renderItem = ({ item }) => {
    if (item.isSeparator) {
      return (
        <View style={styles.separatorWrap}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>{item.label}</Text>
          <View style={styles.separatorLine} />
        </View>
      );
    }
    if (item.isMine) {
      return (
        <View style={styles.myRow}>
          <View style={styles.myBubble}>
            <Text style={styles.myText}>{item.text}</Text>
            <View style={styles.timeRow}>
              <Text style={styles.myTime}>{item.time}</Text>
              <Ionicons name="checkmark-done" size={14} color={COLORS.dark} />
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
    <SafeAreaView style={styles.safe}>
      {/* ── ÜST BAR ── */}
      <View style={styles.topBar}>
        <Pressable style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <View style={styles.contactInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MK</Text>
          </View>
          <View>
            <Text style={styles.contactName}>Mehmet Kaya</Text>
            <Text style={styles.onlineText}>çevrimiçi</Text>
          </View>
        </View>
        <View style={styles.topActions}>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="call-outline" size={20} color={COLORS.text} />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="ellipsis-vertical" size={20} color={COLORS.text} />
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* ── MESAJ LİSTESİ ── */}
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          inverted
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* ── ALT INPUT ── */}
        <View style={styles.inputBar}>
          <Pressable style={styles.attachBtn}>
            <Ionicons name="attach" size={22} color={COLORS.textSub} />
          </Pressable>
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
            <Ionicons name="paper-plane" size={20} color={COLORS.dark} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  // ── ÜST BAR ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.bg,
    alignItems: 'center', justifyContent: 'center'
  },
  contactInfo: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm
  },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.lime,
    alignItems: 'center', justifyContent: 'center'
  },
  avatarText: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.dark },
  contactName: { fontSize: FS.md, fontWeight: FW.bold, color: COLORS.text },
  onlineText: { fontSize: FS.xs, fontWeight: FW.medium, color: COLORS.lime },
  topActions: { flexDirection: 'row', gap: 4 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center'
  },

  // ── LİSTE ──
  listContent: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, gap: SPACING.sm },

  myRow: { alignItems: 'flex-end', marginVertical: 2 },
  myBubble: {
    backgroundColor: COLORS.lime,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '75%'
  },
  myText: { fontSize: FS.md, color: COLORS.dark, lineHeight: 20 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, justifyContent: 'flex-end' },
  myTime: { fontSize: FS.xs, color: COLORS.dark, opacity: 0.6 },

  theirRow: { alignItems: 'flex-start', marginVertical: 2 },
  theirBubble: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '75%'
  },
  theirText: { fontSize: FS.md, color: COLORS.text, lineHeight: 20 },
  theirTime: { fontSize: FS.xs, color: COLORS.textMuted, marginTop: 4, textAlign: 'right' },

  separatorWrap: {
    flexDirection: 'row', alignItems: 'center',
    gap: SPACING.sm, marginVertical: SPACING.sm
  },
  separatorLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  separatorText: {
    fontSize: FS.xs, color: COLORS.textMuted,
    fontWeight: FW.medium,
    backgroundColor: COLORS.bg,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.pill
  },

  // ── INPUT BAR ──
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 12 : 12,
    gap: SPACING.sm
  },
  attachBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center'
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    fontSize: FS.md,
    color: COLORS.text,
    maxHeight: 100
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.lime,
    alignItems: 'center', justifyContent: 'center'
  },
  sendBtnDisabled: { opacity: 0.4 }
});
