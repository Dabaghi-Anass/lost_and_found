import DefaultUserImage from "@/assets/images/default-user-image.jpg";
import DefaultItemImage from "@/assets/images/unknown-item.jpg";
import { getImageOrDefaultTo } from "@/lib/utils";
import { Item } from '@/types/entities.types';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { AppButton } from './AppButton';
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
    <View className='card bg-card border border-muted w-full web:w-[270px] md:web:w-[350px] overflow-hidden rounded-2xl'>
      <View style={styles.imageContainer}>
        <Image
          source={getImageOrDefaultTo(itemDetails.images?.[0], DefaultItemImage)}
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
          <View className="max-w-[90%]">
            <Text style={styles.title} className='text-card-foreground truncate max-w-[90%]'>{itemDetails.title} Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore, nostrum corrupti eveniet beatae voluptate fugiat eligendi laborum. Expedita pariatur non explicabo aliquid, excepturi quasi, suscipit ipsa, laboriosam enim libero minus.</Text>
            <Text style={styles.description} className="truncate">{itemDetails.description} Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos, unde minima expedita culpa labore laboriosam fugit recusandae, odit blanditiis delectus exercitationem ipsam ducimus? Ipsam excepturi doloremque numquam quibusdam rem blanditiis.</Text>
          </View>
          <View style={[styles.colorIndicator, { backgroundColor: itemDetails.color }]} />
        </View>
        <View style={styles.locationRow}>
          <Entypo name="location-pin" size={14} color="#6B7280" />
          <Text style={styles.locationText} className="truncate">{location}</Text>
        </View>
        <Text style={styles.dateText}>{formatDate(new Date(found_lost_at).toISOString())}</Text>
      </View>
      <View style={styles.footer} className='border-t border-muted'>
        <Pressable onPress={() => onViewProfile(ownerId)}>
          <View style={styles.avatar}>
            <Pressable onPress={() => onViewProfile(ownerId)}>
              <Avatar alt="user image">
                <AvatarImage className="max-w-10 max-h-10 object-center object-cover" source={getImageOrDefaultTo(owner?.imageUri, DefaultUserImage)} />
                <AvatarFallback>
                  <AntDesign name="user" size={20} color="#6B7280" />
                </AvatarFallback>
              </Avatar>
            </Pressable>
          </View>
        </Pressable>
        <AppButton onPress={() => onViewDetails(id as string)} variant="primary" size="sm">
          <Text className='text-primary-foreground'>View Details</Text>
        </AppButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: 'hidden',
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
    width: '100%',
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
