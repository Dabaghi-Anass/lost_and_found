import { useColorScheme } from '@/hooks/useColorScheme';
import { Item } from '@/types/entities.types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ItemCardProps {
  item: Item;
  onPress: (id: string) => void;
}

export default function ItemMinifiedCard({ item, onPress }: ItemCardProps) {
  const mainImage = item.item.images[0] || 'https://via.placeholder.com/150';
  const formattedDate = new Date(item.found_lost_at).toLocaleDateString();
  const theme = useColorScheme()
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme == 'light' ? 'hsl(250,30%,100%)' : 'hsl(250,25%,20%)' }]}
      onPress={() => onPress(item.id as string)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: mainImage }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} className='text-foreground' numberOfLines={1}>
            {item.item.title}
          </Text>
          <View style={[styles.badge, { backgroundColor: item.item.color }]}>
            <Text style={styles.badgeText}>{item.type}</Text>
          </View>
        </View>

        <Text style={styles.description} className='text-foreground' numberOfLines={2}>
          {item.item.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Feather name="map-pin" size={14} color={theme === "dark" ? "white" : "#111"} />
            <Text style={styles.footerText} className='text-foreground' numberOfLines={1}>
              {item.location}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Feather name="calendar" size={14} color={theme === "dark" ? "white" : "#111"} />
            <Text style={styles.footerText} className='text-foreground'>{formattedDate}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 5,
    padding: 12,
    elevation: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginLeft: 4,
    maxWidth: 200,
  },
});

