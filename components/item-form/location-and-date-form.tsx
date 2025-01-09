import { SubFormProps } from '@/app/declare-item/[option]';
import { AppButton } from '@/components/AppButton';
import { Input } from '@/components/Input';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
export function LocationAndDateForm({ formData, onFormData, onValidationStateChange }: SubFormProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{ latitude: number, longitude: number }>();
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setCoordinates({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
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
    validateField();
  }, [formData.location]);

  return <View className="space-y-4">
    <View>
      <Text className="mb-2 text-xl text-foreground font-bold">Location</Text>
      <View className="flex-row items-start">
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
          size="sm"
          onPress={getCurrentLocation}
          className="h-12 py-2 bg-indigo-600 rounded-md"
        >
          <MaterialIcons name="my-location" size={28} color="white" />
        </AppButton>
      </View>
      {coordinates && (
        <Text className="mt-2 text-sm text-gray-600">
          Lat: {coordinates.latitude.toFixed(6)}, Long:{' '}
          {coordinates.longitude.toFixed(6)}
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