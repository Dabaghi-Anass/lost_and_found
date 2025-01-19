import { AppButton } from '@/components/AppButton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFetch } from '@/hooks/useFetch';
import { FirebaseCollections } from '@/lib/constants';
import { setCurrentScreenName } from '@/redux/global/currentScreenName';
import { saveItem } from '@/redux/global/items';
import { Item } from '@/types/entities.types';
import { Feather } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, MapPin, Package2, Share2, Tag } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView, Share, StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
const { width } = Dimensions.get('window');

export default function ItemDetailsScreen() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { itemId } = useLocalSearchParams()
  const router = useRouter()
  const theme = useColorScheme();
  const currentUser = useSelector((state: any) => state.user);
  const itemsMap: Record<string, Item> = useSelector((state: any) => state.items);
  const dispatch = useDispatch();
  const { data: item, error, loading: itemLoading, refetch } = useFetch<Item>({
    id: (itemId || "__") as string,
    collection: FirebaseCollections.LOST_ITEMS,
    cachedData: itemsMap[itemId.toString()],
    cache: (data) => {
      if (itemId) {
        dispatch(saveItem(data as any))
      }
    },
    recursivefetchers: [
      {
        collectionName: FirebaseCollections.ITEMS,
        propertyName: 'item',
        idPropertyName: 'item',
      },
      {
        collectionName: FirebaseCollections.PROFILES,
        propertyName: 'owner',
        idPropertyName: 'ownerId',
      },
      {
        collectionName: FirebaseCollections.PROFILES,
        propertyName: 'realOwner',
        idPropertyName: 'realOwnerId',
      },
    ],
    convertersMap: {
      found_lost_at: (value: any) => value.seconds * 1000,
    }
  });
  const isOwnItem = currentUser.id === item?.ownerId;
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
      const itemLink = `https://lost-and-found-2b7b1.web.app/item-details/${item.id}`;
      await Share.share({
        message: `Check out this ${item.type} item: ${item.item.title} at ${item.location}\n${itemLink}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(setCurrentScreenName('lost item'));
  }, [itemId])
  if (!item?.item || loading) return <LoadingSpinner visible={!item || loading} />
  if (error) return <Text className='text-3xl font-bold text-red-600'>{error}</Text>
  return (<FlatList
    refreshing={loading}
    onRefresh={refetch}
    keyExtractor={(item) => item.id || '__'}
    data={[item]}
    renderItem={({ item }) => (
      <View className='bg-background h-full'>
        <View style={[styles.imageContainer, {
          backgroundColor: item.item.color
        }]}>
          <Image
            source={{ uri: item.item.images[selectedImage] }}
            style={styles.mainImage}
            className={`w-full h-[${width * 0.75}px]  web:h-[50vh] web:w-full web:max-w-[500px] self-center `}
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
                  selectedImage === index && styles.thumbnailButtonActive,
                ]}
                className='bg-background'
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
            <Text className='text-foreground' style={styles.title}>{item.item.title}</Text>
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, {
                backgroundColor: theme === "dark" ? "#2c2536" : "#f4f4f5",
              }]}>
                <Tag width={16} height={16} color="#666" />
                <Text className='text-foreground' style={styles.badgeText}>{item.item.category}</Text>
              </View>
              <View style={[styles.badge, {
                backgroundColor: theme === "dark" ? "#2c2536" : "#f4f4f5",
              }]}>
                <Package2 width={16} height={16} color="#666" />
                <Text className='text-foreground' style={styles.badgeText}>
                  {item.delivered ? 'Delivered' : 'Not Delivered'}
                </Text>
              </View>
              <View style={styles.typeBadge}>
                <Text className='text-foreground' style={styles.typeText}>{item.type.toUpperCase()}</Text>
              </View>
              <View style={[styles.badge, {
                backgroundColor: item.item.color,
                width: 30,
                height: 30,
              }]}
                className='border-2 border-foreground'>
              </View>
            </View>
          </View>

          {item.owner &&
            isOwnItem ?
            <View className='flex-row items-center gap-4'>
              <AppButton variant="success" onPress={() => {
                router.push(`/item-delivred/${item?.id}` as any)
              }}>
                <Text className='text-white text-xl'>{
                  item.delivered ? 'update receiver' : 'Mark as delivered '
                }</Text>
                <Feather name="edit" size={20} color="white" />
              </AppButton>
              <Link href={`/edit-item/${item.id}` as any} asChild>
                <AppButton variant="primary">
                  <Text className='text-white text-xl'>Edit Item</Text>
                  <Feather name="edit" size={20} color="white" />
                </AppButton>
              </Link>
            </View>
            :
            <TouchableOpacity onPress={() => {
              router.push(`/profile/${item.ownerId}`)
            }}>
              <View>
                <Text className='text-foreground text-xl my-4'>founder</Text>
                <View className='flex-row items-center gap-4' >
                  <Image
                    source={{ uri: item.owner.imageUri || "" }}
                    style={{ width: 50, height: 50, borderRadius: 100, borderColor: "white", borderWidth: 2 }}
                  />
                  <Text className='text-xl font-secondary text-foreground'>{item.owner?.firstName + " " + item.owner?.lastName}</Text>
                </View>
              </View>
            </TouchableOpacity>
          }
          <View style={styles.separator} />
          {item.realOwner && Object.keys(item.realOwner).length > 0 &&
            <TouchableOpacity onPress={() => {
              router.push(`/profile/${item.realOwnerId}`)
            }}>
              <View>
                <Text className='text-foreground text-xl my-4'>real owner</Text>
                <View className='flex-row items-center gap-4' >
                  <Image
                    source={{ uri: item.realOwner.imageUri || "" }}
                    style={{ width: 50, height: 50, borderRadius: 100, borderColor: "white", borderWidth: 2 }}
                  />
                  <Text className='text-xl font-secondary text-foreground'>{item.realOwner?.firstName + " " + item.realOwner?.lastName}</Text>
                </View>
              </View>
              <View style={styles.separator} />
            </TouchableOpacity>
          }

          {/* Location */}
          <TouchableOpacity style={styles.infoRow} onPress={openMap}>
            <MapPin width={20} height={20} color={theme === "dark" ? "white" : "#666"} />
            <View style={styles.infoContent}>
              <Text className='text-foreground' style={styles.infoLabel}>Location</Text>
              <Text className='text-foreground text-sm'>{item.location}</Text>
              <Text className='text-foreground text-sm'>
                {item.geoCoordinates?.latitude}, {item.geoCoordinates?.longitude}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Date */}
          <View style={styles.infoRow}>
            <Calendar width={20} height={20} color={theme === "dark" ? "white" : "#666"} />
            <View style={styles.infoContent}>
              <Text className='text-foreground' style={styles.infoLabel}>Date When {
                item.type
              }</Text>
              <Text className='text-foreground text-sm'>{formatDate(new Date(item.found_lost_at).toISOString())}</Text>
            </View>
          </View>

          {/* Description */}
          {item.item.description && (
            <View style={styles.description}>
              <Text className='text-foreground' style={styles.infoLabel}>Description</Text>
              <Text className='text-foreground text-lg'>{item.item.description}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel:${item.owner?.phoneNumber}`)
              }}
              style={[styles.primaryButton, {
                backgroundColor: "#00a170"
              }]}
            >
              <Feather name="phone-call" size={20} color="#fff" />
              <Text className='text-white' style={styles.primaryButtonText}>Call Owner</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
              <Share2 width={20} height={20} color="#000" />
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>)
    } />
  );
}

const styles = StyleSheet.create({
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
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 16,
    fontWeight: '600',
  },
});

