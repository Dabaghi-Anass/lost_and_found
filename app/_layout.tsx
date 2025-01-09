import { useColorScheme } from '@/hooks/useColorScheme';
// import 'dotenv/config';
import { store } from '@/redux/store';
import { PortalHost } from "@rn-primitives/portal";
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Linking, StatusBar, View } from "react-native";
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

  useEffect(() => {
    Linking.addEventListener('url', (event) => {
      const { url } = event;
      console.log(url);
    });
  }, []);

  const linking = {
    prefixes: ['lostandfound://'],
    config: {
      screens: {
        Home: 'home',
        Profile: 'profile/:id',
        Item: 'item/:id',
      },
    },
  };
  if (!loaded) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <View className={`${colorScheme} w-full h-full`} >
          <Drawer>
            <Drawer.Screen name="index" options={{ headerShown: false }} />
            <Drawer.Screen name="register" options={{ headerShown: false }} />
            <Drawer.Screen name="login" options={{ headerShown: false }} />
            <Drawer.Screen name="(app)" options={{ headerShown: false }} />
            <Drawer.Screen name="+not-found" />
          </Drawer>
          <StatusBar animated={true} barStyle="default" />
          <PortalHost />
        </View>
      </Provider>
    </GestureHandlerRootView>
  );
}