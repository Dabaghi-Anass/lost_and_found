import NavBar from '@/components/NavBar';
import { UserProfileLink } from '@/components/user-profile-link';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { formAppNativeLink, isAppInstalled } from '@/lib/utils';
import { store } from '@/redux/store';
import { DrawerItemList } from '@react-navigation/drawer';
import { useNavigationState } from '@react-navigation/native';
import { PortalHost } from "@rn-primitives/portal";
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { BadgePlus, FolderSearch, MailCheck } from 'lucide-react-native';
import { useEffect } from 'react';
import { Platform, Text, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import 'regenerator-runtime/runtime';
import ToastManager from "toastify-react-native";
import "../assets/styles/global.css";

SplashScreen.preventAutoHideAsync().catch(() => {
  console.log("Error preventing auto hide");
});


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/Ubuntu-Regular.ttf'),
    Galada: require('../assets/fonts/Galada-Regular.ttf'),
  });
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        if (loaded) {
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, [loaded, error]);

  useEffect(() => {
    Linking.addEventListener('url', async (event) => {
      const { path } = Linking.parse(event.url);
      if (path) {
        if (Platform.OS !== "web") {
          router.push(`/${path}` as any);
        } else {
          const deepLink = formAppNativeLink(path);
          const hasApp = await isAppInstalled(deepLink);
          console.log({ deepLink, hasApp });
          alert("hasApp: " + hasApp);
          if (hasApp) {
            window.location.href = deepLink;
          }
        }
      }
    });
  }, [])
  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <View className={`${colorScheme} flex-1 flex items-center bg-background`}>
          <NavBar />
          <ToastManager textStyle={{ fontSize: 16 }} height={50} />
          <View className='bg-background flex-1 w-full'>
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
                width: '80%',
              },

            }}
              drawerContent={(props) => {
                const state = useNavigationState((state) => state);
                if (!state) return null;
                const currentRouteName = state.routeNames?.[state.index];

                if (["login", "register"].includes(currentRouteName)) {
                  return null;
                }
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
              <Drawer.Screen name="itemsofuser/[userId]" options={{
                headerShown: false,
                drawerItemStyle: { display: "none" }

              }} />
              <Drawer.Screen name="register" options={{
                headerShown: false,
                drawerItemStyle: { display: "none" }
              }} />
              <Drawer.Screen name="login" options={{
                headerShown: false,
                drawerItemStyle: { display: "none" },
              }} />
              <Drawer.Screen name="profile/[id]" options={{
                headerShown: false,
                drawerItemStyle: { display: "none" }
              }} />
              <Drawer.Screen name="edit-item/[itemId]" options={{
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
              <Drawer.Screen name="item-delivred/[id]" options={{
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