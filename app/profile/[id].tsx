import { logoutUser } from '@/api/auth';
import { fetchDoc, fetchItemsOfUser, getUserById } from '@/api/database';
import DefaultUserImage from '@/assets/images/default-user-image.jpg';
import bgPattern from "@/assets/images/pattern.jpg";
import { AppButton } from '@/components/AppButton';
import ItemMinifiedCard from '@/components/item-minified-card';
import SEO from '@/components/seo';
import { Badge } from '@/components/ui/badge';
import BottomModal from '@/components/ui/bottomModal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePushScreen } from '@/hooks/usePushScreen';
import { FirebaseCollections } from '@/lib/constants';
import { formAppLink, getImageOrDefaultTo } from '@/lib/utils';
import { logout, setCurrentUser } from '@/redux/global/current-user';
import { setCurrentScreenName } from '@/redux/global/currentScreenName';
import { saveUser as saveUserAction } from '@/redux/global/users';
import { AppUser, Item } from '@/types/entities.types';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Linking, Platform, Share, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'toastify-react-native';
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
  usePushScreen("profile", id as string)
  const handleLogout = () => {
    logoutUser().then(() => {
      if (Platform.OS === 'web') window.location.href = '/login';
      dispatch(logout());
      setLoading(false)
    }).catch(err => {
      Toast.error("Error occured please try again later", "bottom");
      if (Platform.OS === 'web') window.location.href = '/login';
      dispatch(logout());
      setLoading(false)
    })
    setLoading(false)
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${user?.email}`);
  };

  const handleShareProfile = () => {
    const link = formAppLink("profile", user?.id);
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(link);
      Toast.success('Link copied to clipboard', "bottom");
      return;
    }
    Share.share({
      message: `Check out ${user?.profile?.firstName}'s profile on Lost & Found App: ${link}`,
      url: link,
    });
  };

  async function getUserItems(user: AppUser) {
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
        deliveredAt: (value: any) => (value?.seconds || 0) * 1000,
      })
    setUserItems(items);
  }

  async function initUser(refresh: boolean = false) {
    setLoading(true);
    setUserItems([]);
    setUser(null);
    if (id && id !== "undefined") {
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
        }
      } catch (e: any) {
        Toast.error("Error occured please try again later", "bottom");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        if (refresh) {
          const currentUserId = await AsyncStorage.getItem('userID');
          const currentUser = await fetchDoc<AppUser>(FirebaseCollections.USERS, currentUserId as string, [
            {
              idPropertyName: "profileId",
              propertyName: "profile",
              collectionName: FirebaseCollections.PROFILES
            }
          ]);
          dispatch(setCurrentUser({ ...(currentUser as any) } as any));
          if (currentUser) {
            setUser(currentUser);
          }
        } else {
          if (currentUser !== null && currentUser?.email) {
            setUser(currentUser);
          } else {
            const id = await AsyncStorage.getItem('userID')
            if (!id || id === 'undefined') {
              setLoading(false);
              router.replace("/login")
            } else {
              const id = await AsyncStorage.getItem("userID");
              if (id) {
                const user = await getUserById(id);
                dispatch(setCurrentUser(user))
                setLoading(false);
              }
              setLoading(false);
            }
          }
        }
      } catch (e: any) {
        Toast.error("Error occured please try again later", "bottom");
      } finally {
        setLoading(false);
      }
    }
    setLoading(false);
  }
  useEffect(() => {
    dispatch(setCurrentScreenName('profile'));
    if (user?.email) {
      dispatch(saveUserAction(user as any));
      getUserItems(user as AppUser);
    }

  }, [user])
  useEffect(() => {
    if (currentUser?.id === user?.id || id === "undefined") {
      dispatch(setCurrentScreenName('profile'));
      setUser(currentUser);
      setLoading(false)
    }
  }, [currentUser])
  useFocusEffect(useCallback(() => {
    initUser();
  }, [id]));
  useFocusEffect(useCallback(() => {
    if (currentUser === null || Object.keys(currentUser).length === 0) router.push("/login");
  }, [currentUser]))

  if (!user || loading) return <LoadingSpinner visible={!user || loading} />
  return (
    <FlatList
      refreshing={loading}
      onRefresh={async () => {
        await initUser(true);
      }}
      keyExtractor={item => item?.id || Math.random().toString()} data={[user]}
      renderItem={({ item: user }) => (<View className='w-full h-full md:web:max-w-1/2 web:m-auto md:web:flex-row bg-background'>
        <SEO
          title={`${user?.profile?.firstName} ${user?.profile?.lastName} Profile on Lost & Found`}
          description={`View ${user?.profile?.firstName} ${user?.profile?.lastName} profile on Lost & Found App`}
          image={getImageOrDefaultTo(user?.profile?.imageUri, DefaultUserImage)}
          url={formAppLink("profile", user?.id)}
        />
        <View className='bg-transparent flex items-center native:justify-center py-16 px-4 relative md:web:w-1/3 md:web:h-full' >
          <Image source={bgPattern} className='absolute top-0 left-0 right-0 mx-auto max-h-[100vh] web:max-h-[100%]' />
          <Image
            source={getImageOrDefaultTo(user?.profile?.imageUri, DefaultUserImage)}
            className='w-32 h-32 rounded-full border-4 border-white max-w-32 max-h-32 object-center aspect-square md:web:scale-150 scale-110 md:web:mt-8'
          />
        </View>
        <View className='bg-background min-h-screen h-full native:rounded-t-3xl p-4 w-full md:web:w-2/3'>
          <View className='flex-row w-min items-center justify-between'>
            <Text className='text-foreground text-4xl font-bold font-secondary capitalize max-w-sm web:w-[300px] text-center'>{user?.profile?.firstName} {user?.profile?.lastName}</Text>
            <View className='p-2 gap-4 flex-row items-center justify-center'>
              <Badge variant="secondary" className={`${user?.role === 'admin' ? 'bg-orange-600' : ''}`}>
                <Text className='text-secondary-foreground capitalize'>{user?.role}</Text>
              </Badge>
              <Badge variant="default">
                <Text className='text-primary-foreground'>{userItems?.length} items</Text>
              </Badge>
            </View>
          </View>
          {currentUser?.id === user?.id &&
            <View className='flex flex-row items-center native:justify-center py-8 px-4 gap-4'>
              <AppButton variant="outline" className='gap-4 border-muted'
                onPress={handleShareProfile}>
                <FontAwesome5 name="share" size={20} color={theme === 'dark' ? "white" : "#222"} />
              </AppButton>
              <Link href="/edit-profile" asChild>
                <AppButton variant="outline" className='gap-4 border-muted'>
                  <Text className='text-foreground text-xl'>edit profile</Text>
                  <FontAwesome5 name="user-edit" size={20} color={theme === 'dark' ? "white" : "#222"} />
                </AppButton>
              </Link>
              <BottomModal
                title='Are you sure you want to logout?'
                visible={confirmationModalVisible}
                onClose={() => setConfirmationModalVisible(false)}>
                <View className='flex-row h-full items-center justify-center gap-4'>
                  <AppButton variant="secondary" className='gap-4 border border-muted' onPress={() => setConfirmationModalVisible(false)}>
                    <Text className='text-xl text-slate-800'>Cancel</Text>
                    <AntDesign name="close" size={20} color="black" />
                  </AppButton>
                  <AppButton variant="destructive" className='gap-4' onPress={() => {
                    setConfirmationModalVisible(false)
                    handleLogout()
                  }}>
                    <Text className='text-white text-xl'>logout</Text>
                    <AntDesign name="logout" size={20} color="white" />
                  </AppButton>
                </View>
              </BottomModal>
              <AppButton variant="destructive" className='gap-4' onPress={() => setConfirmationModalVisible(true)}>
                <Text className='text-white text-xl'>logout</Text>
                <AntDesign name="logout" size={20} color="white" />
              </AppButton>

            </View>
          }
          <View className='items-start justify-center gap-8 mx-5 border-t border-muted py-8'>
            <Text className="text-foreground text-2xl font-semibold">Contact Information</Text>
            <View className='items-start justify-center gap-4'>
              <View className='flex-row items-center justify-center gap-4'>
                <Feather name="phone" size={20} color={theme === "dark" ? "white" : "black"} />
                <Text className="text-foreground text-xl">{user?.profile?.phoneNumber}</Text>
              </View>
              <View className='flex-row items-center justify-center gap-4'>
                <Feather name="mail" size={20} color={theme === "dark" ? "white" : "black"} />
                <Text className="text-foreground text-xl">{user?.email}</Text>
              </View>
            </View>
          </View>
          <View className='flex-row items-center gap-4 p-4 border-b border-muted py-8'>
            <AppButton
              variant="success"
              onPress={() => {
                Linking.openURL(`tel:${user?.profile?.phoneNumber}`)
              }}
            >
              <Feather name="phone-call" size={20} color="white" />
              <Text className='text-white text-xl font-bold ml-2'>Call {user?.profile?.firstName}</Text>
            </AppButton>
            <AppButton
              onPress={handleEmail}>
              <Feather name="mail" size={20} color="#111" />
              <Text className='text-lg'>Email {user?.profile?.firstName}</Text>
            </AppButton>
          </View>
          {userItems.length > 0 &&
            <View className='justify-center gap-2 w-full px-4 my-4'>
              <View className='flex-row gap-2 items-center'>
                <Text className='text-2xl font-bold text-foreground'>Items</Text>
                <View className='px-2 py-1 rounded-lg bg-rose-600'>
                  <Text className='text-xl text-white font-bold'>{userItems.length}</Text>
                </View>
              </View>
              <FlatList
                horizontal
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item?.id || Math.random().toString()}
                data={userItems.slice(0, 3)}
                renderItem={({ item }) => (
                  <ItemMinifiedCard
                    item={item}
                  />
                )}
                contentContainerClassName='gap-4 py-4'
              />
              <Link href={`/itemsofuser/${user?.id}` as any} asChild>
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