import { Item } from '@/types/entities.types';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ItemCardProps {
  item: Item;
  onViewDetails: (id: string) => void;
  onViewProfile: (ownerId: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onViewDetails,
  onViewProfile,
}) => {
  const { id, item: itemDetails, location, ownerId, type, found_lost_at } = item
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPp');
    } catch (error) {
      console.error('Error parsing date:', error);
      return dateString;
    }
  };

  return (
    <View style={styles.card} className='card'>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: itemDetails.images?.[0] || 'https://via.placeholder.com/300' }}
          style={styles.image}
        />
        <View style={[styles.badge, { backgroundColor: type === 'found' ? '#10B981' : '#EF4444' }]}>
          <Text style={styles.badgeText}>{type === 'found' ? 'Found' : 'Lost'}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>{itemDetails.title}</Text>
            <Text style={styles.description}>{itemDetails.description}</Text>
          </View>
          <View style={[styles.colorIndicator, { backgroundColor: itemDetails.color }]} />
        </View>
        <View style={styles.locationRow}>
          <Entypo name="location-pin" size={14} color="#6B7280" />
          <Text style={styles.locationText}>{location}</Text>
        </View>
        <Text style={styles.dateText}>{formatDate(new Date(found_lost_at).toISOString())}</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => onViewProfile(ownerId)}>
          <View style={styles.avatar}>
            <AntDesign name="user" size={20} color="#6B7280" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onViewDetails(id as string)}>
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    width: '95%',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ItemCard;
