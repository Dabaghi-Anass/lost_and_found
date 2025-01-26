import { SubFormProps } from '@/app/declare-item/[option]';
import { AppButton } from '@/components/AppButton';
import { Input } from '@/components/Input';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
export function LocationAndDateForm({ formData, onFormData, onValidationStateChange }: SubFormProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState<string>("");
  const theme = useColorScheme()
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    onFormData(
      'coordinates',
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
    );
    let geocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (geocode.length > 0) {
      const { formattedAddress, district } = geocode[0];
      onFormData('location', `${formattedAddress}, ${district}`);
    }
  };

  const validateField = () => {
    if (formData.location.length < 5) {
      setError("Location must be at least 5 characters long");
      onValidationStateChange!(false);
    } else {
      setError("");
      onValidationStateChange!(true);
    }
  }

  useEffect(() => {
    (async () => {
      if (formData.location) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }
        const result: Location.LocationGeocodedLocation[] = await Location.geocodeAsync(formData.location);
        if (result.length === 0) return;
        onFormData("coordinates", {
          latitude: result[0].latitude,
          longitude: result[0].longitude,
        })
      }
    })()
    validateField();
  }, [formData.location]);

  return <View className="space-y-4">
    <View>
      <Text className="mb-2 text-xl text-foreground font-bold">Location</Text>
      <Text className='text-muted-foreground text-sm my-2'>please go to your favourite map provider and copy your location plus code address: example (2X9C+3W7, Fes, Morocco)
      </Text>

      <View className="flex-row items-center mb-2 ">
        <Input
          value={formData.coordinates ? formData?.coordinates?.latitude?.toString() : ''}
          placeholder="Latitude"
          keyboardType="numeric"
          className="flex-1 border-none rounded-md mr-2 text-foreground opacity-50"
          placeholderTextColor={theme === 'dark' ? 'gray' : 'black'}
          editable={false}
          style={{ color: "#ff9100", fontWeight: "bold" }}
        />
        <Input
          value={formData?.coordinates ? formData?.coordinates?.longitude?.toString() : ''}
          placeholder="Longitude"
          keyboardType="numeric"
          className="flex-1 border-none rounded-md mr-2 text-foreground opacity-50"
          placeholderTextColor={theme === 'dark' ? 'gray' : 'black'}
          style={{ color: "#ff9100", fontWeight: "bold" }}
          editable={false}
        />

      </View>
      <View className="flex-row items-center ">
        <Input
          error={error}
          value={formData.location}
          onChangeText={(value) => onFormData('location', value)}
          placeholderTextColor="gray"
          placeholder="Where was it lost/found?"
          style={{ color: "#ff9100", fontWeight: "bold" }}
          className="flex-1 border-none rounded-md mr-2 text-foreground"
        />
        <AppButton
          onPress={getCurrentLocation}
          className="bg-indigo-600 rounded-lg"
        >
          <MaterialIcons name="my-location" size={28} color="white" />
        </AppButton>
      </View>
      {formData.coordinates && (
        <Text className="mt-2 text-sm text-gray-600">
          Lat: {formData.coordinates.latitude?.toFixed(6)}, Long:{' '}
          {formData.coordinates.longitude?.toFixed(6)}
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
      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={formData.date.toISOString().split('T')[0]}
          onChange={(event) => onFormData('date', new Date(event.target.value))}
          className="border-none rounded-md p-2 text-foreground"
        />
      ) :
        <>
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
        </>
      }
    </View >
  </View >
}
