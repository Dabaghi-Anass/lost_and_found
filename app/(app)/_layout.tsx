import { HapticTab } from '@/components/HapticTab';
import ScrollScreen from '@/components/scroll-screen';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ScrollScreen>
      {/* <NavBar title={currentScreenName} user={user} /> */}
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
            tabBarIcon: () => (<AntDesign name="find" size={35} style={{ height: 80 }} color={Colors[colorScheme ?? 'light'].text} />)
          }}
        />
        <Tabs.Screen
          name="profile/[id]"
          options={{
            tabBarShowLabel: false,
            tabBarLabel: () => null,
            tabBarIcon: () => (<AntDesign name="user" size={35} style={{ height: 80 }} color={Colors[colorScheme ?? 'light'].text} />)
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
