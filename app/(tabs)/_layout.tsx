import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import SplashScreen from 'expo-splash-screen';
import { Tabs } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { TabBarIcon } from '@/components/TabBarIcon';
import { Colors } from '@/constants/Colors';

// Prevent automatic splash hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
              headerShown: true,
              tabBarButton: HapticTab,
              tabBarBackground: TabBarBackground,
              tabBarStyle: Platform.select({
                ios: { position: 'absolute' },
                default: {},
              }),
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: 'Home',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                ),
              }}
            />

            <Tabs.Screen
              name="search"
              options={{
                title: 'Search',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
                ),
              }}
            />

            <Tabs.Screen
              name="add-post"
              options={{
                title: 'Add Post',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'add' : 'add-outline'} color={color} />
                ),
              }}
            />

            <Tabs.Screen
              name="favorites"
              options={{
                title: 'Favorites',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'heart' : 'heart-outline'} color={color} />
                ),
              }}
            />

            <Tabs.Screen
              name="profile"
              options={{
                title: 'My Profile',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
                ),
              }}
            />
          </Tabs>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
