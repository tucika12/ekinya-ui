import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeStudentScreen from '../screens/HomeStudentScreen';
import JobsScreen        from '../screens/JobsScreen';
import QRScannerScreen   from '../screens/QRScannerScreen';
import ChatListScreen    from '../screens/ChatListScreen';
import ProfileScreen     from '../screens/ProfileScreen';

const TABS = [
  { key: 'home',    label: 'Ana Sayfa', icon: 'home-outline',      iconActive: 'home' },
  { key: 'jobs',    label: 'İlanlar',   icon: 'list-outline',       iconActive: 'list' },
  { key: 'qr',      label: '',          icon: 'qr-code',            iconActive: 'qr-code', isQR: true },
  { key: 'chat',    label: 'Sohbet',    icon: 'chatbubble-outline', iconActive: 'chatbubble' },
  { key: 'profile', label: 'Profil',    icon: 'person-outline',     iconActive: 'person' },
];

const SCREENS = {
  home:    HomeStudentScreen,
  jobs:    JobsScreen,
  qr:      QRScannerScreen,
  chat:    ChatListScreen,
  profile: ProfileScreen,
};

export default function BottomTabNavigator({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');

  // Android back button: tab'dayken home'a dön, home'dayken uygulamadan çık
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (activeTab !== 'home') {
          setActiveTab('home');
          return true; // back event'i tüket, root Stack'e gitme
        }
        return false; // home'daysa normal davranış (uygulama kapanır)
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [activeTab])
  );

  const ActiveScreen = SCREENS[activeTab];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── AKTİF EKRAN ── */}
      <View style={styles.screenWrap}>
        <ActiveScreen navigation={navigation} tabNavigation={{ setActiveTab }} />
      </View>

      {/* ── ALT TAB BAR ── */}
      <View style={styles.tabBar}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;

          if (tab.isQR) {
            return (
              <Pressable
                key={tab.key}
                style={styles.qrBtn}
                onPress={() => setActiveTab(tab.key)}
              >
                <Ionicons name="qr-code" size={26} color="#0F1F0F" />
              </Pressable>
            );
          }

          return (
            <Pressable
              key={tab.key}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={22}
                color={isActive ? '#001c0e' : '#999999'}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  screenWrap: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E2DA',
    height: 72,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999999',
  },
  tabLabelActive: {
    color: '#001c0e',
  },
  qrBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#C5F542',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    marginHorizontal: 8,
    shadowColor: '#001c0e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
