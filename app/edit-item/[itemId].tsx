import { updateItem } from '@/api/database';
import { AppButton } from '@/components/AppButton';
import AppColorPicker from '@/components/color-picker';
import { Input } from '@/components/Input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Colors } from '@/constants/Colors';
import { firestore } from '@/database/fire_base';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFetch } from '@/hooks/useFetch';
import { FirebaseCollections } from '@/lib/constants';
import { saveItem } from '@/redux/global/items';
import { Item, ItemDetails } from '@/types/entities.types';
import { ItemDetailsBuilder } from '@/types/entities/ItemDetails';
import { ItemDetailsSchema } from '@/zod-schemas/schemas';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { deleteDoc, doc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ZodIssue } from 'zod';


interface SubFormProps {
  formData: FormData,
  onValidationStateChange?: (state: boolean) => void,
  onFormData: (key: keyof FormData, data: any) => void
}
interface FormData {
  category: string | undefined;
  title: string | undefined;
  description: string | undefined;
  color: string | undefined;
  images: string[];
}
export default function EditItemScreen() {
  const { itemId } = useLocalSearchParams();
  const router = useRouter();
  const theme = useColorScheme();
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const itemsFromStoreMap: Map<string, Item> = useSelector((state: any) => state.items);
  const { data: item, error, loading: itemLoading, refetch } = useFetch<ItemDetails>({
    id: itemId as string,
    collection: FirebaseCollections.ITEMS,
    cachedData: itemsFromStoreMap.get(itemId as string)?.item,
    cache: (data) => {
      const itemToSave = itemsFromStoreMap.get(itemId as string);
      if (itemToSave) {
        itemToSave.item = data;
        dispatch(saveItem(itemToSave))
      }
    },
  });

  const [formData, setFormData] = useState<FormData>({
    title: item?.title,
    description: item?.description,
    color: item?.color,
    category: item?.category,
    images: item?.images,
  } as FormData);


  const handleUpdate = async () => {
    setLoading(true);
    try {
      const newDetails = ItemDetailsBuilder.builder()
        .setTitle(formData.title as string)
        .setDescription(formData.description as string)
        .setCategory(formData.category as string)
        .setImages(formData.images)
        .setColor(formData.color as string)
        .build();
      await updateItem(itemId as string, newDetails);
      const itemToSave = itemsFromStoreMap.get(itemId as string);
      if (itemToSave) {
        newDetails.id = itemToSave.item.id;
        itemToSave.item = newDetails;
        dispatch(saveItem(itemToSave))
      }
      Alert.alert('Success', 'Item updated successfully');
      router.back();
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await deleteDoc(doc(firestore, FirebaseCollections.LOST_ITEMS, itemId as string));
              Alert.alert('Success', 'Item deleted successfully');
              router.replace('/');
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item');
            } finally {
              setLoading(false);
            }
          }
        },
      ]
    );
  };
  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...item
    }));
  }, [item]);
  useFocusEffect(useCallback(() => {
    if (item) {
      setFormData((prev) => ({
        ...prev,
        ...item
      }));
    }
  }, [item]));
  if (itemLoading) return <LoadingSpinner visible={itemLoading} />;
  if (error) return <Text className='text-3xl font-bold text-red-600'>{error}</Text>;

  return (
    <ScrollView className='bg-background h-full p-4'>
      <Text className='text-foreground text-2xl font-bold mb-4'>Edit Item</Text>
      <ItemDetailsForm
        formData={formData}
        onFormData={updateFormData}
        onValidationStateChange={(valid) => { }}
      />
      <ImagesView images={item?.images || []}
        onUpdateImages={(images) => {
          setFormData({ ...formData, images });
        }} />
      <View className='py-4 gap-4'>
        <AppButton variant="default" size="sm" onPress={undefined}>Upload More Images</AppButton>
        <AppButton variant="primary" onPress={handleUpdate}>Update Item</AppButton>
      </View>

    </ScrollView>
  );
}

interface ImagesViewProps {
  images: string[];
  onUpdateImages: (images: string[]) => void;
}

function ImagesView({ images, onUpdateImages }: ImagesViewProps) {
  return <View className='flex gap-4'>
    <Text className='text-foreground text-2xl font-bold my-4'>Images</Text>
    <View className='flex gap-4'>
      {images.map((image, index) => (
        <View key={index} className='relative'>
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 8 }}
          />
          <TouchableOpacity
            onPress={() => {
              const updatedImages = images.filter((uri) => uri !== image);
              onUpdateImages(updatedImages);
            }}
            className='absolute top-0 right-0 bg-white p-1 rounded-full'
          >
            <AntDesign name="delete" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  </View>
}


function ItemDetailsForm({ formData, onFormData, onValidationStateChange }: SubFormProps) {
  const colorTheme = useColorScheme();
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const validateFormData = () => {
    try {
      setErrors(new Map());
      const itemDetails = ItemDetailsSchema.parse(formData);
      onValidationStateChange!(true);
    } catch (e: any) {
      onValidationStateChange!(false);
      const errorsMap: Map<string, string> = new Map();
      e.errors.forEach((error: ZodIssue) => {
        errorsMap.set(`${error.path[0]}`, `${error.path[0]} ${error.message}`);
        console.log(error);
      });
      setErrors(errorsMap);
    }
  }
  useEffect(() => {
    validateFormData();
  }, [formData])

  return <ScrollView>
    <View className="space-y-4 flex gap-2">
      <View className='flex gap-2'>
        <Text className="font-bold mb-2 text-foreground text-xl">Category</Text>
        <View className="border border-gray-300 rounded-md">
          <Picker
            dropdownIconColor={Colors[colorTheme ?? 'light'].text}
            selectedValue={formData.category}
            mode='dropdown'
            style={{ color: Colors[colorTheme ?? 'light'].text }}
            onValueChange={(value) => onFormData('category', value)}
          >
            <Picker.Item label="Select category" value="" />
            <Picker.Item label="Electronics" value="electronics" />
            <Picker.Item label="Clothing" value="clothing" />
            <Picker.Item label="Accessories" value="accessories" />
            <Picker.Item label="Documents" value="documents" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </View>

      <View className='flex gap-2'>
        <Text className="font-bold mb-2 text-foreground text-xl">Title</Text>
        <Input
          error={errors.get('title')}
          value={formData.title}
          style={{ color: Colors[colorTheme ?? 'light'].text }}
          onChangeText={(value: string) => onFormData('title', value)}
          placeholderTextColor="gray"
          placeholder="Brief title of the item"
        />
      </View>

      <View className='flex gap-2'>
        <Text className="font-bold mb-2 text-foreground text-xl">Description</Text>
        <Input
          error={errors.get('description')}
          value={formData.description}
          style={{ color: Colors[colorTheme ?? 'light'].text }}
          onChangeText={(value) => onFormData('description', value)}
          placeholderTextColor="gray"
          placeholder="Detailed description of the item"
          multiline
          numberOfLines={10}
        />
      </View>

      <View>
        <Text className="font-bold mb-2 text-foreground text-xl">Color</Text>
        <View className="border border-gray-300 rounded-md p-2 flex flex-start flex-row">
          <View
            className='w-1/3 h-full rounded mr-2'
            style={{
              backgroundColor: formData.color || "#ff0000",
            }} />
          <AppColorPicker
            value={formData.color}
            onChange={(color) => onFormData('color', color)} />
          <View
            className='w-1/3 h-full rounded ml-2'
            style={{
              backgroundColor: formData.color || "#ff0000",
            }} />
        </View>
      </View>
    </View>
  </ScrollView>
}