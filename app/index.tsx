// import { auth } from "@/database/fire_base";
import { fetchDoc } from '@/api/database';
import Screen from '@/components/screen';
import { usePushScreen } from '@/hooks/usePushScreen';
import { FirebaseCollections } from '@/lib/constants';
import { setCurrentUser } from '@/redux/global/current-user';
import { AppUser } from '@/types/entities.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, SplashScreen, useFocusEffect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Text } from 'react-native';
import { useDispatch } from 'react-redux';
SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const { goBack } = usePushScreen("")
  const initUser = async (userId: string) => {
    setLoading(true);
    const user = await fetchDoc<AppUser>(FirebaseCollections.USERS, userId as string, [
      {
        idPropertyName: "profileId",
        propertyName: "profile",
        collectionName: FirebaseCollections.PROFILES
      }
    ]);

    if (user) {
      dispatch(setCurrentUser(user));
      SplashScreen.hideAsync();
      router.replace("/items");
    } else {
      SplashScreen.hideAsync();
      router.replace("/login");
    }
    setLoading(false);
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });
    (async () => {
      const userId = await AsyncStorage.getItem("userID");
      if (userId) initUser(userId);
      else router.replace("/login");
    })()
  }, []);

  useFocusEffect(() => {
    router.replace("/items");
  })
  if (loading) return <Screen className='flex justify-center items-center'>
    <ActivityIndicator color="#111" size="large" />
  </Screen>;
  return <Screen className='flex justify-center items-center'>
    <Text>redirecting...</Text>
  </Screen>
}
