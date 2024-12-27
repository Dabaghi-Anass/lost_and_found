import { AppButton } from '@/components/AppButton';
import AppColorPicker from '@/components/color-picker';
import { Input } from '@/components/Input';
import ScrollScreen from '@/components/scroll-screen';
import { Checkbox } from '@/components/ui/checkbox';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useLocalSearchParams } from "expo-router";
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
type OptionType = "lost" | "found";
interface FormData {
  type: OptionType;
  category: string;
  title: string;
  description: string;
  color: string;
  location: string;
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
    coordinates: null,
    date: new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    updateFormData('coordinates', {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    updateFormData(
      'location',
      `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`
    );
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <ScrollScreen className="flex-1 bg-muted px-4 py-6">
      <View className="rounded-xl shadow-md flex-1 overflow-hidden h-full bg-red-400">
        <LinearGradient
          className='h-full'
          colors={['#233dfc', '#1e98fc']}
          start={[0.5, 1]}
        >
          <View className="p-4 py-6 h-20">
            <Text className="text-white text-3xl font-bold">
              {formData.type === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
            </Text>
          </View>

          <View className="p-4 bg-background rounded-t-2xl h-full">
            <View className="flex-row justify-between mb-6">
              {['Type', 'Details', 'Location'].map((label, i) => (
                <View key={label} className="items-center">
                  <View
                    className={`h-8 w-8 rounded-full ${i + 1 <= step ? 'bg-indigo-600' : 'bg-gray-300'
                      } items-center justify-center mb-1`}
                  >
                    <Text className="text-white font-bold">{i + 1}</Text>
                  </View>
                  <Text
                    className={i + 1 <= step ? 'text-indigo-600' : 'text-gray-500'}
                  >
                    {label}
                  </Text>
                </View>
              ))}
            </View>

            {step === 1 && (
              <View className="py-8">
                <Text className="font-bold mb-2 text-foreground text-xl">
                  What would you like to report?
                </Text>

                <View className='gap-2'>
                  <View className='flex-row gap-4 items-center'>
                    <Checkbox
                      checked={formData.type === "lost"} onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData('type', 'lost');
                        } else {
                          updateFormData('type', 'found');
                        }
                      }} />
                    <Text className="font-bold text-xl text-foreground">Lost Item</Text>
                  </View>
                  <View className='flex-row gap-4 items-center'>
                    <Checkbox
                      checked={formData.type === "found"} onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData('type', 'found');
                        } else {
                          updateFormData('type', 'lost');
                        }
                      }} />
                    <Text className="font-bold text-xl text-foreground">Found Item</Text>
                  </View>
                </View>
              </View>
            )}

            {step === 2 && (
              <View className="space-y-4 flex gap-2">
                <View className='flex gap-2'>
                  <Text className="font-bold mb-2 text-foreground text-xl">Category</Text>
                  <View className="border border-gray-300 rounded-md">
                    <Picker
                      selectedValue={formData.category}

                      onValueChange={(value) => updateFormData('category', value)}
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
                    onChangeText={(value) => updateFormData('title', value)}
                    placeholderTextColor="gray"
                    placeholder="Brief title of the item"
                  />
                </View>

                <View className='flex gap-2'>
                  <Text className="font-bold mb-2 text-foreground text-xl">Description</Text>
                  <Input
                    value={formData.description}
                    onChangeText={(value) => updateFormData('description', value)}
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
                      onChange={(color) => updateFormData('color', color)} />
                    <View
                      className='w-1/3 h-full rounded ml-2'
                      style={{
                        backgroundColor: formData.color,
                      }} />
                  </View>
                </View>
              </View>
            )}

            {step === 3 && (
              <View className="space-y-4">
                <View>
                  <Text className="mb-2 text-xl text-foreground font-bold">Location</Text>
                  <View className="flex-row items-center">
                    <Input
                      value={formData.location}
                      onChangeText={(value) => updateFormData('location', value)}
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
                          updateFormData('date', selectedDate);
                        }
                      }}
                    />
                  )}
                </View>
              </View>
            )}
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
              {step < 3 ? (
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

