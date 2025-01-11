import { FormData } from '@/app/declare-item/[option]';
import { AppButton } from '@/components/AppButton';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
// import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

export function ImagesUploadForm({ formData, onFormData, onAssetsUploaded }: {
  onAssetsUploaded: (assets: ImagePicker.ImagePickerAsset[]) => void,
  formData: FormData, onFormData: (key: keyof FormData, data: any) => void
}) {
  const handleUploadImagesFromStorage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [16, 9],
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      const uploadedImages = result.assets.map((asset: ImagePicker.ImagePickerAsset) => {
        return asset.uri
      })
      onFormData('images', [...formData.images, ...uploadedImages]);
      onAssetsUploaded(result.assets);
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

          <Pressable
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
          </Pressable>
        </View>
      ))}
    </View>
  </View>
  );
}