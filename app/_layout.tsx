import { useColorScheme } from '@/hooks/useColorScheme';
// import 'dotenv/config';
import NavBar from '@/components/NavBar';
import { UserProfileLink } from '@/components/user-profile-link';
import { Colors } from '@/constants/Colors';
import { store } from '@/redux/store';
import { DrawerItemList } from '@react-navigation/drawer';
import { PortalHost } from "@rn-primitives/portal";
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { BadgePlus, FolderSearch, MailCheck } from 'lucide-react-native';
import { useEffect } from 'react';
import { Text, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import "../assets/styles/global.css";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/Ubuntu-Regular.ttf'),
    Galada: require('../assets/fonts/Galada-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);


  if (!loaded) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <View className={`${colorScheme} flex-1 flex items-center`}>
          <NavBar />
          <View className='max-w-screen-md bg-background flex-1 w-full'>
            <Drawer screenOptions={{
              headerShown: false,
              drawerActiveTintColor: Colors[colorScheme].primary,
              drawerLabelStyle: {
                fontFamily: 'SpaceMono',
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 'bold',
                color: Colors[colorScheme].text
              },
              drawerStyle: {
                backgroundColor: Colors[colorScheme].background,
              },

            }}
              drawerContent={(props) => {
                return (
                  <View className={`bg-background h-full p-4 text-sm web:max-w-none`}>
                    <UserProfileLink />
                    <DrawerItemList {...props} />
                  </View>
                )
              }}
              initialRouteName="items"
            >
              <Text className='text-4xl'>anass</Text>
              <Drawer.Screen name="index" options={{
                headerShown: false,
                drawerItemStyle: { display: "none" }

              }} />
              <Drawer.Screen name="register" options={{
                headerShown: false,
                drawerItemStyle: { display: "none" }
              }} />
              <Drawer.Screen name="login" options={{
                headerShown: false,
                drawerItemStyle: { display: "none" }
              }} />
              <Drawer.Screen name="profile/[id]" options={{
                headerShown: false,
                drawerItemStyle: { display: "none" }
              }} />
              <Drawer.Screen name="items" options={{
                headerShown: false,
                drawerIcon: ({ focused }) => <FolderSearch color={focused ? Colors[colorScheme].primary : Colors[colorScheme].text} />,
                drawerLabel: "Items List",
              }} />
              <Drawer.Screen name="home" options={{
                headerShown: false,
                drawerIcon: ({ focused }) => <MailCheck color={focused ? Colors[colorScheme].primary : Colors[colorScheme].text} />,
                drawerLabel: 'Success Stories'
              }} />
              <Drawer.Screen name="item-details/[itemId]" options={{
                headerShown: false,
                drawerItemStyle: { display: "none" }
              }} />
              <Drawer.Screen name="declare-item/[option]" options={{
                headerShown: false,
                drawerIcon: ({ focused }) => <BadgePlus color={focused ? Colors[colorScheme].primary : Colors[colorScheme].text} />,
                drawerLabel: 'Declare Lost Or Found Item'
              }} />
              <Drawer.Screen name="+not-found" options={{
                headerShown: false,
                drawerItemStyle: { display: "none" }
              }} />
              <Drawer.Screen name="edit-profile" options={{
                headerShown: false,
                drawerItemStyle: { display: "none" }
              }} />
            </Drawer>
            <PortalHost />
          </View>
        </View>
      </Provider>
    </GestureHandlerRootView>
  );
}