import { saveItem, uploadImagesToServer } from '@/api/database';
import { AppButton } from '@/components/AppButton';
import { ChooseItemTypeForm } from '@/components/item-form/choose-item-type-form';
import { FormStatusHeader } from '@/components/item-form/form-status-header';
import { ItemDetailsForm } from '@/components/item-form/item-details-form';
import { LocationAndDateForm } from '@/components/item-form/location-and-date-form';
import { ImagesUploadForm } from '@/components/item-form/upload-image-form';
import ScrollScreen from '@/components/scroll-screen';
import { OptionType } from '@/types/entities.types';
import { ItemBuilder } from '@/types/entities/Item';
import { ItemDetailsBuilder } from '@/types/entities/ItemDetails';
import { GeolocationCoordinates } from '@/types/utils.types';
import { ImagePickerAsset } from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
export interface SubFormProps {
  formData: FormData,
  onValidationStateChange?: (state: boolean) => void,
  onFormData: (key: keyof FormData, data: any) => void
}
export interface FormData {
  type: OptionType;
  category: string;
  title: string;
  description: string;
  color: string;
  location: string;
  images: string[];
  coordinates: GeolocationCoordinates;
  date: Date;
}


export default function DeclareItemScreen() {
  const { option }: { option: OptionType } = useLocalSearchParams();
  const router = useRouter();
  const [assets, setAssets] = useState<ImagePickerAsset[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validationState, setValidationState] = useState<Map<number, boolean>>(new Map());
  const [formData, setFormData] = useState<FormData>({
    type: option || "lost",
    category: '',
    title: '',
    description: '',
    color: '#6366f1',
    location: '',
    coordinates: {} as GeolocationCoordinates,
    images: [],
    date: new Date(),
  });



  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const imagesUrls = await uploadImagesToServer(assets);
      const itemDetails = ItemDetailsBuilder
        .builder()
        .setColor(formData.color)
        .setCategory(formData.category)
        .setDescription(formData.description)
        .setTitle(formData.title)
        .setImages(imagesUrls)
        .build();
      const item = ItemBuilder
        .builder()
        .setItem(itemDetails)
        .setDelivred(false)
        .setOwnerId('')
        .setLostAt(formData.date)
        .setType(formData.type)
        .setLocation(formData.location)
        .setGeoCoordinates(formData.coordinates)
        .build();
      await saveItem(item);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving the item');
    }
    setLoading(false);
    Alert.alert('Success', 'Item has been saved successfully', [{
      text: 'OK',
      onPress: () => {
        router.replace("/(app)/home")
        setStep(1);
        setFormData({
          type: option || "lost",
          category: '',
          title: '',
          description: '',
          color: '#6366f1',
          location: '',
          images: [],
          coordinates: {
            latitude: 0,
            longitude: 0
          },
          date: new Date(),
        })
      }
    }]);
  };

  useEffect(() => {
    if (option) {
      updateFormData('type', option);
    }
    const validationStateClone = new Map(validationState);
    validationStateClone.set(1, true);
    setValidationState(validationStateClone);
  }, [option]);

  return (
    <ScrollScreen className={`flex-1 bg-muted px-4 py-6 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
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
            {step === 1 && <ChooseItemTypeForm
              formData={formData}
              onFormData={updateFormData} />}
            {step === 2 && <ItemDetailsForm
              formData={formData}
              onFormData={updateFormData}
              onValidationStateChange={(isValid) => {
                const validationStateClone = new Map(validationState);
                validationStateClone.set(2, isValid);
                setValidationState(validationStateClone);
              }} />}
            {step === 3 && <LocationAndDateForm
              formData={formData}
              onFormData={updateFormData}
              onValidationStateChange={(isValid) => {
                const validationStateClone = new Map(validationState);
                validationStateClone.set(3, isValid);
                setValidationState(validationStateClone);
              }} />}
            {step === 4 && <ImagesUploadForm
              onAssetsUploaded={setAssets}
              formData={formData} onFormData={updateFormData} />}


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
                  disabled={!validationState.get(step)}
                  onPress={nextStep}
                  className="flex-row items-center bg-indigo-600 px-4 py-2 rounded-md ml-auto"
                >
                  <Text className="text-white mr-2">Next</Text>
                  <ChevronRight color="white" size={20} />
                </AppButton>
              ) : (
                <AppButton
                  loading={loading}
                  disabled={loading}
                  onPress={handleSubmit}
                  className="bg-indigo-600 px-4 py-2 rounded-md ml-auto flex-row items-center gap-2"
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



