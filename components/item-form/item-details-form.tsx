import { SubFormProps } from '@/app/declare-item/[option]';
import AppColorPicker from '@/components/color-picker';
import { Input } from '@/components/Input';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ItemDetailsSchema } from '@/zod-schemas/schemas';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ZodIssue } from 'zod';


export function ItemDetailsForm({ formData, onFormData, onValidationStateChange }: SubFormProps) {
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
  </ScrollView>
}