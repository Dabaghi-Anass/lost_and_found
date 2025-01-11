import { Item } from '@/types/entities.types';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

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
  const { id, item: itemDetails, location, ownerId, type, found_lost_at, owner } = item
  const currentUser = useSelector((state: any) => state.user)
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPp');
    } catch (error) {
      console.error('Error parsing date:', error);
      return dateString;
    }
  };

  const isOwnItem = currentUser?.id === ownerId

  return (
    <View style={styles.card} className='card bg-card border border-muted'>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: itemDetails.images?.[0] || 'https://via.placeholder.com/300' }}
          style={styles.image}
        />
        {isOwnItem && <View style={[styles.badge, {
          left: 8,
          right: 'auto',
        }]} className='bg-pink-600 rounded-full'>
          <Text className='text-white '>your item</Text>
        </View>}
        <View style={[styles.badge, { backgroundColor: type === 'found' ? '#10B981' : '#EF4444' }]}>
          <Text style={styles.badgeText}>{type === 'found' ? 'Found' : 'Lost'}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title} className='text-card-foreground'>{itemDetails.title}</Text>
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
      <View style={styles.footer} className='border-t border-muted'>
        <TouchableOpacity onPress={() => onViewProfile(ownerId)}>
          <View style={styles.avatar}>
            <TouchableOpacity onPress={() => onViewProfile(ownerId)}>
              <Avatar alt="user image">
                <AvatarImage source={{
                  uri: owner?.imageUri as any
                }} />
                <AvatarFallback>
                  <AntDesign name="user" size={20} color="#6B7280" />
                </AvatarFallback>
              </Avatar>
            </TouchableOpacity>
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
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    elevation: 1,
    marginBottom: 16,
    borderWidth: 1,
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
