import { useColorScheme } from '@/hooks/useColorScheme';
// import 'dotenv/config';
import { store } from '@/redux/store';
import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Linking, View } from "react-native";
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
    <Provider store={store}>
      <View className={`${colorScheme} w-full h-full`} >
        <Stack initialRouteName='index'>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <PortalHost />
      </View>
    </Provider>
  );
}