import { fetchDoc } from '@/api/database';
import Screen from '@/components/screen';
import { FirebaseCollections } from '@/lib/constants';
import { setCurrentUser } from '@/redux/global/current-user';
import { AppUser } from '@/types/entities.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, SplashScreen, useFocusEffect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { useDispatch } from 'react-redux';
SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const initUser = async (userId: string) => {
    setLoading(true);
    const user = await fetchDoc<AppUser>(FirebaseCollections.USERS, userId as string, [
      {
        idPropertyName: "profileId",
        propertyName: "profile",
        collectionName: FirebaseCollections.PROFILES
      }
    ]);
    if (user === undefined) return;
    if (user !== null && user?.email) {
      dispatch(setCurrentUser(user));
      setTimeout(() => SplashScreen.hideAsync(), 500);
      router.replace("/items");
    } else {
      setTimeout(() => SplashScreen.hideAsync(), 500);
      router.replace("/login");
    }
    setLoading(false);
  }

  useEffect(() => {
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
