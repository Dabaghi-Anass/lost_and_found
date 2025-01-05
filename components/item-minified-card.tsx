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

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item.id as string)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: mainImage }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {item.item.title}
          </Text>
          <View style={[styles.badge, { backgroundColor: item.item.color }]}>
            <Text style={styles.badgeText}>{item.type}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.item.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Feather name="map-pin" size={14} color="#666" />
            <Text style={styles.footerText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Feather name="calendar" size={14} color="#666" />
            <Text style={styles.footerText}>{formattedDate}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    color: '#333',
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
    color: '#666',
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
    color: '#666',
    marginLeft: 4,
    maxWidth: 200,
  },
});

