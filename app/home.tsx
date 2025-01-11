import Screen from '@/components/screen';
import SuccessStoryCard from '@/components/success-story-card';
import { setCurrentScreenName } from '@/redux/global/currentScreenName';
import { Feather } from '@expo/vector-icons';

import React, { useEffect } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

interface SuccessStory {
  id: number;
  loserName: string;
  finderName: string;
  item: string;
  description: string;
  loserAvatar: string;
  finderAvatar: string;
  itemImage: string;
  likes: number;
  comments: number;
}

const successStories: SuccessStory[] = [
  {
    id: 1,
    loserName: "Sarah Johnson",
    finderName: "John Smith",
    item: "Diamond Ring",
    description: "I lost my engagement ring at the beach. Thanks to John and this app, I got it back within 24 hours!",
    loserAvatar: "https://via.placeholder.com/40",
    finderAvatar: "https://via.placeholder.com/40",
    itemImage: "https://via.placeholder.com/400x200",
    likes: 152,
    comments: 23
  },
  {
    id: 2,
    loserName: "Mike Chen",
    finderName: "Lisa Wong",
    item: "Laptop",
    description: "Left my laptop on the train. Lisa found it and used the app to contact me. So grateful!",
    loserAvatar: "https://via.placeholder.com/40",
    finderAvatar: "https://via.placeholder.com/40",
    itemImage: "https://via.placeholder.com/400x200",
    likes: 98,
    comments: 15
  },
  {
    id: 3,
    loserName: "Emily Davis",
    finderName: "Alex Turner",
    item: "Pet Dog",
    description: "My dog ran away during a storm. Alex found him and posted on this app. We were reunited in hours!",
    loserAvatar: "https://via.placeholder.com/40",
    finderAvatar: "https://via.placeholder.com/40",
    itemImage: "https://via.placeholder.com/400x200",
    likes: 231,
    comments: 42
  }
];

export default function App() {
  const dispatch = useDispatch();
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {successStories.map((story) => (
          <SuccessStoryCard key={story.id} story={story} />
        ))}
      </ScrollView>
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

