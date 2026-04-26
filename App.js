import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
import FarmerBottomTabNavigator       from './navigation/FarmerBottomTabNavigator';

// ── Detay Ekranları ──
import JobDetailScreen                from './screens/JobDetailScreen';
import WalletScreen                   from './screens/WalletScreen';
import SettingsScreen                 from './screens/SettingsScreen';
import EditProfileScreen              from './screens/EditProfileScreen';
import ChatDetailScreen               from './screens/ChatDetailScreen';
import NotificationsScreen            from './screens/NotificationsScreen';
import MyApplicationsScreen           from './screens/MyApplicationsScreen';
import ApplicationDetailScreen        from './screens/ApplicationDetailScreen';
import CreateJobScreen                from './screens/CreateJobScreen';
import LeaveReviewScreen              from './screens/LeaveReviewScreen';
import ReviewsListScreen              from './screens/ReviewsListScreen';
import PaymentDetailScreen            from './screens/PaymentDetailScreen';
import FilterScreen                   from './screens/FilterScreen';
import ApplyJobScreen                 from './screens/ApplyJobScreen';
import FarmerMyJobsScreen             from './screens/FarmerMyJobsScreen';
import FarmerApplicantsScreen         from './screens/FarmerApplicantsScreen';
import QRCodeScreen                   from './screens/QRCodeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
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
        <Stack.Screen name="FarmerTabs"                 component={FarmerBottomTabNavigator} />

        {/* ── Detay Ekranları ── */}
        <Stack.Screen name="JobDetail"          component={JobDetailScreen} />
        <Stack.Screen name="Wallet"             component={WalletScreen} />
        <Stack.Screen name="Settings"           component={SettingsScreen} />
        <Stack.Screen name="EditProfile"        component={EditProfileScreen} />
        <Stack.Screen name="ChatDetail"         component={ChatDetailScreen} />
        <Stack.Screen name="Notifications"      component={NotificationsScreen} />
        <Stack.Screen name="MyApplications"     component={MyApplicationsScreen} />
        <Stack.Screen name="ApplicationDetail"  component={ApplicationDetailScreen} />
        <Stack.Screen name="CreateJob"          component={CreateJobScreen} />
        <Stack.Screen name="LeaveReview"        component={LeaveReviewScreen} />
        <Stack.Screen name="ReviewsList"        component={ReviewsListScreen} />
        <Stack.Screen name="PaymentDetail"      component={PaymentDetailScreen} />
        <Stack.Screen name="Filter"              component={FilterScreen} />
        <Stack.Screen name="ApplyJob"            component={ApplyJobScreen} />
        <Stack.Screen name="FarmerMyJobs"        component={FarmerMyJobsScreen} />
        <Stack.Screen name="FarmerApplicants"    component={FarmerApplicantsScreen} />
        <Stack.Screen name="QRCode"              component={QRCodeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
