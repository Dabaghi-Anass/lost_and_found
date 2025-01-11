

import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  story: {
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
}

export default function SuccessStoryCard({ story }: Props) {
  return (<View className='bg-white rounded-lg shadow-md p-4 mb-4'>
    <Text className='text-lg font-bold'>{story.loserName} lost {story.item}</Text>
  </View>)
}