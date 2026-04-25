import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ── Auth Ekranları ──
import WelcomeScreen                 from './screens/WelcomeScreen';
import LoginScreen                   from './screens/LoginScreen';
import SignupRoleScreen               from './screens/SignupRoleScreen';
import SignupSuccessScreen            from './screens/SignupSuccessScreen';
import StudentRegisterFormScreen      from './screens/StudentRegisterFormScreen';
import StudentRegisterEmailScreen     from './screens/StudentRegisterEmailScreen';
import StudentRegisterDocumentScreen  from './screens/StudentRegisterDocumentScreen';
import FarmerRegisterFormScreen       from './screens/FarmerRegisterFormScreen';
import FarmerRegisterEmailScreen      from './screens/FarmerRegisterEmailScreen';
import FarmerRegisterDocumentScreen   from './screens/FarmerRegisterDocumentScreen';

// ── Ana Uygulama (Tab Navigator) ──
import BottomTabNavigator             from './navigation/BottomTabNavigator';

// ── Detay Ekranları ──
import JobDetailScreen                from './screens/JobDetailScreen';
import WalletScreen                   from './screens/WalletScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        {/* ── Auth ── */}
        <Stack.Screen name="Welcome"                    component={WelcomeScreen} />
        <Stack.Screen name="Login"                      component={LoginScreen} />
        <Stack.Screen name="SignupRole"                 component={SignupRoleScreen} />
        <Stack.Screen name="StudentRegisterForm"        component={StudentRegisterFormScreen} />
        <Stack.Screen name="StudentRegisterEmail"       component={StudentRegisterEmailScreen} />
        <Stack.Screen name="StudentRegisterDocument"    component={StudentRegisterDocumentScreen} />
        <Stack.Screen name="FarmerRegisterForm"         component={FarmerRegisterFormScreen} />
        <Stack.Screen name="FarmerRegisterEmail"        component={FarmerRegisterEmailScreen} />
        <Stack.Screen name="FarmerRegisterDocument"     component={FarmerRegisterDocumentScreen} />
        <Stack.Screen name="SignupSuccess"              component={SignupSuccessScreen} />

        {/* ── Ana Uygulama ── */}
        <Stack.Screen name="MainTabs"                   component={BottomTabNavigator} />

        {/* ── Detay Ekranları ── */}
        <Stack.Screen name="JobDetail"                  component={JobDetailScreen} />
        <Stack.Screen name="Wallet"                     component={WalletScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
