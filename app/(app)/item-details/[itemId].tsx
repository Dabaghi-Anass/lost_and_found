import { fetchItemById } from '@/api/database';
import { colorLightness } from '@/lib/utils';
import { Item } from '@/types/entities.types';
import { format, parseISO } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { Calendar, MapPin, MessageCircle, Package2, Share2, Tag } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView, Share, StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
const { width } = Dimensions.get('window');

export default function ItemDetailsScreen() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { itemId } = useLocalSearchParams()
  const [item, setItem] = useState<Item | null>(null)
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPp');
    } catch (error) {
      console.error('Error parsing date:', error);
      return dateString;
    }
  };

  const openMap = () => {
    if (!item) return
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q='
    });
    const latLng = `${item.geoCoordinates?.latitude},${item.geoCoordinates?.longitude}`;
    const label = item.location;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url || "");
  };

  const handleShare = async () => {
    if (!item) return
    try {
      await Share.share({
        message: `Check out this ${item.type} item: ${item.item.title} at ${item.location}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    const fetchItem = async () => {
      try {
        const fetchedItem = await fetchItemById(itemId as string)
        if (fetchedItem) {
          setItem(fetchedItem)
          setLoading(false)
        }
      } catch (error) {
        console.error(error)
      }
    }
    setLoading(true)
    fetchItem()
  }, [itemId])
  if (!item || loading) return <View className='flex-1 items-center justify-center'>
    <ActivityIndicator size="large" color="#000" />
  </View>
  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.item.images[selectedImage] }}
          style={styles.mainImage}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
        >
          {item.item.images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImage(index)}
              style={[
                styles.thumbnailButton,
                selectedImage === index && styles.thumbnailButtonActive
              ]}
            >
              <Image
                source={{ uri: image }}
                style={styles.thumbnailImage}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.item.title}</Text>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Tag width={16} height={16} color="#666" />
              <Text style={styles.badgeText}>{item.item.category}</Text>
            </View>
            <View style={[styles.badge, {
              backgroundColor: item.item.color,
            }]}>
              <Text style={[styles.badgeText, { color: colorLightness(item.item.color as string) > 50 ? "black" : "white" }]}>Color</Text>
            </View>
            <View style={styles.badge}>
              <Package2 width={16} height={16} color="#666" />
              <Text style={styles.badgeText}>
                {item.delivred ? 'Delivered' : 'Not Delivered'}
              </Text>
            </View>
          </View>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Location */}
        <TouchableOpacity style={styles.infoRow} onPress={openMap}>
          <MapPin width={20} height={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoText}>{item.location}</Text>
            <Text style={styles.infoText}>
              {item.geoCoordinates?.latitude}, {item.geoCoordinates?.longitude}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Date */}
        <View style={styles.infoRow}>
          <Calendar width={20} height={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Date {
              item.type
            }</Text>
            <Text style={styles.infoText}>{formatDate(item.found_lost_at.toISOString())}</Text>
          </View>
        </View>

        {/* Description */}
        {item.item.description && (
          <View style={styles.description}>
            <Text style={styles.infoLabel}>Description</Text>
            <Text style={styles.infoText}>{item.item.description}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <MessageCircle width={20} height={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Contact Owner</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
            <Share2 width={20} height={20} color="#000" />
            <Text style={styles.secondaryButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#f4f4f5',
  },
  mainImage: {
    width: '100%',
    height: width * 0.75,
    alignSelf: 'center',
    objectFit: "scale-down"
  },
  thumbnailContainer: {
    padding: 16,
  },
  thumbnailButton: {
    width: 80,
    height: 60,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailButtonActive: {
    borderColor: '#000',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: "scale-down"

  },
  detailsContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeText: {
    fontSize: 14,
    color: '#666',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

