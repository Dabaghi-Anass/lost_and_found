import DefaultItemImage from "@/assets/images/unknown-item.jpg";
import { getImageOrDefaultTo } from "@/lib/utils";
import { Item } from '@/types/entities.types';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
interface ItemCardProps {
  item: Item;
}

export default function ItemMinifiedCard({ item }: ItemCardProps) {
  if (!item?.item) return null;
  return (<TouchableOpacity className='flex flex-row gap-4 bg-card p-4 rounded-lg border border-muted elevation-sm'
    onPress={() => {
      router.push(`/item-details/${item.id}`);
    }}>
    <Image
      source={getImageOrDefaultTo(item?.item.images[0], DefaultItemImage)}
      className='rounded-lg w-[100px] h-[100px] max-w-[100px] max-h-[100px]'
    />
    <View className='gap-2'>
      <Text className='text-xl font-bold text-foreground truncate max-w-[150px]' numberOfLines={1} >{item?.item.title}</Text>
      <View className="w-full">
        <Text className='text-sm text-muted-foreground max-w-[150px]' numberOfLines={1} ellipsizeMode="tail">{item?.item.description}</Text>
        <Text className='text-sm text-muted-foreground'>{item?.type} on {new Date((item?.found_lost_at as any)).toLocaleDateString("en-US", {
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

