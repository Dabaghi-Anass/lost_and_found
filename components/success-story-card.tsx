

import { Item } from '@/types/entities.types';
import React from 'react';
import { Text, View } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type Props = {
  item: Item;
}

export default function SuccessStoryCard({ item }: Props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
      <Avatar alt="hello">
        <AvatarImage source={{
          uri: item?.owner?.imageUri || ''
        }} />
        <AvatarFallback>
          <Text style={{ color: '#fff', fontSize: 20 }}>{item?.owner?.firstName}</Text>
        </AvatarFallback>
      </Avatar>
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item?.owner?.firstName}</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>{item?.location}</Text>
      </View>
      <Avatar alt="hello">
        <AvatarImage source={{
          uri: item?.realOwner?.imageUri || ''
        }} />
        <AvatarFallback>
          <Text style={{ color: '#fff', fontSize: 20 }}>{item?.realOwner?.firstName}</Text>
        </AvatarFallback>
      </Avatar>
    </View>
  );

}