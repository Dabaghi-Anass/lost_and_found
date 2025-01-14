import { Item } from '@/types/entities.types';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface ItemCardProps {
  item: Item;
}

export default function ItemMinifiedCard({ item }: ItemCardProps) {

  return (<TouchableOpacity className='flex flex-row gap-4 w-full bg-card p-4 rounded-lg elevate'
    onPress={() => {
      router.push(`/item-details/${item.id}`);
    }}>
    <Image
      source={{ uri: item?.item.images[0] }}
      className='rounded-lg w-[100px] h-[100px] web:w-[150px] web:h-[150px]'
    />
    <View className='gap-2'>
      <Text className='text-xl font-bold text-foreground'>{item?.item.title}</Text>
      <View>
        <Text className='text-sm text-muted-foreground'>{item?.item.description}</Text>
        <Text className='text-sm text-muted-foreground'>{item?.type} on {new Date((item?.found_lost_at as any)?.seconds as any).toLocaleDateString("en-US", {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</Text>
      </View>
      <View className='flex-row gap-2 items-center'>
        <View className={`flex flex-row items-center gap-2 p-2 rounded-lg ${item?.type === 'lost' ? 'bg-red-500' : 'bg-green-500'}`}>
          <Text className='text-white web:text-xs'>{item?.type.toUpperCase()}</Text>
        </View>
        <View style={{
          backgroundColor: item?.item.color,
          width: 20,
          height: 20,
          borderRadius: 15,

        }}
          className='border-2 border-foreground'></View>
      </View>
    </View>
  </TouchableOpacity>
  );
}

