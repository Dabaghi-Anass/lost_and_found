import { HapticTab } from '@/components/HapticTab';
import NavBar from '@/components/NavBar';
import ScrollScreen from '@/components/scroll-screen';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRoute } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { name: currentScreenName } = useRoute();
  const user = useSelector((state: any) => state.currentUser);
  return (
    <ScrollScreen>
      <NavBar title={currentScreenName} user={user} />
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
          name="items"
          options={{
            tabBarShowLabel: false,
            tabBarLabel: () => null,
            tabBarIcon: () => (<AntDesign name="find" size={35} style={{ height: 80 }} color={Colors[colorScheme ?? 'light'].text} />)
          }}
        />
        <Tabs.Screen
          name="declare-item/[option]"
          options={{
            // href: null,
            tabBarIcon: () => <MaterialIcons name="create-new-folder" size={35} style={{ height: 80 }} color={Colors[colorScheme ?? 'light'].text} />
          }}
        />
        <Tabs.Screen
          name="item-details/[itemId]"
          options={{
            href: null,
          }}
        />

      </Tabs>
    </ScrollScreen>
  );
}
