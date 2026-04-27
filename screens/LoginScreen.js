import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { login } from '../services/authService';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

const INPUT_BG = '#ECF0FF';
const inputBg = (val) => (val ? INPUT_BG : COLORS.surface);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen e-posta ve şifrenizi girin.');
      return;
    }

    try {
      setLoading(true);
      const data = await login(email, password);
      
      // Navigate based on userType
      if (data.userType === 'Farmer') {
        navigation.replace('FarmerTabs');
      } else {
        navigation.replace('MainTabs');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Bir hata oluştu. Bilgilerinizi kontrol edin.';
      Alert.alert('Giriş Başarısız', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Tekrar hoş geldin 👋</Text>
            <Text style={styles.subtitle}>Giriş yap ve devam et</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg(email) }]}
              placeholder="E-posta"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={[styles.passwordWrap, { backgroundColor: inputBg(password) }]}>
              <TextInput
                style={[styles.input, { flex: 1, backgroundColor: 'transparent' }]}
                placeholder="Şifre"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </Pressable>
            </View>

            <Pressable style={styles.forgotWrap}>
              <Text style={styles.forgotText}>Şifremi unuttum</Text>
            </Pressable>
          </View>

          <View style={styles.buttons}>
            <Pressable
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.textOnDark} />
              ) : (
                <Text style={styles.loginBtnText}>Giriş yap</Text>
              )}
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={styles.signupBtn}
              onPress={() => navigation.navigate('SignupRole')}
            >
              <Text style={styles.signupBtnText}>Hesap oluştur</Text>
            </Pressable>
          </View>

          <Text style={styles.terms}>
            Devam ederek Şartlar ve Gizlilik Politikası'nı kabul edersin.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl
  },

  titleBlock: {
    marginBottom: 32
  },
  title: {
    fontSize: FS.title,
    fontWeight: FW.bold,
    color: COLORS.text
  },
  subtitle: {
    fontSize: FS.md,
    color: COLORS.textSub,
    marginTop: 4
  },

  form: {
    gap: 16
  },
  input: {
    borderRadius: RADIUS.xl,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: FS.md,
    color: COLORS.text
  },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    paddingRight: SPACING.sm
  },
  eyeBtn: { padding: SPACING.sm },
  forgotWrap: { alignSelf: 'flex-end' },
  forgotText: {
    fontSize: FS.sm,
    color: COLORS.textSub
  },

  buttons: {
    marginTop: 24,
    gap: 12
  },
  loginBtn: {
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.pill,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%'
  },
  loginBtnText: {
    fontSize: FS.md,
    fontWeight: FW.semibold,
    color: COLORS.textOnDark
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border
  },
  dividerText: {
    fontSize: FS.sm,
    color: COLORS.textMuted,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 12
  },

  signupBtn: {
    backgroundColor: COLORS.lime,
    borderRadius: RADIUS.pill,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%'
  },
  signupBtnText: {
    fontSize: FS.md,
    fontWeight: FW.semibold,
    color: COLORS.dark
  },

  terms: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: FS.xs,
    color: COLORS.textMuted,
    lineHeight: 18
  }
});
