// import { auth } from "@/database/fire_base";
import { fetchUserById } from '@/api/database';
import Screen from '@/components/screen';
import { setCurrentUser } from '@/redux/global/current-user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { useDispatch } from 'react-redux';
export default function HomeScreen() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const initUser = async (userId: string) => {
    setLoading(true);
    const user = await fetchUserById(userId);
    if (user) {
      dispatch(setCurrentUser(user));
      router.replace("/home");
    } else {
      console.log("User Not Found");
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
  if (loading) return <Screen className='flex justify-center items-center'>
    <ActivityIndicator color="#111" size="large" />
  </Screen>;
  return <Screen className='flex justify-center items-center'>
    <Text>redirecting...</Text>
  </Screen>
}
