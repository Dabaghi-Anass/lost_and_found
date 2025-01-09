import { HapticTab } from '@/components/HapticTab';
import NavBar from '@/components/NavBar';
import ScrollScreen from '@/components/scroll-screen';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ScrollScreen>
      <NavBar />
      <Link href='/declare-item/lost' className='absolute left-5 bottom-24 bg-background p-2 rounded-full border-4 border-[hsl(250,100%,70%)] z-30'>
        <MaterialIcons name="create-new-folder" size={35} color="hsl(250,100%,70%)" />
      </Link>
      <Tabs
        initialRouteName='items'
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
            tabBarIcon: () => (<AntDesign name="find" size={30} style={{ height: 70 }} color={Colors[colorScheme ?? 'light'].text} />)
          }}
        />
        <Tabs.Screen
          name="profile/[id]"
          options={{
            tabBarShowLabel: false,
            href: null,
            tabBarLabel: () => null,
            tabBarIcon: () => (<AntDesign name="user" size={35} style={{ height: 80 }} color={Colors[colorScheme ?? 'light'].text} />)
          }}
        />
        <Tabs.Screen
          name="edit-profile"
          options={{
            tabBarShowLabel: false,
            href: null,
            tabBarLabel: () => null,
          }}
        />
        <Tabs.Screen
          name="declare-item/[option]"
          options={{
            href: null,
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
