import { saveItemDetails, uploadImagesToServer } from '@/api/database';
import { AppButton } from '@/components/AppButton';
import AppColorPicker from '@/components/color-picker';
import { Input } from '@/components/Input';
import ScrollScreen from '@/components/scroll-screen';
import { Checkbox } from '@/components/ui/checkbox';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { OptionType } from '@/types/entities.types';
import { ItemDetailsBuilder } from '@/types/entities/ItemDetails';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useLocalSearchParams } from "expo-router";
// import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableNativeFeedback, View } from 'react-native';

interface FormData {
  type: OptionType;
  category: string;
  title: string;
  description: string;
  color: string;
  location: string;
  images: string[];
  coordinates: { latitude: number; longitude: number } | null;
  date: Date;
}


export default function DeclareItemScreen() {
  const { option }: { option: OptionType } = useLocalSearchParams();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    type: option || "lost",
    category: '',
    title: '',
    description: '',
    color: '#6366f1',
    location: '',
    images: [],
    coordinates: null,
    date: new Date(),
  });


  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));


  const handleSubmit = async () => {
    try {
      const imagesUrls = await uploadImagesToServer(formData.images);
      const item = ItemDetailsBuilder
        .builder()
        .setColor(formData.color)
        .setCategory(formData.category)
        .setDescription(formData.description)
        .setTitle(formData.title)
        .setImages([...formData.images])
        .build();

      const newItem = await saveItemDetails(item);
      console.log(newItem);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    if (option) {
      updateFormData('type', option);
    }
  }, [option]);
  return (
    <ScrollScreen className="flex-1 bg-muted px-4 py-6">
      <View className="rounded-xl flex-1 max-h-[80vh] overflow-hidden">
        <LinearGradient
          className='h-full max-h-full px-2'
          colors={['#233dfc', '#1e98fc']}
          start={[1, 0.9]}
        >
          <View className="p-4 py-6 h-20">
            <Text className="text-white text-3xl font-bold">
              {formData.type === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
            </Text>
          </View>
          <View className="p-4 bg-background rounded-lg  h-[68vh] flex justify-between">
            <FormStatusHeader step={step} />

            {step === 1 && <ChooseItemTypeForm formData={formData} onFormData={updateFormData} />}
            {step === 2 && <ItemDetailsForm formData={formData} onFormData={updateFormData} />}
            {step === 3 && <LocationAndDateForm formData={formData} onFormData={updateFormData} />}
            {step === 4 && <ImagesUploadForm formData={formData} onFormData={updateFormData} />}


            {/*card buttons*/}
            <View className="flex-row justify-between p-4 border-t border-muted mt-8">
              {step > 1 && (
                <AppButton
                  onPress={prevStep}
                  variant="secondary"
                  className='flex flex-row'
                >
                  <ChevronLeft size={20} color="gray" />
                  <Text className="ml-2 text-muted-foreground">Back</Text>
                </AppButton>
              )}
              {step < 4 ? (
                <AppButton
                  onPress={nextStep}
                  className="flex-row items-center bg-indigo-600 px-4 py-2 rounded-md ml-auto"
                >
                  <Text className="text-white mr-2">Next</Text>
                  <ChevronRight color="white" size={20} />
                </AppButton>
              ) : (
                <AppButton
                  onPress={handleSubmit}
                  className="bg-indigo-600 px-4 py-2 rounded-md ml-auto"
                >
                  <Text className="text-white">Submit</Text>
                </AppButton>
              )}
            </View>
          </View>
        </LinearGradient>
      </View >
    </ScrollScreen >
  );
}

function FormStatusHeader({ step }: { step: number }) {
  return <View className="flex-row justify-between mb-6">
    {['Type', 'Details', 'Location', 'Images'].map((label, i) => (
      <View key={label} className="items-center">
        <View
          className={`h-8 w-8 rounded-full ${i + 1 <= step ? 'bg-emerald-500' : 'bg-gray-300 opacity-50'
            } items-center justify-center mb-1`}
        >
          <Text className="text-white font-bold">{i + 1}</Text>
        </View>
        <Text
          className={i + 1 <= step ? 'text-emerald-500' : 'text-gray-500'}
        >
          {label}
        </Text>
      </View>
    ))}
  </View>
}

function ImagesUploadForm({ formData, onFormData }: { formData: FormData, onFormData: (key: keyof FormData, data: any) => void }) {
  const handleUploadImagesFromStorage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uploadedImages = await Promise.all(
        result.assets.map(async (asset: any) => {
          return asset.uri;
        })
      );
      onFormData('images', [...formData.images, ...uploadedImages]);
    }
  };
  return <View className="image-upload-form space-y-4 h-[60%] flex flex-start gap-4">
    <ImagesPreview
      images={formData.images}
      onSelect={(index) => {
        const images = [...formData.images];
        [images[0], images[index + 1]] = [images[index + 1], images[0]];
        onFormData('images', images);
      }}
      onDelete={(index) => {
        const images = [...formData.images];
        images.splice(index + 1, 1);
        onFormData('images', images);
      }}

    />
    <AppButton
      onPress={() => {
        handleUploadImagesFromStorage()
      }}
      variant="primary"
      className="px-4 py-2 rounded-md">
      Upload Images
    </AppButton>

  </View>
}

