import { logoutUser } from '@/api/auth';
import { fetchDoc, fetchItemsOfUser } from '@/api/database';
import bgPattern from "@/assets/images/pattern.png";
import { AppButton } from '@/components/AppButton';
import { ConfirmationModal } from '@/components/confirmation-modal';
import ItemMinifiedCard from '@/components/item-minified-card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FirebaseCollections } from '@/lib/constants';
import { setCurrentUser } from '@/redux/global/current-user';
import { setCurrentScreenName } from '@/redux/global/currentScreenName';
import { saveUser, saveUser as saveUserAction } from '@/redux/global/users';
import { AppUser, Item } from '@/types/entities.types';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Share2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Linking, Share, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [user, setUser] = useState<AppUser | null>(null);
  const usersMap: Record<string, AppUser> = useSelector((state: any) => state.users);
  const [loading, setLoading] = useState<boolean>(false);
  const currentUser = useSelector((state: any) => state.user);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const theme = useColorScheme();

  function openConfirmationModal() {
    setConfirmationModalVisible(true);
  }
  const handleMessage = () => {
    console.log('Message user:', user?.profile?.id);
  };
  const handleLogout = () => {
    logoutUser().then(() => {
      dispatch(setCurrentUser(null));
      router.replace('/login');
    })
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${user?.email}`);
  };

  const handleShareProfile = () => {
    const link = `lostandfound://profile/${user?.id}`;
    Share.share({
      message: `Check out ${user?.profile?.firstName}'s profile on Lost & Found App: ${link}`,
      url: link,
    });
  };

  async function getUserItems(user: AppUser) {
    if (user?.items && user?.items?.length === 0) return;

    const items = await fetchItemsOfUser(user?.id, [{
      collectionName: FirebaseCollections.ITEMS,
      idPropertyName: "item",
      propertyName: "item"
    },
    {
      collectionName: FirebaseCollections.PROFILES,
      idPropertyName: "ownerId",
      propertyName: "owner"
    },
    ],
      {
        found_lost_at: (value: any) => value.seconds * 1000,
      })
    setUserItems(items);
  }
  async function initUser(refresh: boolean = false) {
    setLoading(true);
    setUserItems([]);
    setUser(null);
    if (id) {
      try {
        let userFromDb
        if (refresh) {
          userFromDb = await fetchDoc<AppUser>(FirebaseCollections.USERS, id as string, [
            {
              idPropertyName: "profileId",
              propertyName: "profile",
              collectionName: FirebaseCollections.PROFILES
            }
          ]);
          dispatch(saveUserAction(userFromDb as any));
        } else {
          if (usersMap[id as string]) {
            userFromDb = usersMap[id as string];
            setUser(usersMap[id as string] as AppUser);
            getUserItems(usersMap[id as string] as AppUser);
            return
          } else {
            userFromDb = await fetchDoc<AppUser>(FirebaseCollections.USERS, id as string, [
              {
                idPropertyName: "profileId",
                propertyName: "profile",
                collectionName: FirebaseCollections.PROFILES
              }
            ]);
            dispatch(saveUserAction(userFromDb as any));
          }
        }
        if (userFromDb) {
          setUser(userFromDb as AppUser);
          dispatch(saveUser(userFromDb as any));
          getUserItems(userFromDb as AppUser)
        }
      } catch (e: any) {
        Alert.alert('Error', e.message);
      } finally {
        setLoading(false);
      }
    } else if (!id) {
      if (refresh) {
        const currentUserId = await AsyncStorage.getItem('userID');
        const currentUser = await fetchDoc<AppUser>(FirebaseCollections.USERS, currentUserId as string, [
          {
            idPropertyName: "profileId",
            propertyName: "profile",
            collectionName: FirebaseCollections.PROFILES
          }
        ]);
        dispatch(setCurrentUser(currentUser));
        if (currentUser) {
          setUser(currentUser);
          dispatch(saveUser(currentUser));
          getUserItems(currentUser as AppUser);
        }
      } else {
        if (currentUser) {
          getUserItems(currentUser as AppUser);
          setUser(currentUser);
        }
      }
    }
    setLoading(false);
  }
  useEffect(() => {
    initUser();
  }, [id]);

  useEffect(() => {
    dispatch(setCurrentScreenName('profile'));
  }, [user])
  if (!user || !currentUser || loading) return <LoadingSpinner visible={true} />
  return (
    <FlatList
      refreshing={loading}
      onRefresh={async () => {
        await initUser(true);
      }}
      keyExtractor={item => item.id || Math.random().toString()} data={[user]} renderItem={({ item }) => (<View className='w-full h-full'>
        <View className='bg-transparent flex items-center justify-center py-4 px-4 relative' >
          <Image source={bgPattern} className='absolute top-0 left-0 right-0 mx-auto' />
          <Image
            source={{ uri: user?.profile?.imageUri || 'https://via.placeholder.com/150' }}
            className='w-32 h-32 rounded-full border-4 border-white'
          />
        </View>
        <View className='bg-background min-h-full rounded-t-3xl p-4'>
          <View className='flex-row w-min items-center justify-between'>
            <Text className='text-foreground text-4xl font-bold font-secondary capitalize max-w-sm web:w-[300px] text-center'>{user?.profile?.firstName} {user?.profile?.lastName}</Text>
            <View className='p-2 gap-4 flex-row items-center justify-center'>
              <Badge variant="secondary">
                <Text className='text-secondary-foreground capitalize'>{user.role}</Text>
              </Badge>
              <Badge variant="default">
                <Text className='text-primary-foreground'>{user.items?.length} items</Text>
              </Badge>
            </View>
          </View>
          <View className='flex-row items-center justify-center gap-4 mt-4'>
            <AppButton size="sm" onPress={handleEmail}>
              <Feather name="mail" size={20} color="#111" />
              <Text className='text-lg'>Email</Text>
            </AppButton>
          </View>
          {currentUser.id === user.id &&
            <View className='flex flex-row items-center justify-center py-8 px-4 gap-4'>
              <Link href="/edit-profile" asChild>
                <AppButton variant="outline" className='p-4 gap-4'>
                  <Text className='text-foreground text-xl'>edit profile</Text>
                  <FontAwesome5 name="user-edit" size={20} color={theme === 'dark' ? "white" : "#222"} />
                </AppButton>
              </Link>
              <ConfirmationModal
                title='Logout'
                description='Are you sure you want to logout?'
                onOpen={openConfirmationModal}
                trigger={(open) => <AppButton variant="destructive" className='gap-4' onPress={() => open?.()}>
                  <Text className='text-white text-xl'>logout</Text>
                  <AntDesign name="logout" size={20} color="white" />
                </AppButton>}
                open={confirmationModalVisible}
                onAccept={() => {
                  handleLogout();
                }}
                onClose={() => {
                  setConfirmationModalVisible(false);
                }}
              />
            </View>
          }
          <View className='items-start justify-center gap-8 m-5'>
            <Text className="text-foreground text-2xl font-semibold">Contact Information</Text>
            <View className='items-start justify-center gap-4'>
              <View className='flex-row items-center justify-center gap-4'>
                <Feather name="phone" size={20} color={theme === "dark" ? "white" : "black"} />
                <Text className="text-foreground text-xl">{user?.profile?.phoneNumber}</Text>
              </View>
              <View className='flex-row items-center justify-center gap-4'>
                <Feather name="mail" size={20} color={theme === "dark" ? "white" : "black"} />
                <Text className="text-foreground text-xl">{user.email}</Text>
              </View>
            </View>
          </View>
          <View className='flex-row items-center gap-4 p-4'>
            <AppButton
              onPress={() => {
                Linking.openURL(`tel:${user?.profile?.phoneNumber}`)
              }}
            >
              <Feather name="phone-call" size={20} color="#333" />
              <Text className='text-accent-foreground text-xl font-bold'>Call {user?.profile?.firstName}</Text>
            </AppButton>
            <AppButton variant="primary" onPress={handleShareProfile}>
              <Share2 size={20} color="white" />
              <Text className='text-white text-xl font-bold'>Share Profile</Text>
            </AppButton>
          </View>
          {userItems.length > 0 &&
            <View className='items-center justify-center gap-2 w-full'>
              <Text className='text-3xl font-bold text-foreground'>Items ({userItems.length})</Text>
              <FlatList
                horizontal
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id || Math.random().toString()}
                data={userItems.slice(0, 3)}
                renderItem={({ item }) => (
                  <ItemMinifiedCard
                    item={item}
                  />
                )}
                contentContainerClassName='gap-4 py-4'
              />
              <Link href={`/`} asChild>
                <AppButton variant="link" size="sm">
                  <Text className='text-primary text-lg'>View all items</Text>
                </AppButton>
              </Link>
            </View>
          }

        </View>
      </View>
      )} />

  );
}