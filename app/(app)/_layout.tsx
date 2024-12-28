import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import NavBar from '@/components/NavBar';
import ScrollScreen from '@/components/scroll-screen';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRoute } from '@react-navigation/native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { name: currentScreenName } = useRoute();
  return (
    <ScrollScreen>
      <NavBar title={currentScreenName} userAvatar="https://avatars.githubusercontent.com/u/12592949" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 80,
            },
          }),
        }}>
        <Tabs.Screen
          name="home"
          options={{
            tabBarShowLabel: false,
            tabBarLabel: () => null,
            tabBarIcon: () => (<AntDesign name="home" size={35} style={{ height: 80 }} color={Colors[colorScheme ?? 'light'].text} />)
          }}
        />
        <Tabs.Screen
          name="declare-item/[option]"
          options={{
            // href: null,
            tabBarIcon: () => <AntDesign name="find" size={35} style={{ height: 80 }} color={Colors[colorScheme ?? 'light'].text} />
          }}
        />

      </Tabs>
    </ScrollScreen>
  );
}
