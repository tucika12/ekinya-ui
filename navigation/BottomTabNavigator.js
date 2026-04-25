import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeStudentScreen from '../screens/HomeStudentScreen';
import JobsScreen        from '../screens/JobsScreen';
import QRScannerScreen   from '../screens/QRScannerScreen';
import ChatListScreen    from '../screens/ChatListScreen';
import ProfileScreen     from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function QRTabButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        top: -18,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#C5F542',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0F1F0F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
      }}
    >
      <Ionicons name="qr-code" size={26} color="#0F1F0F" />
    </Pressable>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0F1F0F',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E2DA',
          borderTopWidth: 1,
          height: 72,
          paddingTop: 8,
          paddingBottom: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="AnaSayfa"
        component={HomeStudentScreen}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="İlanlar"
        component={JobsScreen}
        options={{
          tabBarLabel: 'İlanlar',
          tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="QR"
        component={QRScannerScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: (props) => <QRTabButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Sohbet"
        component={ChatListScreen}
        options={{
          tabBarLabel: 'Sohbet',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
