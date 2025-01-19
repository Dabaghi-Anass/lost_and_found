

import { Item } from '@/types/entities.types';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type Props = {
  item: Item;
}

export default function SuccessStoryCard({ item }: Props) {
  return (
    <View className='gap-4 p-4 bg-card elevation-md border border-muted rounded-lg'>
      <View className='flex-row gap-4 items-center justify-between'>
        <Avatar alt="hello">
          <AvatarImage source={{
            uri: item?.owner?.imageUri || ''
          }} />
          <AvatarFallback>
            <Text style={{ color: '#fff', fontSize: 20 }}>{item?.owner?.firstName}</Text>
          </AvatarFallback>
        </Avatar>
        <Text className='text-foreground text-xl max-w-[70%]' lineBreakMode='middle' numberOfLines={1}>{item.owner.firstName} delivered {item.item.title} to {item.realOwner.firstName}</Text>
        <Avatar alt="hello">
          <AvatarImage source={{
            uri: item?.realOwner?.imageUri || ''
          }} />
          <AvatarFallback>
            <Text style={{ color: '#fff', fontSize: 20 }}>{item?.realOwner?.firstName}</Text>
          </AvatarFallback>
        </Avatar>
      </View>
      <View className='w-full flex-row items-center flex-wrap gap-4'>
        {item.item.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image as any }}
            style={{ width: 100, height: 100, borderRadius: 8 }}
          />
        ))}
      </View>
    </View>
  );

}