function ChooseItemTypeForm({ formData, onFormData }: { formData: FormData, onFormData: (key: keyof FormData, data: any) => void }) {
  return <View className="py-8">
    <Text className="font-bold mb-8 text-muted-foreground text-2xl">
      What would you like to report?
    </Text>

    <View className='gap-4'>
      <TouchableNativeFeedback onPress={() => onFormData('type', 'lost')}>
        <View className='flex-row gap-4 items-center'>
          <Checkbox
            checkSize={30}
            style={{
              width: 40,
              height: 40,
            }}
            checked={formData.type === "lost"} onCheckedChange={(checked) => {
              if (checked) {
                onFormData('type', 'lost');
              } else {
                onFormData('type', 'found');
              }
            }} />
          <Text className="font-semibold text-3xl text-foreground font-secondary">Lost Item</Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => onFormData('type', 'found')}>
        <View className='flex-row gap-4 items-center'>
          <Checkbox
            checkSize={30}
            style={{
              width: 40,
              height: 40,
            }}
            checked={formData.type === "found"} onCheckedChange={(checked) => {
              if (checked) {
                onFormData('type', 'found');
              } else {
                onFormData('type', 'lost');
              }
            }} />
          <Text className="font-semibold text-3xl text-foreground font-secondary">Found Item</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  </View>
}

function LocationAndDateForm({ formData, onFormData }: { formData: FormData, onFormData: (key: keyof FormData, data: any) => void }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    onFormData('coordinates', {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    onFormData(
      'location',
      `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`
    );
  };
  return <View className="space-y-4">
    <View>
      <Text className="mb-2 text-xl text-foreground font-bold">Location</Text>
      <View className="flex-row items-center">
        <Input
          value={formData.location}
          onChangeText={(value) => onFormData('location', value)}
          placeholderTextColor="gray"
          placeholder="Where was it lost/found?"

          style={{ color: "#ff9100", fontWeight: "bold" }}
          className="flex-1 border border-gray-300 rounded-md mr-2 text-foreground"
        />
        <AppButton
          size="sm"
          onPress={getCurrentLocation}
          className="h-12 py-2 bg-indigo-600 rounded-md"
        >
          <MaterialIcons name="my-location" size={28} color="white" />
        </AppButton>
      </View>
      {formData.coordinates && (
        <Text className="mt-2 text-sm text-gray-600">
          Lat: {formData.coordinates.latitude.toFixed(6)}, Long:{' '}
          {formData.coordinates.longitude.toFixed(6)}
        </Text>
      )}
    </View>

    <View>
      <Text className="text-xl text-foreground font-bold mb-4 mt-4">Date</Text>
      <Text className="text-2xl text-accent font-bold mb-4 mt-4">{formData.date.toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}</Text>
      <AppButton onPress={() => setShowDatePicker(true)}>
        pick date
      </AppButton>
      {showDatePicker && (
        <DateTimePicker
          accentColor='yellow'
          style={{ backgroundColor: 'white' }}
          value={formData.date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              onFormData('date', selectedDate);
            }
          }}
        />
      )}
    </View>
  </View>
}

function ItemDetailsForm({ formData, onFormData }: { formData: FormData, onFormData: (key: keyof FormData, data: any) => void }) {
  const colorTheme = useColorScheme();
  return <View className="space-y-4 flex gap-2">
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
            backgroundColor: formData.color,
          }} />
        <AppColorPicker
          value={formData.color}
          onChange={(color) => onFormData('color', color)} />
        <View
          className='w-1/3 h-full rounded ml-2'
          style={{
            backgroundColor: formData.color,
          }} />
      </View>
    </View>
  </View>
}
function ImagesPreview({ images, onSelect, onDelete }: {
  images: string[],
  onDelete: (index: number) => void
  onSelect?: (index: number) => void,
}) {
  const [indexesToDelete, setIndexesToDelete] = useState<string[]>([]);
  const addToToBeDeleted = (index: string) => {
    setIndexesToDelete([...indexesToDelete, index]);
  }
  const removeFromBeDeleted = (index: string) => {
    setIndexesToDelete(indexesToDelete.filter((i) => i !== index));
  }
  return (<View className='flex flex-col gap-2'>
    <Image
      source={{ uri: images[0] ?? "/assets/images/unknown-item.jpg" }}
      style={{
        width: "100%",
        aspectRatio: 16 / 9,
        borderRadius: 8,
      }}
    />
    <View className="flex-row gap-2 flex-wrap">
      {images.slice(1).map((image, i) => (
        <View key={`${image}withIndex${i}`}>
          {indexesToDelete.includes(`${image}withIndex${i}`) && (
            <AppButton onPress={() => onDelete(i)} variant="destructive" size="sm" className="absolute -top-2 -right-4 z-10 border border-foreground">
              <MaterialIcons name="delete" size={20} color="white" />
            </AppButton>
          )}

          <TouchableNativeFeedback
            onLongPress={() => addToToBeDeleted(`${image}withIndex${i}`)}
            onPress={() => {
              onSelect?.(i);
              removeFromBeDeleted(`${image}withIndex${i}`);
            }}>
            <Image

              className='border-2 border-white shadow-lg'
              source={{ uri: image }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
              }}
            />
          </TouchableNativeFeedback>
        </View>
      ))}
    </View>
  </View>
  );
}