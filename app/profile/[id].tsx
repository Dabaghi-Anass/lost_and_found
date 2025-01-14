import { logoutUser } from '@/api/auth';
import { fetchDoc, fetchDocsWithIds } from '@/api/database';
import bgPattern from "@/assets/images/pattern.png";
import { AppButton } from '@/components/AppButton';
import { ConfirmationModal } from '@/components/confirmation-modal';
import ItemMinifiedCard from '@/components/item-minified-card';
import ScrollScreen from '@/components/scroll-screen';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FirebaseCollections } from '@/lib/constants';
import { setCurrentUser } from '@/redux/global/current-user';
import { setCurrentScreenName } from '@/redux/global/currentScreenName';
import { AppUser, Item } from '@/types/entities.types';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Share2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Image, Linking, Share, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [user, setUser] = useState<AppUser | null>(null);
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
    console.log(user?.items);
    const items = await fetchDocsWithIds<Item>(FirebaseCollections.ITEMS, user?.items as any[], [{
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
  useEffect(() => {
    (async () => {
      if (id) {
        const user = await fetchDoc<AppUser>(FirebaseCollections.USERS, id as string, [
          {
            idPropertyName: "profileId",
            propertyName: "profile",
            collectionName: FirebaseCollections.PROFILES
          }
        ]);
        if (user) setUser(user as AppUser);
        getUserItems(user as AppUser);
      } else if (!id) {
        getUserItems(currentUser as AppUser);
        setUser(currentUser);
      }
    })()
  }, [id]);
  console.log({ userItems })

  useEffect(() => {
    dispatch(setCurrentScreenName('profile'));
  }, [user])
  console.log(JSON.stringify({ user, currentUser }, null, 2));
  if (!user || !currentUser) return <LoadingSpinner visible={true} />
  return (
    <ScrollScreen className='flex-1'>
      <View className='bg-transparent flex items-center justify-center py-4 px-4 relative' >
        <Image source={bgPattern} className='absolute top-0 left-0 right-0 mx-auto' />
        <Image
          source={{ uri: user.profile?.imageUri || 'https://via.placeholder.com/150' }}
          className='w-32 h-32 rounded-full border-4 border-white'
        />
      </View>
      <View className='bg-background min-h-full rounded-t-3xl p-4'>
        <View className='flex-row w-min items-center justify-between'>
          <Text className='text-foreground text-4xl font-bold font-secondary capitalize max-w-sm web:w-[300px] text-center'>{user.profile?.firstName} {user.profile?.lastName}</Text>
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
          <AppButton variant="primary" onPress={handleMessage} size="sm">
            <Feather name="message-square" size={20} color="white" />
            <Text className='text-lg text-primary-foreground'>Message</Text>
          </AppButton>
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
              <Text className="text-foreground text-xl">{user.profile?.phoneNumber}</Text>
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
              Linking.openURL(`tel:${user.profile?.phoneNumber}`)
            }}
          >
            <Feather name="phone-call" size={20} color="#333" />
            <Text className='text-accent-foreground text-xl font-bold'>Call {user.profile?.firstName}</Text>
          </AppButton>
          <AppButton variant="primary" onPress={handleShareProfile}>
            <Share2 size={20} color="white" />
            <Text className='text-white text-xl font-bold'>Share Profile</Text>
          </AppButton>
        </View>
        {userItems.length > 0 &&
          <View className='items-center justify-center gap-2'>
            <Text className='text-xl font-bold text-foreground'>Items ({user.items.length})</Text>
            {userItems.slice(0, 3).map((item) => (
              <ItemMinifiedCard
                key={item.id}
                item={item}

              />
            ))}
            <Link href={`/`} asChild>
              <AppButton variant="link" size="sm">
                <Text className='text-primary text-lg'>View all items</Text>
              </AppButton>
            </Link>
          </View>
        }

      </View>
    </ScrollScreen>
  );
}