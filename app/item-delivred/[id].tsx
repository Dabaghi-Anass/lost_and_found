import { fetchDoc, makeItemDelivred } from '@/api/database';
import DefaultUserImage from "@/assets/images/default-user-image.jpg";
import { AppButton } from '@/components/AppButton';
import ItemMinifiedCard from '@/components/item-minified-card';
import SEO from '@/components/seo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BottomModal from '@/components/ui/bottomModal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFetch } from '@/hooks/useFetch';
import { useFirebaseSearch } from '@/hooks/useFirebaseSearch';
import { usePushScreen } from '@/hooks/usePushScreen';
import { FirebaseCollections } from '@/lib/constants';
import { getImageOrDefaultTo } from '@/lib/utils';
import { saveItem } from '@/redux/global/items';
import { Item, Profile } from '@/types/entities.types';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'toastify-react-native';

export default function RealOwnerSearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const theme = useColorScheme();
  const dispatch = useDispatch();
  const itemMap: Record<string, Item> = useSelector((state: any) => state.items);
  usePushScreen("item-delivred", id as string)
  const { data: item, loading: itemLoading } = useFetch<Item>({
    collection: FirebaseCollections.LOST_ITEMS,
    id: id.toString(),
    cachedData: itemMap[id.toString()],
    cache: (data) => {
      dispatch(saveItem(data as any))
    },
    recursivefetchers: [{
      collectionName: FirebaseCollections.ITEMS,
      propertyName: 'item',
      idPropertyName: 'item',
    }]
  });
  const { data: users, loading: usersLoading, error: usersError, refetch } = useFirebaseSearch<Profile>(FirebaseCollections.PROFILES, searchQuery, ['firstName', 'lastName', 'phoneNumber']);
  async function handleUpdateItemRealOwner(ownerId: string) {
    setLoading(true);
    try {
      if (!id || !item) return;
      await makeItemDelivred(id as string, ownerId);
      item.delivered = true;
      item.realOwnerId = ownerId;
      const realOwnerProfile = await fetchDoc<Profile>(FirebaseCollections.PROFILES, ownerId);
      if (realOwnerProfile) item.realOwner = realOwnerProfile;
      dispatch(saveItem(item as any))
      Toast.success('Item real owner updated successfully', "bottom");
    } catch (error) {
      console.error('Error updating item real owner:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner visible={loading} />
  return (
    <View className='flex-1 items-center bg-background md:web:flex-row'>
      <SEO />
      {itemLoading && <View className='w-full h-48 items-center justify-center'>
        <ActivityIndicator size='large' color={theme === "dark" ? "white" : "black"} />
      </View>}
      {item &&
        <View className='w-full md:web:w-1/3 md:web:h-full h-48 p-4 items-center justify-center' style={{ backgroundColor: item?.item.color }}>
          <ItemMinifiedCard item={item} />
        </View>
      }
      <View className='w-full md:web:w-2/3 h-full p-4'>
        <Text className='text-3xl font-bold my-8 text-foreground text-center capitalize'>
          {item?.type === "found" ? "Tell Us the real owner" : "Tell Us who found your item"}
        </Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000' }]}
            placeholder="Enter owner's name or details"
            placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={[styles.searchButton, { opacity: loading ? 0.7 : 1 }]}
            onPress={() => refetch()}
            disabled={loading}
          >
            {loading ? (
              <Feather name="loader" size={24} color="#fff" />
            ) : (
              <Feather name="search" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        {usersLoading && <View className='w-full h-48 items-center justify-center'>
          <ActivityIndicator size='large' color={theme === "dark" ? "white" : "black"} />
        </View>}
        <FlatList
          keyExtractor={(item, i) => item.id as string}
          data={users}
          ListEmptyComponent={<Text style={[styles.hint, { color: theme === 'dark' ? '#ccc' : '#666' }]}>
            Enter any information that might help identify the real owner, such as name, contact details, or email, etc.
          </Text>}
          contentContainerClassName='gap-4 py-2'
          renderItem={({ item: profile }) => {
            return <View className='w-full flex-row bg-card elevation-sm p-4 items-center justify-between border border-muted rounded-md gap-4'>
              <Avatar style={{
                width: 60,
                height: 60,
              }} alt="user image">
                <AvatarImage style={{
                  width: "100%",
                  height: "100%",
                }} source={getImageOrDefaultTo(profile?.imageUri, DefaultUserImage)} />
                <AvatarFallback>
                  <AntDesign name="user" size={20} color="#6B7280" />
                </AvatarFallback>
              </Avatar>

              <View className='flex-1 ml-4'>
                <Text className='text-lg font-bold capitalize text-foreground'>{profile.firstName} {profile.lastName}</Text>
                <Text className='text-sm text-muted-foreground'>{profile.phoneNumber}</Text>
              </View>
              <BottomModal
                title={`Are you sure you want to select ${profile.firstName} ${profile.lastName} as the real owner of this item?`}
                visible={confirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}>
                <View className='flex-row h-full items-center justify-center gap-4'>
                  <AppButton variant="secondary" className='gap-4 border border-muted' onPress={() => setConfirmationModalOpen(false)}>
                    <Text className='text-xl text-slate-800'>Cancel</Text>
                    <AntDesign name="close" size={20} color="black" />
                  </AppButton>
                  <AppButton variant="success" onPress={() => {
                    setConfirmationModalOpen(false)
                    handleUpdateItemRealOwner(profile.id as string)
                  }}>
                    <Text className='text-white font-bold'>Mark As Item Owner</Text>
                  </AppButton>
                </View>
              </BottomModal>
              <AppButton onPress={() => setConfirmationModalOpen(true)} size="sm" variant="primary">Select</AppButton>



            </View>
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 10,
  },
  hint: {
    fontSize: 14,
    textAlign: 'center',
  },
});

