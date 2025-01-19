import Screen from '@/components/screen';
import SuccessStoryCard from '@/components/success-story-card';
import { useFetchAll } from '@/hooks/useFetch';
import { FirebaseCollections } from '@/lib/constants';
import { setCurrentScreenName } from '@/redux/global/currentScreenName';
import { setItems } from '@/redux/global/items';
import { Item } from '@/types/entities.types';

import React, { useEffect } from 'react';
import { FlatList, Linking, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
export default function App() {
  const dispatch = useDispatch();
  const itemsFromStore = useSelector((state: any) => state.items);
  const { data: items, loading, refetch } = useFetchAll<Item>({
    collection: FirebaseCollections.LOST_ITEMS,
    cachedData: [...itemsFromStore.values()],
    cache: (data) => {
      dispatch(setItems(data))
    },
    recursivefetchers: [{
      collectionName: FirebaseCollections.ITEMS,
      idPropertyName: "item",
      propertyName: "item"
    },
    {
      collectionName: FirebaseCollections.PROFILES,
      idPropertyName: "ownerId",
      propertyName: "owner"
    },
    {
      collectionName: FirebaseCollections.PROFILES,
      idPropertyName: "realOwnerId",
      propertyName: "realOwner"
    },
    ],
    convertersMap: {
      found_lost_at: (value: any) => value.seconds * 1000,
    }
  });
  const data = items.filter((item) => item.delivered);
  useEffect(() => {
    dispatch(setCurrentScreenName('home'));
    Linking.addEventListener('url', (event) => {
      const { url } = event;
      console.log(url);
    });
  }, []);
  return (
    <Screen className='bg-background'>
      <Text className='text-foreground text-4xl font-bold font-secondary text-center pt-8 pb-4'>Success Stories</Text>
      <FlatList
        data={data}
        refreshing={loading}
        onRefresh={refetch}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => <SuccessStoryCard item={item} />}
        contentContainerClassName='gap-2 p-4'
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemText: {
    color: '#666',
    fontSize: 14,
  },
  finderName: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  itemImage: {
    width: '100%',
    height: 200,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  interactions: {
    flexDirection: 'row',
  },
  interactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  interactionText: {
    marginLeft: 4,
    color: '#666',
  },
  readMoreButton: {
    color: '#3498db',
    fontWeight: '500',
  },
});

