import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

export default function SettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [notifPush,  setNotifPush]  = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifSms,   setNotifSms]   = useState(false);
  const [profilePublic, setProfilePublic] = useState(true);
  const [shareLocation, setShareLocation] = useState(false);
  const [lowData, setLowData] = useState(false);

  return (
    <View style={styles.screen}>
      {/* ── ÜST BAR ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.pageTitle}>Ayarlar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── HESAP ── */}
        <SectionTitle title="HESAP" />
        <View style={styles.group}>
          <MenuItem label="E-posta değiştir"  icon="mail-outline"       last={false} />
          <MenuItem label="Telefon değiştir"  icon="call-outline"       last={false} />
          <MenuItem label="Şifre değiştir"    icon="lock-closed-outline" last={false} />
          <Pressable style={[styles.menuRow, styles.last]}>
            <View style={styles.menuIconWrap}>
              <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            </View>
            <Text style={[styles.menuLabel, { color: COLORS.error }]}>Hesabı sil</Text>
          </Pressable>
        </View>

        {/* ── BİLDİRİMLER ── */}
        <SectionTitle title="BİLDİRİMLER" />
        <View style={styles.group}>
          <SwitchRow label="Push bildirimleri"   value={notifPush}  onChange={setNotifPush}  last={false} />
          <SwitchRow label="E-posta bildirimleri" value={notifEmail} onChange={setNotifEmail} last={false} />
          <SwitchRow label="SMS bildirimleri"    value={notifSms}   onChange={setNotifSms}   last />
        </View>

        {/* ── GİZLİLİK ── */}
        <SectionTitle title="GİZLİLİK" />
        <View style={styles.group}>
          <SwitchRow label="Profilim herkese açık" value={profilePublic}  onChange={setProfilePublic}  last={false} />
          <SwitchRow label="Konumumu paylaş"       value={shareLocation}  onChange={setShareLocation}  last={false} />
          <MenuItem  label="Veri kullanımı"         icon="document-text-outline" last />
        </View>

        {/* ── UYGULAMA ── */}
        <SectionTitle title="UYGULAMA" />
        <View style={styles.group}>
          <MenuItem label="Dil — Türkçe" icon="language-outline" last={false} />
          <SwitchRow label="Düşük veri modu" value={lowData} onChange={setLowData} last />
        </View>

        {/* ── DİĞER ── */}
        <SectionTitle title="DİĞER" />
        <View style={styles.group}>
          <MenuItem label="Hakkımızda"          icon="information-circle-outline" last={false} />
          <MenuItem label="Kullanım şartları"   icon="document-outline"           last={false} />
          <MenuItem label="Gizlilik politikası" icon="shield-outline"             last={false} />
          <View style={[styles.menuRow, styles.last, { justifyContent: 'space-between' }]}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrap}>
                <Ionicons name="code-slash-outline" size={18} color={COLORS.dark} />
              </View>
              <Text style={styles.menuLabel}>Sürüm</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>

        {/* ── ÇIKIŞ ── */}
        <Pressable style={styles.logoutBtn} onPress={() => navigation.navigate('Welcome')}>
          <Text style={styles.logoutText}>Çıkış yap</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function SectionTitle({ title }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function MenuItem({ label, icon, last }) {
  return (
    <Pressable style={[styles.menuRow, last && styles.last]}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIconWrap}>
          <Ionicons name={icon} size={18} color={COLORS.dark} />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </Pressable>
  );
}

function SwitchRow({ label, value, onChange, last }) {
  return (
    <View style={[styles.menuRow, last && styles.last]}>
      <Text style={[styles.menuLabel, { flex: 1 }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: COLORS.border, true: COLORS.lime }}
        thumbColor={value ? COLORS.dark : COLORS.surface}
        ios_backgroundColor={COLORS.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: COLORS.bg },
  topBar:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, },
  backBtn:  { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  pageTitle:{ fontSize: FS.lg, fontWeight: FW.bold, color: COLORS.text },
  content:  { paddingHorizontal: SPACING.md },
  sectionTitle: { fontSize: FS.xs, fontWeight: FW.bold, color: COLORS.textMuted, letterSpacing: 1.5, marginTop: SPACING.lg, marginBottom: SPACING.sm, paddingLeft: 4 },
  group: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.xs },
  menuRow:  { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: SPACING.sm },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 },
  last:     { borderBottomWidth: 0 },
  menuIconWrap: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.limeSoft, alignItems: 'center', justifyContent: 'center' },
  menuLabel:{ fontSize: FS.md, fontWeight: FW.medium, color: COLORS.text },
  versionText: { fontSize: FS.sm, color: COLORS.textMuted },
  logoutBtn:{ backgroundColor: COLORS.error, borderRadius: RADIUS.pill, paddingVertical: SPACING.md, alignItems: 'center', marginTop: SPACING.lg },
  logoutText: { fontSize: FS.md, fontWeight: FW.semibold, color: COLORS.surface }
});
