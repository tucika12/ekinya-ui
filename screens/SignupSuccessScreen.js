import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FS, FW } from '../constants/typography';

export default function SignupSuccessScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={64} color={COLORS.dark} />
        </View>

        <Text style={styles.title}>Hesabın hazır! 🌱</Text>
        <Text style={styles.desc}>
          Belgen doğrulanırken uygulamayı keşfedebilirsin.
        </Text>

        <Pressable
          style={styles.btn}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.btnText}>Hadi başlayalım</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: FS.title,
    fontWeight: FW.bold,
    color: COLORS.text,
    marginTop: 32,
    textAlign: 'center',
  },
  desc: {
    fontSize: FS.md,
    color: COLORS.textSub,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },

  btn: {
    marginTop: 48,
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.pill,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  btnText: {
    fontSize: FS.md,
    fontWeight: FW.semibold,
    color: COLORS.textOnDark,
  },
});
