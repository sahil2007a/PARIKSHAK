import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function AppNavigation() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="module/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="training/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="lesson/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="training/lesson/[lessonId]" options={{ presentation: 'card' }} />
        <Stack.Screen name="scenario/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="training/scenario/[scenarioId]" options={{ presentation: 'card' }} />
        <Stack.Screen name="ar-training/[id]" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="assessment/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="assessment/fire-safety/[chapterId]" options={{ presentation: 'card' }} />
        <Stack.Screen name="module/fundamentals/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="module/ar/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="module/assessment/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="training/assessment/[assessmentId]" options={{ presentation: 'card' }} />
        <Stack.Screen name="certificate/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="certificate/verify" options={{ presentation: 'modal' }} />
        <Stack.Screen name="qr-scanner" options={{ presentation: 'modal' }} />
        <Stack.Screen name="verify/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
        <Stack.Screen name="offline-mode" options={{ presentation: 'modal' }} />
        <Stack.Screen name="offline" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ presentation: 'card' }} />
        <Stack.Screen name="help" options={{ presentation: 'card' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
